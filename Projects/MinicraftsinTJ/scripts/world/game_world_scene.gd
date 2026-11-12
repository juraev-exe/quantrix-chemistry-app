class_name GameWorldScene
extends Node3D

@onready var voxel_world: VoxelWorld = VoxelWorld.new()
@onready var day_night: DayNightCycle = DayNightCycle.new()
@onready var audio_mgr: AudioManager = AudioManager.new()
@onready var player: PlayerController = PlayerController.new()

@onready var hud: GameHUD = GameHUD.new()
@onready var inventory_ui: InventoryUI = InventoryUI.new()
@onready var pause_menu: PauseMenu = PauseMenu.new()

var animals_spawned: bool = false

func _ready() -> void:
	# 1. World & Lighting setup
	add_child(voxel_world)
	add_child(day_night)
	add_child(audio_mgr)

	# 2. Player setup
	add_child(player)
	
	# 2. Synchronously ensure spawn chunk is ready so player lands on solid ground
	var spawn_x: int = 8
	var spawn_z: int = 8
	voxel_world.ensure_chunk_immediate(Vector2i(0, 0))
	var top_y: int = voxel_world.get_highest_block_y(spawn_x, spawn_z)
	player.global_position = Vector3(float(spawn_x) + 0.5, float(top_y + 2), float(spawn_z) + 0.5)
	player.spawn_position = player.global_position

	# Restore saved player state if available
	if not voxel_world.loaded_player_data.is_empty():
		var pd = voxel_world.loaded_player_data
		if pd.has("x") and pd.has("y") and pd.has("z"):
			var sx = float(pd["x"])
			var sz = float(pd["z"])
			voxel_world.ensure_chunk_immediate(Vector2i(int(floor(sx / 16.0)), int(floor(sz / 16.0))))
			player.global_position = Vector3(sx, float(pd["y"]), sz)
		if pd.has("health"): player.survival_stats.health = float(pd["health"])
		if pd.has("hunger"): player.survival_stats.hunger = float(pd["hunger"])
		if pd.has("stamina"): player.survival_stats.stamina = float(pd["stamina"])
		if pd.has("temp"): player.survival_stats.body_temperature = float(pd["temp"])
		if pd.has("inventory"): player.inventory.deserialize(pd["inventory"])

	voxel_world.set_player(player)

	# 3. CanvasLayer for UI overlays
	var canvas: CanvasLayer = CanvasLayer.new()
	add_child(canvas)

	canvas.add_child(hud)
	canvas.add_child(inventory_ui)
	canvas.add_child(pause_menu)

	hud.set_player_reference(player)
	inventory_ui.set_player(player)

	# 4. Connect block sound effects
	voxel_world.block_modified.connect(_on_block_modified)
	player.tool_swung.connect(_on_tool_swung)

	# Wait for initial chunks to finish and spawn regional animals
	get_tree().create_timer(1.0).timeout.connect(_spawn_initial_wildlife)
	print("[TajikCraft] Game World Scene fully loaded at: ", player.global_position)

func _on_block_modified(world_pos: Vector3i, block_id: int) -> void:
	if block_id == BlockRegistry.BlockID.AIR:
		audio_mgr.play_block_break(BlockRegistry.BlockID.STONE)
	else:
		audio_mgr.play_block_place(block_id)

func _on_tool_swung() -> void:
	var active = player.inventory.get_active_item()
	if not active["is_block"] and active["id"] in [ItemRegistry.ItemID.DUTAR, ItemRegistry.ItemID.RUBAB]:
		audio_mgr.play_traditional_dutar_strum()

func _spawn_initial_wildlife() -> void:
	if animals_spawned:
		return
	animals_spawned = true

	var hb = voxel_world.terrain_generator.get_height_and_biome(player.global_position.x, player.global_position.z)
	var biome_id: int = hb["biome_id"]

	# Spawn 3-5 biome-appropriate animals around spawn
	var animal_types: Array[int] = []
	match biome_id:
		BiomeRegistry.BiomeID.PAMIR_MOUNTAINS:
			animal_types = [AnimalAI.AnimalType.MARCO_POLO_SHEEP, AnimalAI.AnimalType.YAK, AnimalAI.AnimalType.SNOW_LEOPARD]
		BiomeRegistry.BiomeID.FANN_MOUNTAINS:
			animal_types = [AnimalAI.AnimalType.SIBERIAN_IBEX, AnimalAI.AnimalType.BROWN_BEAR, AnimalAI.AnimalType.MARMOT]
		BiomeRegistry.BiomeID.ALPINE_MEADOWS:
			animal_types = [AnimalAI.AnimalType.MARCO_POLO_SHEEP, AnimalAI.AnimalType.HORSE, AnimalAI.AnimalType.YAK]
		BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY:
			animal_types = [AnimalAI.AnimalType.SHEEP, AnimalAI.AnimalType.DONKEY, AnimalAI.AnimalType.RED_FOX]
		_:
			animal_types = [AnimalAI.AnimalType.COW, AnimalAI.AnimalType.SHEEP, AnimalAI.AnimalType.DOG]

	animal_types.append(AnimalAI.AnimalType.GOLDEN_EAGLE)

	for i in range(animal_types.size()):
		var animal: AnimalAI = AnimalAI.new()
		animal.animal_type = animal_types[i]
		add_child(animal)

		var offset_x: float = randf_range(6.0, 16.0) * (-1.0 if randf() < 0.5 else 1.0)
		var offset_z: float = randf_range(6.0, 16.0) * (-1.0 if randf() < 0.5 else 1.0)
		var ax: float = player.global_position.x + offset_x
		var az: float = player.global_position.z + offset_z
		var ahb = voxel_world.terrain_generator.get_height_and_biome(ax, az)
		var spawn_y: float = float(ahb["height"] + 16) if animal_types[i] == AnimalAI.AnimalType.GOLDEN_EAGLE else float(ahb["height"] + 2)
		animal.global_position = Vector3(ax, spawn_y, az)

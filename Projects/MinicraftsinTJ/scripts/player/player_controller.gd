class_name PlayerController
extends CharacterBody3D

signal interaction_target_changed(block_name: String, distance: float)
signal tool_swung()
signal open_workstation(station_type: String)
signal action_notification(message: String)

const WALK_SPEED: float = 4.8
const SPRINT_SPEED: float = 7.5
const CROUCH_SPEED: float = 2.4
const SWIM_SPEED: float = 3.2
const JUMP_VELOCITY: float = 7.2
const GRAVITY: float = 20.0
const WATER_GRAVITY: float = 3.0
const MOUSE_SENSITIVITY: float = 0.0025
const REACH_DISTANCE: float = 5.0

enum CameraPerspective {
	FIRST_PERSON,
	THIRD_PERSON
}
var current_perspective: CameraPerspective = CameraPerspective.FIRST_PERSON

var head: Node3D = Node3D.new()
var camera: Camera3D = Camera3D.new()
var third_person_pivot: SpringArm3D = SpringArm3D.new()
var third_person_camera: Camera3D = Camera3D.new()
var interaction_ray: RayCast3D = RayCast3D.new()
var hand_item_mesh: MeshInstance3D = MeshInstance3D.new()
var avatar_root: Node3D = Node3D.new()

var survival_stats: SurvivalStats = SurvivalStats.new()
var inventory: InventoryManager = InventoryManager.new()

var is_crouching: bool = false
var is_in_water: bool = false
var fall_start_y: float = 0.0
var was_on_floor: bool = true

var mining_progress: float = 0.0
var target_block_pos: Vector3i = Vector3i.ZERO
var target_block_id: int = 0
var is_mining: bool = false
var swing_timer: float = 0.0
var spawn_position: Vector3 = Vector3(8.5, 30.0, 8.5)

static var hand_atlas_material: StandardMaterial3D = null

func _ready() -> void:
	GameManager.player_node = self
	_setup_hierarchy()
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _setup_hierarchy() -> void:
	add_child(survival_stats)
	add_child(inventory)

	head.name = "Head"
	head.position = Vector3(0, 1.6, 0)
	add_child(head)

	camera.name = "FirstPersonCamera"
	camera.current = true
	camera.fov = 75.0
	head.add_child(camera)

	third_person_pivot.name = "ThirdPersonArm"
	third_person_pivot.position = Vector3(0, 1.6, 0)
	third_person_pivot.spring_length = 3.5
	third_person_pivot.margin = 0.2
	add_child(third_person_pivot)

	third_person_camera.name = "ThirdPersonCamera"
	third_person_camera.current = false
	third_person_camera.fov = 75.0
	third_person_pivot.add_child(third_person_camera)

	interaction_ray.name = "InteractionRay"
	interaction_ray.target_position = Vector3(0, 0, -REACH_DISTANCE)
	interaction_ray.enabled = true
	camera.add_child(interaction_ray)

	hand_item_mesh.name = "HandItem"
	hand_item_mesh.position = Vector3(0.35, -0.3, -0.6)
	hand_item_mesh.scale = Vector3(0.22, 0.22, 0.22)
	camera.add_child(hand_item_mesh)

	_build_3rd_person_avatar()

	var col: CollisionShape3D = CollisionShape3D.new()
	var cap: CapsuleShape3D = CapsuleShape3D.new()
	cap.radius = 0.38
	cap.height = 1.75
	col.shape = cap
	col.position = Vector3(0, 0.875, 0)
	add_child(col)

	inventory.hotbar_selection_changed.connect(_on_hotbar_selection_changed)
	_update_hand_model()

func _build_3rd_person_avatar() -> void:
	avatar_root.name = "TajikExplorerAvatar"
	avatar_root.visible = false # Hidden in 1st person, shown in F5 3rd person
	add_child(avatar_root)

	# Chapan Tunic Torso
	var torso = MeshInstance3D.new()
	var torso_box = BoxMesh.new()
	torso_box.size = Vector3(0.55, 0.72, 0.30)
	var mat_chapan = StandardMaterial3D.new()
	mat_chapan.albedo_texture = TextureGenerator.get_tile_atlas_texture(115)
	mat_chapan.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	torso_box.material = mat_chapan
	torso.mesh = torso_box
	torso.position = Vector3(0, 1.05, 0)
	avatar_root.add_child(torso)

	# Head
	var head_m = MeshInstance3D.new()
	var head_box = BoxMesh.new()
	head_box.size = Vector3(0.42, 0.42, 0.42)
	var mat_skin = StandardMaterial3D.new()
	mat_skin.albedo_color = Color(0.88, 0.72, 0.58)
	head_box.material = mat_skin
	head_m.mesh = head_box
	head_m.position = Vector3(0, 1.62, 0)
	avatar_root.add_child(head_m)

	# Traditional Embroidered Toki Skullcap
	var toki = MeshInstance3D.new()
	var toki_box = BoxMesh.new()
	toki_box.size = Vector3(0.46, 0.16, 0.46)
	var mat_toki = StandardMaterial3D.new()
	mat_toki.albedo_texture = TextureGenerator.get_tile_atlas_texture(114)
	mat_toki.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	toki_box.material = mat_toki
	toki.mesh = toki_box
	toki.position = Vector3(0, 1.88, 0)
	avatar_root.add_child(toki)

	# Legs
	var leg_box = BoxMesh.new()
	leg_box.size = Vector3(0.22, 0.68, 0.24)
	var mat_pants = StandardMaterial3D.new()
	mat_pants.albedo_color = Color(0.18, 0.22, 0.28)
	leg_box.material = mat_pants

	var leg_l = MeshInstance3D.new()
	leg_l.mesh = leg_box
	leg_l.position = Vector3(-0.14, 0.34, 0)
	avatar_root.add_child(leg_l)

	var leg_r = MeshInstance3D.new()
	leg_r.mesh = leg_box
	leg_r.position = Vector3(0.14, 0.34, 0)
	avatar_root.add_child(leg_r)

func _unhandled_input(event: InputEvent) -> void:
	if GameManager.is_game_paused or survival_stats.is_dead:
		return

	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_y(-event.relative.x * MOUSE_SENSITIVITY)
		head.rotate_x(-event.relative.y * MOUSE_SENSITIVITY)
		head.rotation.x = clamp(head.rotation.x, deg_to_rad(-89), deg_to_rad(89))
		third_person_pivot.rotation.x = head.rotation.x

	if event.is_action_pressed("toggle_perspective"):
		_toggle_camera_perspective()

	for i in range(9):
		if event.is_action_pressed("hotbar_" + str(i + 1)):
			inventory.select_hotbar_slot(i)
			_update_hand_model()

	if event.is_action_pressed("pause"):
		GameManager.toggle_pause()

func _toggle_camera_perspective() -> void:
	if current_perspective == CameraPerspective.FIRST_PERSON:
		current_perspective = CameraPerspective.THIRD_PERSON
		camera.current = false
		third_person_camera.current = true
		hand_item_mesh.visible = false
		avatar_root.visible = true
	else:
		current_perspective = CameraPerspective.FIRST_PERSON
		camera.current = true
		third_person_camera.current = false
		hand_item_mesh.visible = true
		avatar_root.visible = false

func _physics_process(delta: float) -> void:
	if survival_stats.is_dead or GameManager.is_game_paused:
		return

	_update_water_and_environmental_state()
	_handle_movement(delta)
	_handle_interaction(delta)
	_animate_hand(delta)

func _update_water_and_environmental_state() -> void:
	var world = GameManager.world_node
	if world:
		var foot_block_pos = Vector3i(int(floor(global_position.x)), int(floor(global_position.y)), int(floor(global_position.z)))
		var block_at_feet = world.get_voxel_at(foot_block_pos)
		var block_at_head = world.get_voxel_at(foot_block_pos + Vector3i(0, 1, 0))
		is_in_water = (block_at_feet == BlockRegistry.BlockID.WATER or block_at_head == BlockRegistry.BlockID.WATER)
		survival_stats.is_swimming = is_in_water

		var near_fire: bool = false
		for dx in range(-2, 3):
			for dy in range(-1, 3):
				for dz in range(-2, 3):
					var id: int = world.get_voxel_at(foot_block_pos + Vector3i(dx, dy, dz))
					if id == BlockRegistry.BlockID.TANDOOR_OVEN or id == BlockRegistry.BlockID.TORCH:
						near_fire = true
						break
		survival_stats.is_near_fire = near_fire
		survival_stats.current_altitude = global_position.y

		# Update cold insulation from wearable equipment/hotbar items
		var insul: float = 0.0
		if inventory.has_item(ItemRegistry.ItemID.CHAPAN_COAT, 1, false):
			insul += 0.45
		if inventory.has_item(ItemRegistry.ItemID.TOKI_CAP, 1, false):
			insul += 0.15
		if inventory.has_item(ItemRegistry.ItemID.PAMIRI_SOCKS, 1, false):
			insul += 0.20
		survival_stats.cold_insulation = clamp(insul, 0.0, 0.85)

		var hb = world.terrain_generator.get_height_and_biome(global_position.x, global_position.z)
		survival_stats.current_biome_id = hb["biome_id"]

func _handle_movement(delta: float) -> void:
	if is_on_floor():
		if not was_on_floor:
			var fall_dist: float = fall_start_y - global_position.y
			if fall_dist > 4.5 and not is_in_water:
				var damage: float = (fall_dist - 4.0) * 12.0
				survival_stats.take_damage(damage, "fall")
		was_on_floor = true
		fall_start_y = global_position.y
	else:
		if was_on_floor:
			fall_start_y = global_position.y
		was_on_floor = false

	if is_in_water:
		velocity.y = move_toward(velocity.y, -WATER_GRAVITY, GRAVITY * 0.5 * delta)
		if Input.is_action_pressed("jump"):
			velocity.y = SWIM_SPEED
	else:
		if not is_on_floor():
			velocity.y -= GRAVITY * delta

	if Input.is_action_just_pressed("jump") and is_on_floor() and not is_in_water:
		if survival_stats.stamina > 10.0:
			velocity.y = JUMP_VELOCITY
			survival_stats.consume_jump_stamina()

	is_crouching = Input.is_action_pressed("crouch")
	var is_sprinting: bool = Input.is_action_pressed("sprint") and not is_crouching and survival_stats.can_sprint()
	survival_stats.is_sprinting = is_sprinting and velocity.length() > 0.5

	var speed: float = WALK_SPEED
	if is_in_water:
		speed = SWIM_SPEED
	elif is_crouching:
		speed = CROUCH_SPEED
	elif is_sprinting:
		speed = SPRINT_SPEED

	var target_head_y: float = 1.1 if is_crouching else 1.6
	head.position.y = move_toward(head.position.y, target_head_y, 4.0 * delta)
	third_person_pivot.position.y = head.position.y

	var input_dir: Vector2 = Input.get_vector("move_left", "move_right", "move_forward", "move_backward")
	var direction: Vector3 = (transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()

	if direction:
		velocity.x = direction.x * speed
		velocity.z = direction.z * speed
	else:
		velocity.x = move_toward(velocity.x, 0, speed * 8.0 * delta)
		velocity.z = move_toward(velocity.z, 0, speed * 8.0 * delta)

	move_and_slide()

func _handle_interaction(delta: float) -> void:
	var world = GameManager.world_node
	if not world:
		return

	if not interaction_ray.is_colliding():
		interaction_target_changed.emit("", 0.0)
		is_mining = false
		mining_progress = 0.0
		_check_non_voxel_right_click()
		return

	var collider = interaction_ray.get_collider()
	if collider is AnimalAI:
		interaction_target_changed.emit("Wildlife (Click to Interact / Hunt)", global_position.distance_to(collider.global_position))
		if Input.is_action_just_pressed("attack_break"):
			_trigger_swing()
			var active = inventory.get_active_item()
			var dmg: float = 6.0
			if not active["is_block"] and active["id"] != 0:
				dmg = ItemRegistry.get_item(active["id"]).get("tool_power", 6.0) * 2.5
			collider.take_damage(dmg)
		elif Input.is_action_just_pressed("place_use"):
			_trigger_swing()
			var msg: String = collider.interact_animal(self)
			if msg != "":
				action_notification.emit(msg)
		return

	var hit_point: Vector3 = interaction_ray.get_collision_point()
	var hit_normal: Vector3 = interaction_ray.get_collision_normal()
	var dist: float = global_position.distance_to(hit_point)

	var target_vpos = Vector3i(
		int(floor(hit_point.x - hit_normal.x * 0.1)),
		int(floor(hit_point.y - hit_normal.y * 0.1)),
		int(floor(hit_point.z - hit_normal.z * 0.1))
	)

	var place_vpos = Vector3i(
		int(floor(hit_point.x + hit_normal.x * 0.1)),
		int(floor(hit_point.y + hit_normal.y * 0.1)),
		int(floor(hit_point.z + hit_normal.z * 0.1))
	)

	var cur_block: int = world.get_voxel_at(target_vpos)
	if cur_block != BlockRegistry.BlockID.AIR:
		var block_info = BlockRegistry.get_block(cur_block)
		interaction_target_changed.emit(block_info["name"], dist)
	else:
		interaction_target_changed.emit("", 0.0)

	# Left Click: Mine / Break Block
	if Input.is_action_pressed("attack_break"):
		_trigger_swing()
		if cur_block != BlockRegistry.BlockID.AIR:
			if target_vpos != target_block_pos:
				target_block_pos = target_vpos
				target_block_id = cur_block
				mining_progress = 0.0

			var block_data = BlockRegistry.get_block(cur_block)
			var hardness: float = block_data.get("hardness", 1.0)
			
			var active = inventory.get_active_item()
			var speed_mult: float = 1.0
			if not active["is_block"] and active["id"] != 0:
				var item_data = ItemRegistry.get_item(active["id"])
				if item_data.get("is_tool", false):
					speed_mult = item_data.get("tool_power", 1.0)

			if GameManager.current_game_mode == GameManager.GameMode.CREATIVE:
				mining_progress = 100.0
			else:
				mining_progress += (delta * 3.5 * speed_mult) / max(0.1, hardness)

			if mining_progress >= 1.0:
				world.set_voxel_at(target_vpos, BlockRegistry.BlockID.AIR)
				var drop_id: int = block_data.get("drop_id", cur_block)
				var drop_is_blk: bool = block_data.get("drop_is_block", true)
				if drop_id != 0:
					inventory.add_item(drop_id, 1, drop_is_blk)
				mining_progress = 0.0
				_update_hand_model()
	else:
		mining_progress = 0.0
		is_mining = false

	# Right Click: Workstations, Farming, Fishing, Eating, Placing
	if Input.is_action_just_pressed("place_use"):
		_trigger_swing()
		var active = inventory.get_active_item()

		# 1. Workstations & Interactive Furniture
		if cur_block == BlockRegistry.BlockID.CRAFTING_TABLE:
			open_workstation.emit("crafting_table")
			return
		elif cur_block == BlockRegistry.BlockID.TANDOOR_OVEN:
			open_workstation.emit("tandoor")
			return
		elif cur_block == BlockRegistry.BlockID.BED:
			GameManager.world_time_hours = 7.0
			survival_stats.heal(35.0)
			spawn_position = Vector3(target_vpos) + Vector3(0.5, 1.5, 0.5)
			action_notification.emit("Rested in Tochak Bed! Morning arrived & Spawn Set.")
			return
		elif cur_block == BlockRegistry.BlockID.CHEST:
			inventory.add_item(ItemRegistry.ItemID.DRIED_APRICOTS, 3, false)
			inventory.add_item(ItemRegistry.ItemID.NON_BREAD, 2, false)
			action_notification.emit("Gathered Pamir provisions from Sanduq Chest!")
			return

		# 2. Farming (Tilling soil with Hoe / Planting seeds on Farmland)
		if not active["is_block"] and active["id"] in [ItemRegistry.ItemID.WOOD_HOE, ItemRegistry.ItemID.IRON_HOE]:
			if cur_block in [BlockRegistry.BlockID.GRASS, BlockRegistry.BlockID.DIRT, BlockRegistry.BlockID.LOESS_SOIL]:
				world.set_voxel_at(target_vpos, BlockRegistry.BlockID.FARMLAND)
				action_notification.emit("Tilled soil for Tajik crops!")
				return
		if not active["is_block"] and active["id"] in [ItemRegistry.ItemID.WHEAT_SEEDS, ItemRegistry.ItemID.COTTON_SEEDS]:
			if cur_block == BlockRegistry.BlockID.FARMLAND:
				var crop_block = BlockRegistry.BlockID.WHEAT_CROP if active["id"] == ItemRegistry.ItemID.WHEAT_SEEDS else BlockRegistry.BlockID.COTTON_PLANT
				world.set_voxel_at(target_vpos + Vector3i(0, 1, 0), crop_block)
				inventory.consume_active_item()
				return

		# 3. Fishing in Glacial Rivers/Lakes
		if not active["is_block"] and active["id"] == ItemRegistry.ItemID.FISHING_ROD:
			if cur_block == BlockRegistry.BlockID.WATER or world.get_voxel_at(place_vpos) == BlockRegistry.BlockID.WATER:
				inventory.add_item(ItemRegistry.ItemID.RAW_TROUT, 1, false)
				action_notification.emit("Caught a fresh Mountain Trout (Gulmohi)!")
				return

		# 4. Food Consumption
		if not active["is_block"] and active["id"] != 0:
			var item_data = ItemRegistry.get_item(active["id"])
			if item_data.get("is_food", false):
				survival_stats.feed(item_data.get("hunger_restore", 10.0), item_data.get("temp_warmth", 0.0))
				inventory.consume_active_item()
				action_notification.emit("Ate " + item_data["name"] + "!")
				_update_hand_model()
				return

		# 5. Block Placement
		if active["is_block"] and active["id"] != 0:
			var player_box: AABB = AABB(global_position + Vector3(-0.35, 0, -0.35), Vector3(0.7, 1.8, 0.7))
			var block_box: AABB = AABB(Vector3(place_vpos), Vector3(1, 1, 1))
			if not player_box.intersects(block_box):
				world.set_voxel_at(place_vpos, active["id"])
				inventory.consume_active_item()
				_update_hand_model()

func _check_non_voxel_right_click() -> void:
	if Input.is_action_just_pressed("place_use"):
		_trigger_swing()
		var active = inventory.get_active_item()
		if not active["is_block"] and active["id"] != 0:
			var item_data = ItemRegistry.get_item(active["id"])
			if item_data.get("is_food", false):
				survival_stats.feed(item_data.get("hunger_restore", 10.0), item_data.get("temp_warmth", 0.0))
				inventory.consume_active_item()
				action_notification.emit("Ate " + item_data["name"] + "!")
				_update_hand_model()
			elif active["id"] == ItemRegistry.ItemID.FISHING_ROD and is_in_water:
				inventory.add_item(ItemRegistry.ItemID.RAW_TROUT, 1, false)
				action_notification.emit("Caught a Mountain Trout (Gulmohi)!")

func respawn_player() -> void:
	global_position = spawn_position
	velocity = Vector3.ZERO
	survival_stats.respawn(spawn_position)

func _trigger_swing() -> void:
	if swing_timer <= 0.0:
		swing_timer = 0.22
		tool_swung.emit()

func _animate_hand(delta: float) -> void:
	if swing_timer > 0.0:
		swing_timer -= delta
		var progress: float = 1.0 - (swing_timer / 0.22)
		var swing_offset: float = sin(progress * PI) * 0.25
		hand_item_mesh.position = Vector3(0.35 - swing_offset * 0.5, -0.3 + swing_offset * 0.4, -0.6 - swing_offset)
		hand_item_mesh.rotation = Vector3(-swing_offset * 1.5, swing_offset * 1.2, -swing_offset * 0.5)
	else:
		var bob: float = sin(Time.get_ticks_msec() * 0.003) * 0.015
		hand_item_mesh.position = Vector3(0.35, -0.3 + bob, -0.6)
		hand_item_mesh.rotation = Vector3.ZERO

func _on_hotbar_selection_changed(_slot_idx: int) -> void:
	_update_hand_model()

func _update_hand_model() -> void:
	var active = inventory.get_active_item()
	if active["id"] == 0:
		hand_item_mesh.mesh = null
		return

	var box = BoxMesh.new()
	var tile_idx: int = 0
	if active["is_block"]:
		box.size = Vector3(1.0, 1.0, 1.0)
		tile_idx = BlockRegistry.get_block(active["id"]).get("atlas_side", 0)
	else:
		box.size = Vector3(0.15, 0.9, 0.9)
		tile_idx = ItemRegistry.get_item(active["id"]).get("atlas_idx", 83)

	var mat = StandardMaterial3D.new()
	mat.albedo_texture = TextureGenerator.get_tile_atlas_texture(tile_idx)
	mat.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST
	mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA_SCISSOR
	box.material = mat
	hand_item_mesh.mesh = box

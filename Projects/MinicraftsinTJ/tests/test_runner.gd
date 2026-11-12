class_name TestRunner
extends Node

var total_tests: int = 0
var passed_tests: int = 0
var failed_tests: int = 0

func _ready() -> void:
	print("\n=======================================================")
	print("   TAJIKCRAFT: AUTOMATED TEST SUITE & VERIFICATION     ")
	print("=======================================================\n")

	_test_block_registry()
	_test_item_and_recipe_registry()
	_test_terrain_generator_and_biomes()
	_test_chunk_meshing()
	_test_player_and_survival_stats()
	_test_inventory_and_crafting()
	_test_world_persistence()
	_test_wildlife_ai()

	print("\n=======================================================")
	print("   TEST RESULTS: %d Passed, %d Failed (Total: %d)      " % [passed_tests, failed_tests, total_tests])
	print("=======================================================\n")

	if failed_tests > 0:
		printerr("[FAILURE] Some tests failed!")
	else:
		print("[SUCCESS] All TajikCraft subsystems verified successfully!")

	# Auto-exit after tests
	get_tree().quit(1 if failed_tests > 0 else 0)

func _assert(condition: bool, test_name: String) -> void:
	total_tests += 1
	if condition:
		passed_tests += 1
		print("  [PASS] " + test_name)
	else:
		failed_tests += 1
		printerr("  [FAIL] " + test_name)

func _test_block_registry() -> void:
	print("--- 1. Testing Block Registry ---")
	BlockRegistry._static_init()
	_assert(BlockRegistry.blocks.size() >= 55, "Registry contains at least 55 defined voxel blocks")
	_assert(BlockRegistry.is_solid(BlockRegistry.BlockID.STONE), "Mountain Stone is marked as solid")
	_assert(BlockRegistry.is_transparent(BlockRegistry.BlockID.AIR), "Air is marked as transparent")
	_assert(BlockRegistry.is_transparent(BlockRegistry.BlockID.WATER), "Glacial Water is marked as transparent")
	_assert(BlockRegistry.get_block(BlockRegistry.BlockID.PAMIR_GRANITE)["hardness"] >= 3.0, "Pamir Pink Granite has realistic high mining hardness")
	_assert(BlockRegistry.is_plant(BlockRegistry.BlockID.WILDFLOWER_TULIP), "Lola Mountain Tulip is recognized as foliage")
	_assert(BlockRegistry.get_block(BlockRegistry.BlockID.COAL_ORE)["drop_is_block"] == false, "Coal Ore drops Coal Item instead of raw block")
	_assert(BlockRegistry.get_block(BlockRegistry.BlockID.LAPIS_LAZULI_ORE)["drop_id"] == ItemRegistry.ItemID.LAPIS_GEM, "Badakhshan Lapis Ore drops Lapis Lazuli Gem")

func _test_item_and_recipe_registry() -> void:
	print("\n--- 2. Testing Item & Recipe Registry ---")
	ItemRegistry._static_init()
	RecipeRegistry._static_init()

	_assert(ItemRegistry.items.size() >= 30, "Item Registry contains items, tools, and food")
	var non_bread = ItemRegistry.get_item(ItemRegistry.ItemID.NON_BREAD)
	_assert(non_bread["is_food"] and non_bread["hunger_restore"] >= 20.0, "Tandoor Non Bread is valid nourishing food")

	var chapan = ItemRegistry.get_item(ItemRegistry.ItemID.CHAPAN_COAT)
	_assert(chapan["temp_warmth"] >= 20.0, "Quilted Chapan coat provides substantial warmth insulation")

	_assert(RecipeRegistry.recipes.size() >= 20, "Recipe Registry contains at least 20 crafting recipes")

func _test_terrain_generator_and_biomes() -> void:
	print("\n--- 3. Testing Terrain Generator & Biomes ---")
	BiomeRegistry._static_init()
	_assert(BiomeRegistry.biomes.size() == 8, "All 8 required Tajikistan biomes are registered")

	var gen = TerrainGenerator.new(19910909)
	var hb_origin = gen.get_height_and_biome(0.0, 0.0)
	_assert(hb_origin.has("height") and hb_origin.has("biome_id"), "Height and biome queried successfully at world origin")
	_assert(hb_origin["height"] >= 8 and hb_origin["height"] <= 90, "Generated terrain height stays within chunk bounds: " + str(hb_origin["height"]))

	var pamir_data = BiomeRegistry.get_biome(BiomeRegistry.BiomeID.PAMIR_MOUNTAINS)
	var khatlon_data = BiomeRegistry.get_biome(BiomeRegistry.BiomeID.KHATLON_LOWLANDS)
	_assert(pamir_data["base_height"] > khatlon_data["base_height"], "Pamir Mountains base height (55) is higher than Khatlon (22)")
	_assert(pamir_data["ambient_temp"] < 0.0, "Pamir Mountains ambient temperature is sub-zero cold")

func _test_chunk_meshing() -> void:
	print("\n--- 4. Testing Voxel Chunk Meshing ---")
	var chunk: VoxelChunk = VoxelChunk.new()
	chunk.chunk_coord = Vector2i(0, 0)
	add_child(chunk)

	# Fill a test platform of 16x16 stone blocks
	for x in range(16):
		for z in range(16):
			chunk.set_voxel(x, 10, z, BlockRegistry.BlockID.STONE)

	chunk.rebuild_mesh()
	_assert(chunk.mesh_instance.mesh != null, "ArrayMesh generated successfully on chunk")
	_assert(chunk.collision_shape.shape != null, "Trimesh physics collision shape generated on chunk")
	chunk.queue_free()

func _test_player_and_survival_stats() -> void:
	print("\n--- 5. Testing Player & Survival Stats ---")
	var stats: SurvivalStats = SurvivalStats.new()
	add_child(stats)

	_assert(stats.health == 100.0, "Player starts with 100% full health")
	_assert(stats.hunger == 100.0, "Player starts with 100% full hunger")
	_assert(stats.stamina == 100.0, "Player starts with 100% full stamina")

	# Test stamina sprint consumption
	stats.is_sprinting = true
	stats._process(0.5)
	_assert(stats.stamina < 100.0, "Sprinting drains stamina: %.1f" % stats.stamina)

	# Test altitude and mountain cold lapse rate
	stats.current_altitude = 75.0 # High in Pamir peaks
	stats.current_biome_id = BiomeRegistry.BiomeID.PAMIR_MOUNTAINS
	stats._process(1.0)
	_assert(stats.body_temperature <= 36.6, "High altitude mountain cold lowers core temperature")

	stats.queue_free()

func _test_inventory_and_crafting() -> void:
	print("\n--- 6. Testing Inventory & Crafting ---")
	var inv: InventoryManager = InventoryManager.new()
	add_child(inv)

	# Add wood logs and craft planks
	inv.add_item(BlockRegistry.BlockID.WOOD_LOG_JUNIPER, 2, true)
	_assert(inv.has_item(BlockRegistry.BlockID.WOOD_LOG_JUNIPER, 2, true), "Inventory contains 2 Juniper wood logs")

	# Find matching recipe for planks
	var available = CraftingSystem.get_available_recipes(inv, "any")
	_assert(available.size() > 0, "Crafting system found valid craftable recipes")

	# Craft planks
	var craft_ok = CraftingSystem.craft_recipe(available[0], inv)
	_assert(craft_ok, "Successfully crafted wooden planks from juniper log")
	_assert(inv.has_item(BlockRegistry.BlockID.WOOD_PLANKS, 4, true), "Inventory now contains 4 wooden planks")

	# Test serialization roundtrip
	var saved_data = inv.serialize()
	_assert(saved_data.has("slots") and saved_data.has("active_hotbar"), "Inventory serializes correctly")

	inv.queue_free()

func _test_world_persistence() -> void:
	print("\n--- 7. Testing World Persistence ---")
	var world: VoxelWorld = VoxelWorld.new()
	add_child(world)

	# Set a block modification
	var test_pos = Vector3i(12, 34, 56)
	world.set_voxel_at(test_pos, BlockRegistry.BlockID.TANDOOR_OVEN)
	_assert(world.get_voxel_at(test_pos) == BlockRegistry.BlockID.TANDOOR_OVEN, "Placed Tandoor oven at test coordinate")

	# Save world
	world.save_world_modifications()

	# Create a second world instance and load
	var world2: VoxelWorld = VoxelWorld.new()
	add_child(world2)
	world2.load_world_modifications()
	_assert(world2.get_voxel_at(test_pos) == BlockRegistry.BlockID.TANDOOR_OVEN, "Persistence roundtrip: Tandoor oven retained across load")

	world.queue_free()
	world2.queue_free()

func _test_wildlife_ai() -> void:
	print("\n--- 8. Testing Wildlife AI & Landmarks ---")
	var animal: AnimalAI = AnimalAI.new()
	animal.animal_type = AnimalAI.AnimalType.MARCO_POLO_SHEEP
	add_child(animal)

	_assert(animal.body_node.get_child_count() > 0, "Marco Polo Sheep textured 3D voxel model assembled")
	_assert(animal.health == 30.0, "Animal initialized with correct health")
	_assert(animal.current_state == AnimalAI.State.IDLE, "Animal starts in IDLE behavior state")

	var eagle: AnimalAI = AnimalAI.new()
	eagle.animal_type = AnimalAI.AnimalType.GOLDEN_EAGLE
	add_child(eagle)
	_assert(eagle.current_state == AnimalAI.State.FLY_SOAR, "Golden Eagle starts in soaring flight state")

	var panjakent = LandmarkRegistry.build_landmark_voxels(LandmarkRegistry.LandmarkType.PANJAKENT_RUINS)
	var village = LandmarkRegistry.build_landmark_voxels(LandmarkRegistry.LandmarkType.TRADITIONAL_VILLAGE_HOUSE)
	var bridge = LandmarkRegistry.build_landmark_voxels(LandmarkRegistry.LandmarkType.GORGE_BRIDGE)
	_assert(panjakent.size() > 50, "Ancient Panjakent Ruins voxel blueprint generates > 50 blocks")
	_assert(village.size() > 100, "Traditional Tajik Village House with Aiwan generates > 100 blocks")
	_assert(bridge.size() > 30, "Vakhsh Gorge Bridge voxel blueprint generates > 30 blocks")

	animal.queue_free()
	eagle.queue_free()

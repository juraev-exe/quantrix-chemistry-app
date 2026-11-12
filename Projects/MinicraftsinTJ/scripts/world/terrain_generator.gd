class_name TerrainGenerator
extends RefCounted

var seed_val: int = 19910909

var continental_noise: FastNoiseLite = FastNoiseLite.new()
var mountain_noise: FastNoiseLite = FastNoiseLite.new()
var river_noise: FastNoiseLite = FastNoiseLite.new()
var moisture_noise: FastNoiseLite = FastNoiseLite.new()
var temperature_noise: FastNoiseLite = FastNoiseLite.new()
var cave_noise: FastNoiseLite = FastNoiseLite.new()

func _init(p_seed: int = 19910909) -> void:
	seed_val = p_seed
	_setup_noises()

func _setup_noises() -> void:
	# 1. Continental macro-elevation
	continental_noise.seed = seed_val
	continental_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	continental_noise.frequency = 0.0025
	continental_noise.fractal_octaves = 4

	# 2. Mountain ridges (Ridged Multifractal for towering Pamir & Fann peaks)
	mountain_noise.seed = seed_val + 101
	mountain_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	mountain_noise.fractal_type = FastNoiseLite.FRACTAL_RIDGED
	mountain_noise.frequency = 0.008
	mountain_noise.fractal_octaves = 5

	# 3. River & Canyon carver
	river_noise.seed = seed_val + 202
	river_noise.noise_type = FastNoiseLite.TYPE_CELLULAR
	river_noise.cellular_return_type = FastNoiseLite.RETURN_DISTANCE
	river_noise.frequency = 0.004

	# 4. Moisture & Temperature
	moisture_noise.seed = seed_val + 303
	moisture_noise.frequency = 0.003

	temperature_noise.seed = seed_val + 404
	temperature_noise.frequency = 0.003

	# 5. 3D Caves
	cave_noise.seed = seed_val + 505
	cave_noise.noise_type = FastNoiseLite.TYPE_SIMPLEX
	cave_noise.frequency = 0.035
	cave_noise.fractal_octaves = 3

func get_biome_at(world_x: float, world_z: float) -> int:
	var cont: float = (continental_noise.get_noise_2d(world_x, world_z) + 1.0) * 0.5
	var temp: float = (temperature_noise.get_noise_2d(world_x, world_z) + 1.0) * 0.5
	var moist: float = (moisture_noise.get_noise_2d(world_x, world_z) + 1.0) * 0.5

	# Elevation dominates Tajikistan geography
	if cont > 0.68:
		# Extremely high elevations: Pamir Mountains or Fann Mountains
		if temp < 0.45:
			return BiomeRegistry.BiomeID.PAMIR_MOUNTAINS
		else:
			return BiomeRegistry.BiomeID.FANN_MOUNTAINS
	elif cont > 0.50:
		# High elevation plateaus and pastures
		if moist > 0.5:
			return BiomeRegistry.BiomeID.ALPINE_MEADOWS
		else:
			return BiomeRegistry.BiomeID.SEMI_ARID_FOOTHILLS
	elif cont > 0.32:
		# Mid-elevation river valleys
		if moist > 0.5:
			return BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY
		else:
			return BiomeRegistry.BiomeID.HISSAR_VALLEY
	else:
		# Lowland plains & major river basins
		if moist > 0.5:
			return BiomeRegistry.BiomeID.VAKHSH_RIVER_VALLEY
		else:
			return BiomeRegistry.BiomeID.KHATLON_LOWLANDS

func get_height_and_biome(world_x: float, world_z: float) -> Dictionary:
	var biome_id: int = get_biome_at(world_x, world_z)
	var biome_data = BiomeRegistry.get_biome(biome_id)

	var cont: float = (continental_noise.get_noise_2d(world_x, world_z) + 1.0) * 0.5
	var ridge: float = abs(mountain_noise.get_noise_2d(world_x, world_z))

	var base_h: float = float(biome_data["base_height"])
	var var_h: float = float(biome_data["height_variation"])
	var r_weight: float = float(biome_data["ridge_weight"])

	var h: float = base_h + (cont * var_h) + (ridge * var_h * r_weight)

	# River carving
	var riv_dist: float = river_noise.get_noise_2d(world_x, world_z)
	if riv_dist < 0.12:
		var trench_depth: float = (0.12 - riv_dist) / 0.12 * 14.0
		h -= trench_depth

	var final_height: int = int(clamp(h, 8, VoxelChunk.CHUNK_SIZE_Y - 6))
	return {
		"height": final_height,
		"biome_id": biome_id,
		"biome_data": biome_data
	}

# Populate an entire chunk with procedural terrain, ores, foliage, and structures
func generate_chunk_data(chunk: VoxelChunk) -> void:
	var c_x: int = chunk.chunk_coord.x
	var c_z: int = chunk.chunk_coord.y

	var rng: RandomNumberGenerator = RandomNumberGenerator.new()
	rng.seed = seed_val ^ (c_x * 73856093) ^ (c_z * 19349663)

	var surface_points: Array[Dictionary] = []

	for lz in range(VoxelChunk.CHUNK_SIZE_Z):
		for lx in range(VoxelChunk.CHUNK_SIZE_X):
			var wx: float = float(c_x * VoxelChunk.CHUNK_SIZE_X + lx)
			var wz: float = float(c_z * VoxelChunk.CHUNK_SIZE_Z + lz)

			var hb: Dictionary = get_height_and_biome(wx, wz)
			var h: int = hb["height"]
			var b_id: int = hb["biome_id"]
			var b_data: Dictionary = hb["biome_data"]
			var water_lvl: int = b_data["water_level"]

			surface_points.append({
				"lx": lx,
				"lz": lz,
				"h": h,
				"b_id": b_id,
				"b_data": b_data
			})

			for y in range(VoxelChunk.CHUNK_SIZE_Y):
				if y == 0:
					# Indestructible bedrock foundation
					chunk.set_voxel(lx, y, lz, BlockRegistry.BlockID.STONE)
				elif y < h - 4:
					# Underground stone layer with 3D caves and mineral ores
					var cave_val: float = cave_noise.get_noise_3d(wx, float(y), wz)
					if cave_val > 0.42 and y > 5:
						# Cave Air
						chunk.set_voxel(lx, y, lz, BlockRegistry.BlockID.AIR)
					else:
						# Mineral Ores distribution
						var ore_id: int = b_data["stone_block"]
						var r_ore: float = rng.randf()
						if r_ore < 0.025:
							ore_id = BlockRegistry.BlockID.COAL_ORE
						elif r_ore < 0.040 and y < 50:
							ore_id = BlockRegistry.BlockID.IRON_ORE
						elif r_ore < 0.050 and y < 45:
							ore_id = BlockRegistry.BlockID.COPPER_ORE
						elif r_ore < 0.055 and y < 30 and b_id == BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY:
							ore_id = BlockRegistry.BlockID.GOLD_ORE # Zeravshan Gold
						elif r_ore < 0.060 and y < 35 and b_id == BiomeRegistry.BiomeID.PAMIR_MOUNTAINS:
							ore_id = BlockRegistry.BlockID.LAPIS_LAZULI_ORE # Badakhshan Lapis Lazuli
						elif r_ore < 0.063 and y < 25 and b_id == BiomeRegistry.BiomeID.PAMIR_MOUNTAINS:
							ore_id = BlockRegistry.BlockID.RUBY_ORE # Pamir Ruby

						chunk.set_voxel(lx, y, lz, ore_id)
				elif y < h:
					# Subsurface layer (dirt, gravel, slate)
					chunk.set_voxel(lx, y, lz, b_data["subsurface_block"])
				elif y == h:
					# Surface block
					if h < water_lvl:
						# Underwater ground becomes sand or river stone
						chunk.set_voxel(lx, y, lz, BlockRegistry.BlockID.SAND if b_id == BiomeRegistry.BiomeID.KHATLON_LOWLANDS else BlockRegistry.BlockID.RIVER_STONE)
					else:
						chunk.set_voxel(lx, y, lz, b_data["surface_block"])
				elif y <= water_lvl and h < water_lvl:
					# Glacial water / River / Alpine Lake
					chunk.set_voxel(lx, y, lz, BlockRegistry.BlockID.WATER)
				else:
					# Open air
					chunk.set_voxel(lx, y, lz, BlockRegistry.BlockID.AIR)

	# Foliage Generation (Trees, Flowers, Crops, Medicinal Herbs)
	for sp in surface_points:
		var lx: int = sp["lx"]
		var lz: int = sp["lz"]
		var h: int = sp["h"]
		var b_id: int = sp["b_id"]
		var b_data: Dictionary = sp["b_data"]

		# Only place plants on dry solid ground above water
		if h >= b_data["water_level"] and h < VoxelChunk.CHUNK_SIZE_Y - 12:
			var roll_tree: float = rng.randf()
			if roll_tree < b_data["tree_density"] and lx >= 2 and lx <= 13 and lz >= 2 and lz <= 13:
				var chosen_tree: int = b_data["tree_type"]
				var variety_roll: float = rng.randf()
				if b_id == BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY:
					if variety_roll < 0.25:
						chosen_tree = -101 # Apricot orchard tree
					elif variety_roll < 0.50:
						chosen_tree = -102 # Apple orchard tree
					elif variety_roll < 0.70:
						chosen_tree = -103 # Mulberry tree
				elif b_id == BiomeRegistry.BiomeID.VAKHSH_RIVER_VALLEY and variety_roll < 0.45:
					chosen_tree = BlockRegistry.BlockID.WOOD_LOG_WILLOW
				_generate_tree(chunk, lx, h + 1, lz, chosen_tree, rng)
			else:
				var roll_plant: float = rng.randf()
				if roll_plant < b_data["plant_density"]:
					var p_type: int = b_data["plant_type"]
					if rng.randf() < 0.20 and b_id in [BiomeRegistry.BiomeID.FANN_MOUNTAINS, BiomeRegistry.BiomeID.ALPINE_MEADOWS, BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY]:
						p_type = BlockRegistry.BlockID.MEDICINAL_HERBS
					chunk.set_voxel(lx, h + 1, lz, p_type)

	# Check for historical/cultural landmarks at chunk origin
	_try_place_landmark(chunk, c_x, c_z, rng)

	chunk.is_generated = true
	chunk.is_dirty = true

# Procedural tree placement based on regional Tajik species
func _generate_tree(chunk: VoxelChunk, root_x: int, root_y: int, root_z: int, tree_type: int, rng: RandomNumberGenerator) -> void:
	match tree_type:
		BlockRegistry.BlockID.WOOD_LOG_POPLAR:
			var height: int = rng.randi_range(6, 8)
			for dy in range(height):
				chunk.set_voxel(root_x, root_y + dy, root_z, BlockRegistry.BlockID.WOOD_LOG_POPLAR)
				if dy >= 3:
					for dx in range(-1, 2):
						for dz in range(-1, 2):
							if dx == 0 and dz == 0:
								continue
							if chunk.get_voxel(root_x + dx, root_y + dy, root_z + dz) == BlockRegistry.BlockID.AIR:
								chunk.set_voxel(root_x + dx, root_y + dy, root_z + dz, BlockRegistry.BlockID.LEAVES_POPLAR)
			chunk.set_voxel(root_x, root_y + height, root_z, BlockRegistry.BlockID.LEAVES_POPLAR)

		BlockRegistry.BlockID.WOOD_LOG_WILLOW:
			var trunk_h: int = rng.randi_range(4, 5)
			for dy in range(trunk_h):
				chunk.set_voxel(root_x, root_y + dy, root_z, BlockRegistry.BlockID.WOOD_LOG_WILLOW)
			for dx in range(-2, 3):
				for dz in range(-2, 3):
					if abs(dx) + abs(dz) <= 3:
						for dy in range(-1, 2):
							var cy: int = root_y + trunk_h + dy
							if chunk.get_voxel(root_x + dx, cy, root_z + dz) == BlockRegistry.BlockID.AIR:
								chunk.set_voxel(root_x + dx, cy, root_z + dz, BlockRegistry.BlockID.LEAVES_WILLOW)

		BlockRegistry.BlockID.WOOD_LOG_WALNUT, -101, -102, -103:
			var leaf_block: int = BlockRegistry.BlockID.LEAVES_WALNUT
			if tree_type == -101:
				leaf_block = BlockRegistry.BlockID.LEAVES_APRICOT
			elif tree_type == -102:
				leaf_block = BlockRegistry.BlockID.LEAVES_APPLE
			elif tree_type == -103:
				leaf_block = BlockRegistry.BlockID.LEAVES_MULBERRY
			var trunk_h: int = rng.randi_range(4, 5)
			for dy in range(trunk_h):
				chunk.set_voxel(root_x, root_y + dy, root_z, BlockRegistry.BlockID.WOOD_LOG_WALNUT)
			for dx in range(-2, 3):
				for dz in range(-2, 3):
					for dy in range(2):
						if abs(dx) + abs(dz) <= 3:
							var cy: int = root_y + trunk_h + dy
							if chunk.get_voxel(root_x + dx, cy, root_z + dz) == BlockRegistry.BlockID.AIR:
								chunk.set_voxel(root_x + dx, cy, root_z + dz, leaf_block)

		_:
			var trunk_h: int = rng.randi_range(3, 5)
			for dy in range(trunk_h):
				chunk.set_voxel(root_x, root_y + dy, root_z, BlockRegistry.BlockID.WOOD_LOG_JUNIPER)
			for dx in range(-1, 2):
				for dz in range(-1, 2):
					for dy in range(2):
						var cy: int = root_y + trunk_h + dy
						if chunk.get_voxel(root_x + dx, cy, root_z + dz) == BlockRegistry.BlockID.AIR:
							chunk.set_voxel(root_x + dx, cy, root_z + dz, BlockRegistry.BlockID.LEAVES_JUNIPER)

func _try_place_landmark(chunk: VoxelChunk, c_x: int, c_z: int, _rng: RandomNumberGenerator) -> void:
	var hash_val: int = abs((c_x * 374761393 + c_z * 668265263) ^ seed_val) % 10000

	var center_wx: float = float(c_x * VoxelChunk.CHUNK_SIZE_X + 8)
	var center_wz: float = float(c_z * VoxelChunk.CHUNK_SIZE_Z + 8)
	var hb: Dictionary = get_height_and_biome(center_wx, center_wz)
	var b_id: int = hb["biome_id"]
	var base_y: int = hb["height"]

	var selected_type: int = -1

	# Nearby starter landmark in chunk (1, 0) so players can immediately discover Tajik heritage!
	if c_x == 1 and c_z == 0:
		selected_type = LandmarkRegistry.LandmarkType.TRADITIONAL_VILLAGE_HOUSE
	elif c_x == -1 and c_z == 1:
		selected_type = LandmarkRegistry.LandmarkType.HISOR_FORTRESS
	elif b_id == BiomeRegistry.BiomeID.PAMIR_MOUNTAINS and (hash_val % 40 == 0):
		selected_type = LandmarkRegistry.LandmarkType.PAMIRI_CHORXONA
	elif b_id == BiomeRegistry.BiomeID.HISSAR_VALLEY and (hash_val % 50 == 0):
		selected_type = LandmarkRegistry.LandmarkType.HISOR_FORTRESS
	elif b_id == BiomeRegistry.BiomeID.ALPINE_MEADOWS and (hash_val % 45 == 0):
		selected_type = LandmarkRegistry.LandmarkType.MOUNTAIN_CAMP
	elif b_id == BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY and (hash_val % 45 == 0):
		selected_type = LandmarkRegistry.LandmarkType.PANJAKENT_RUINS if (hash_val % 2 == 0) else LandmarkRegistry.LandmarkType.TRADITIONAL_VILLAGE_HOUSE
	elif b_id == BiomeRegistry.BiomeID.VAKHSH_RIVER_VALLEY and (hash_val % 55 == 0):
		selected_type = LandmarkRegistry.LandmarkType.GORGE_BRIDGE

	if selected_type != -1:
		var voxels = LandmarkRegistry.build_landmark_voxels(selected_type)
		for v in voxels:
			var lx: int = v["rel_x"] + 2
			var lz: int = v["rel_z"] + 2
			var ly: int = base_y + v["rel_y"]
			if lx >= 0 and lx < VoxelChunk.CHUNK_SIZE_X and lz >= 0 and lz < VoxelChunk.CHUNK_SIZE_Z and ly >= 0 and ly < VoxelChunk.CHUNK_SIZE_Y:
				chunk.set_voxel(lx, ly, lz, v["block_id"])


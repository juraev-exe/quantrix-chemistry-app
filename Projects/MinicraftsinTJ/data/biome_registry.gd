class_name BiomeRegistry
extends RefCounted

enum BiomeID {
	PAMIR_MOUNTAINS = 0,
	FANN_MOUNTAINS = 1,
	ZERAVSHAN_VALLEY = 2,
	HISSAR_VALLEY = 3,
	KHATLON_LOWLANDS = 4,
	VAKHSH_RIVER_VALLEY = 5,
	SEMI_ARID_FOOTHILLS = 6,
	ALPINE_MEADOWS = 7
}

static var biomes: Dictionary = {}

static func _static_init() -> void:
	_register_all()

static func _register_all() -> void:
	biomes.clear()

	# A. Pamir Mountains (Gorno-Badakhshan) - Extreme elevation, snow, granite, glaciers
	biomes[BiomeID.PAMIR_MOUNTAINS] = {
		"id": BiomeID.PAMIR_MOUNTAINS,
		"name": "Pamir Mountains (Помир)",
		"base_height": 55,
		"height_variation": 35.0,
		"ridge_weight": 1.4,
		"surface_block": BlockRegistry.BlockID.SNOW,
		"subsurface_block": BlockRegistry.BlockID.SLATE,
		"stone_block": BlockRegistry.BlockID.PAMIR_GRANITE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_JUNIPER,
		"tree_density": 0.002,
		"plant_type": BlockRegistry.BlockID.ARTEMISIA,
		"plant_density": 0.01,
		"water_level": 30,
		"water_color": Color(0.2, 0.45, 0.8, 0.8),
		"ambient_temp": -14.0, # High altitude cold
		"wildlife": ["marco_polo_sheep", "snow_leopard", "yak", "golden_eagle"]
	}

	# B. Fann Mountains - Dramatic rocky peaks, turquoise alpine lakes, pine/juniper
	biomes[BiomeID.FANN_MOUNTAINS] = {
		"id": BiomeID.FANN_MOUNTAINS,
		"name": "Fann Mountains (Кӯҳҳои Фон)",
		"base_height": 45,
		"height_variation": 28.0,
		"ridge_weight": 1.2,
		"surface_block": BlockRegistry.BlockID.GRASS,
		"subsurface_block": BlockRegistry.BlockID.DIRT,
		"stone_block": BlockRegistry.BlockID.MOUNTAIN_LIMESTONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_JUNIPER,
		"tree_density": 0.02,
		"plant_type": BlockRegistry.BlockID.ALPINE_FLOWERS,
		"plant_density": 0.05,
		"water_level": 32,
		"water_color": Color(0.12, 0.72, 0.75, 0.75), # Famous turquoise (Iskanderkul)
		"ambient_temp": 8.0,
		"wildlife": ["siberian_ibex", "brown_bear", "wolf", "marmot"]
	}

	# C. Zeravshan Valley - Fertile valley, orchards (apricot, walnut), rivers
	biomes[BiomeID.ZERAVSHAN_VALLEY] = {
		"id": BiomeID.ZERAVSHAN_VALLEY,
		"name": "Zeravshan Valley (Водии Зарафшон)",
		"base_height": 30,
		"height_variation": 12.0,
		"ridge_weight": 0.5,
		"surface_block": BlockRegistry.BlockID.GRASS,
		"subsurface_block": BlockRegistry.BlockID.DIRT,
		"stone_block": BlockRegistry.BlockID.STONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_WALNUT,
		"tree_density": 0.035,
		"plant_type": BlockRegistry.BlockID.WILDFLOWER_TULIP,
		"plant_density": 0.06,
		"water_level": 28,
		"water_color": Color(0.2, 0.6, 0.7, 0.7),
		"ambient_temp": 20.0,
		"wildlife": ["horse", "sheep", "donkey", "red_fox"]
	}

	# D. Hissar Valley - Green fields, villages, foothills, Hisor fortress
	biomes[BiomeID.HISSAR_VALLEY] = {
		"id": BiomeID.HISSAR_VALLEY,
		"name": "Hissar Valley (Водии Ҳисор)",
		"base_height": 26,
		"height_variation": 10.0,
		"ridge_weight": 0.4,
		"surface_block": BlockRegistry.BlockID.GRASS,
		"subsurface_block": BlockRegistry.BlockID.DIRT,
		"stone_block": BlockRegistry.BlockID.STONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_POPLAR,
		"tree_density": 0.03,
		"plant_type": BlockRegistry.BlockID.WHEAT_CROP,
		"plant_density": 0.07,
		"water_level": 24,
		"water_color": Color(0.22, 0.55, 0.75, 0.7),
		"ambient_temp": 22.0,
		"wildlife": ["cow", "sheep", "chicken", "dog"]
	}

	# E. Khatlon Lowlands - Warm climate, cotton fields, dry rolling hills
	biomes[BiomeID.KHATLON_LOWLANDS] = {
		"id": BiomeID.KHATLON_LOWLANDS,
		"name": "Khatlon Lowlands (Хатлон)",
		"base_height": 22,
		"height_variation": 8.0,
		"ridge_weight": 0.3,
		"surface_block": BlockRegistry.BlockID.LOESS_SOIL,
		"subsurface_block": BlockRegistry.BlockID.CLAY,
		"stone_block": BlockRegistry.BlockID.RED_SANDSTONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_POPLAR,
		"tree_density": 0.015,
		"plant_type": BlockRegistry.BlockID.COTTON_PLANT,
		"plant_density": 0.08,
		"water_level": 20,
		"water_color": Color(0.3, 0.58, 0.65, 0.7),
		"ambient_temp": 32.0, # Warm lowland
		"wildlife": ["donkey", "goat", "red_fox", "chicken"]
	}

	# F. Vakhsh River Valley - Broad turquoise glacial river, floodplains, gravel
	biomes[BiomeID.VAKHSH_RIVER_VALLEY] = {
		"id": BiomeID.VAKHSH_RIVER_VALLEY,
		"name": "Vakhsh River Valley (Водии Вахш)",
		"base_height": 24,
		"height_variation": 14.0,
		"ridge_weight": 0.6,
		"surface_block": BlockRegistry.BlockID.RIVER_STONE,
		"subsurface_block": BlockRegistry.BlockID.GRAVEL,
		"stone_block": BlockRegistry.BlockID.STONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_POPLAR,
		"tree_density": 0.02,
		"plant_type": BlockRegistry.BlockID.ARTEMISIA,
		"plant_density": 0.03,
		"water_level": 25,
		"water_color": Color(0.1, 0.78, 0.82, 0.8), # Iconic vibrant blue-green Vakhsh
		"ambient_temp": 24.0,
		"wildlife": ["horse", "cow", "bearded_vulture"]
	}

	# G. Semi-arid Mountain Foothills - Dry grasslands, rocky red sandstone
	biomes[BiomeID.SEMI_ARID_FOOTHILLS] = {
		"id": BiomeID.SEMI_ARID_FOOTHILLS,
		"name": "Semi-arid Foothills (Домани кӯҳҳо)",
		"base_height": 32,
		"height_variation": 18.0,
		"ridge_weight": 0.8,
		"surface_block": BlockRegistry.BlockID.RED_SANDSTONE,
		"subsurface_block": BlockRegistry.BlockID.GRAVEL,
		"stone_block": BlockRegistry.BlockID.STONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_JUNIPER,
		"tree_density": 0.005,
		"plant_type": BlockRegistry.BlockID.ARTEMISIA,
		"plant_density": 0.04,
		"water_level": 24,
		"water_color": Color(0.25, 0.5, 0.7, 0.7),
		"ambient_temp": 26.0,
		"wildlife": ["goat", "red_fox", "wolf"]
	}

	# H. Alpine Meadows (Yailoq) - High altitude summer pasture, wildflowers, clear springs
	biomes[BiomeID.ALPINE_MEADOWS] = {
		"id": BiomeID.ALPINE_MEADOWS,
		"name": "Alpine Meadows (Яйлоқ)",
		"base_height": 48,
		"height_variation": 15.0,
		"ridge_weight": 0.6,
		"surface_block": BlockRegistry.BlockID.GRASS,
		"subsurface_block": BlockRegistry.BlockID.DIRT,
		"stone_block": BlockRegistry.BlockID.MOUNTAIN_LIMESTONE,
		"tree_type": BlockRegistry.BlockID.WOOD_LOG_JUNIPER,
		"tree_density": 0.01,
		"plant_type": BlockRegistry.BlockID.WILDFLOWER_TULIP,
		"plant_density": 0.12,
		"water_level": 36,
		"water_color": Color(0.15, 0.68, 0.85, 0.75),
		"ambient_temp": 12.0,
		"wildlife": ["marco_polo_sheep", "siberian_ibex", "horse", "yak"]
	}

static func get_biome(id: int) -> Dictionary:
	if not biomes.has(id):
		if biomes.is_empty():
			_register_all()
		return biomes.get(id, biomes[BiomeID.HISSAR_VALLEY])
	return biomes[id]


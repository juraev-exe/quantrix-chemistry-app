class_name BlockRegistry
extends RefCounted

# Block IDs
enum BlockID {
	AIR = 0,
	DIRT = 1,
	GRASS = 2,
	STONE = 3,
	SNOW = 4,
	ICE = 5,
	WATER = 6,
	SAND = 7,
	GRAVEL = 8,
	CLAY = 9,
	COBBLESTONE = 10,
	WOOD_LOG_JUNIPER = 11,
	WOOD_LOG_POPLAR = 12,
	WOOD_LOG_WALNUT = 13,
	WOOD_PLANKS = 14,
	LEAVES_JUNIPER = 15,
	LEAVES_POPLAR = 16,
	LEAVES_WALNUT = 17,
	LEAVES_APRICOT = 18,
	PAMIR_GRANITE = 19,
	MOUNTAIN_LIMESTONE = 20,
	SLATE = 21,
	RIVER_STONE = 22,
	RED_SANDSTONE = 23,
	LOESS_SOIL = 24,
	COAL_ORE = 25,
	IRON_ORE = 26,
	COPPER_ORE = 27,
	GOLD_ORE = 28,
	LAPIS_LAZULI_ORE = 29,
	RUBY_ORE = 30,
	CLAY_BRICK = 31,
	CARVED_WOOD_PANEL = 32,
	TAJIK_CARPET_BLOCK = 33,
	TANDOOR_OVEN = 34,
	GLASS = 35,
	WOODEN_DOOR = 36,
	WOODEN_FENCE = 37,
	ROOF_CLAY_TILE = 38,
	CHORXONA_PILLAR = 39,
	CHEST = 40,
	CRAFTING_TABLE = 41,
	WILDFLOWER_TULIP = 42,
	ARTEMISIA = 43,
	ALPINE_FLOWERS = 44,
	WHEAT_CROP = 45,
	COTTON_PLANT = 46,
	MELON_BLOCK = 47,
	BED = 48,
	TORCH = 49,
	LEAVES_APPLE = 50,
	LEAVES_MULBERRY = 51,
	WOOD_LOG_WILLOW = 52,
	LEAVES_WILLOW = 53,
	DECORATIVE_TILE = 54,
	FARMLAND = 55,
	MEDICINAL_HERBS = 56,
	MUDBRICK_PAKHSA = 57,
	WOODEN_STAIRS = 58,
	SNOW_GRASS = 59
}

static var blocks: Dictionary = {}

static func _static_init() -> void:
	_register_all()

static func _register(id: int, name: String, transparent: bool, solid: bool, hardness: float, tool_type: String, drop_id: int, color: Color, atlas_idx_top: int, atlas_idx_side: int, atlas_idx_bottom: int, drop_is_block: bool = true) -> void:
	blocks[id] = {
		"id": id,
		"name": name,
		"transparent": transparent,
		"solid": solid,
		"hardness": hardness,
		"tool_type": tool_type,
		"drop_id": drop_id,
		"drop_is_block": drop_is_block,
		"color": color,
		"atlas_top": atlas_idx_top,
		"atlas_side": atlas_idx_side,
		"atlas_bottom": atlas_idx_bottom,
		"is_plant": id in [
			BlockID.WILDFLOWER_TULIP, BlockID.ARTEMISIA, BlockID.ALPINE_FLOWERS,
			BlockID.WHEAT_CROP, BlockID.COTTON_PLANT, BlockID.TORCH, BlockID.MEDICINAL_HERBS
		]
	}

static func _register_all() -> void:
	blocks.clear()
	_register(BlockID.AIR, "Air", true, false, 0.0, "none", 0, Color(0,0,0,0), 0, 0, 0)

	# Basic terrain
	_register(BlockID.DIRT, "Dirt", false, true, 0.5, "shovel", BlockID.DIRT, Color(0.48, 0.32, 0.18), 1, 1, 1)
	_register(BlockID.GRASS, "Grass Block", false, true, 0.6, "shovel", BlockID.DIRT, Color(0.35, 0.65, 0.25), 0, 2, 1)
	_register(BlockID.STONE, "Mountain Stone", false, true, 1.5, "pickaxe", BlockID.COBBLESTONE, Color(0.55, 0.55, 0.58), 3, 3, 3)
	_register(BlockID.SNOW, "Snow Block", false, true, 0.3, "shovel", BlockID.SNOW, Color(0.95, 0.97, 1.0), 4, 4, 4)
	_register(BlockID.ICE, "Glacier Ice", true, true, 0.8, "pickaxe", BlockID.ICE, Color(0.7, 0.88, 0.98, 0.85), 5, 5, 5)
	_register(BlockID.WATER, "Glacial Water", true, false, 100.0, "bucket", 0, Color(0.18, 0.52, 0.78, 0.7), 6, 6, 6)
	_register(BlockID.SAND, "River Sand", false, true, 0.5, "shovel", BlockID.SAND, Color(0.85, 0.78, 0.55), 7, 7, 7)
	_register(BlockID.GRAVEL, "Mountain Gravel", false, true, 0.6, "shovel", BlockID.GRAVEL, Color(0.6, 0.58, 0.55), 8, 8, 8)
	_register(BlockID.CLAY, "Alluvial Clay", false, true, 0.7, "shovel", 207, Color(0.68, 0.64, 0.65), 9, 9, 9, false) # Drops CLAY_BALL
	_register(BlockID.COBBLESTONE, "Cobblestone", false, true, 2.0, "pickaxe", BlockID.COBBLESTONE, Color(0.45, 0.45, 0.47), 10, 10, 10)

	# Wood & Foliage
	_register(BlockID.WOOD_LOG_JUNIPER, "Juniper (Archa) Wood", false, true, 2.0, "axe", BlockID.WOOD_LOG_JUNIPER, Color(0.4, 0.28, 0.2), 11, 12, 11)
	_register(BlockID.WOOD_LOG_POPLAR, "Poplar (Safeddor) Wood", false, true, 1.8, "axe", BlockID.WOOD_LOG_POPLAR, Color(0.58, 0.52, 0.42), 13, 14, 13)
	_register(BlockID.WOOD_LOG_WALNUT, "Walnut Wood", false, true, 2.2, "axe", BlockID.WOOD_LOG_WALNUT, Color(0.35, 0.22, 0.15), 15, 16, 15)
	_register(BlockID.WOOD_PLANKS, "Wooden Planks", false, true, 1.5, "axe", BlockID.WOOD_PLANKS, Color(0.72, 0.55, 0.35), 17, 17, 17)
	_register(BlockID.LEAVES_JUNIPER, "Juniper Needles", true, true, 0.2, "shears", 0, Color(0.22, 0.45, 0.25), 18, 18, 18)
	_register(BlockID.LEAVES_POPLAR, "Poplar Leaves", true, true, 0.2, "shears", 0, Color(0.42, 0.68, 0.22), 19, 19, 19)
	_register(BlockID.LEAVES_WALNUT, "Walnut Leaves", true, true, 0.2, "shears", 407, Color(0.32, 0.58, 0.2), 20, 20, 20, false) # Drops WALNUTS
	_register(BlockID.LEAVES_APRICOT, "Apricot Leaves", true, true, 0.2, "shears", 406, Color(0.48, 0.72, 0.28), 21, 21, 21, false) # Drops DRIED_APRICOTS

	# Regional Tajik Geological Blocks
	_register(BlockID.PAMIR_GRANITE, "Pamir Pink Granite", false, true, 3.0, "pickaxe", BlockID.PAMIR_GRANITE, Color(0.78, 0.62, 0.62), 22, 22, 22)
	_register(BlockID.MOUNTAIN_LIMESTONE, "Fann Limestone", false, true, 2.2, "pickaxe", BlockID.MOUNTAIN_LIMESTONE, Color(0.82, 0.82, 0.78), 23, 23, 23)
	_register(BlockID.SLATE, "Dark Slate", false, true, 2.5, "pickaxe", BlockID.SLATE, Color(0.28, 0.3, 0.32), 24, 24, 24)
	_register(BlockID.RIVER_STONE, "Vakhsh River Stone", false, true, 1.8, "pickaxe", BlockID.RIVER_STONE, Color(0.5, 0.56, 0.58), 25, 25, 25)
	_register(BlockID.RED_SANDSTONE, "Foothills Sandstone", false, true, 1.6, "pickaxe", BlockID.RED_SANDSTONE, Color(0.78, 0.45, 0.32), 26, 26, 26)
	_register(BlockID.LOESS_SOIL, "Loess Soil", false, true, 0.5, "shovel", BlockID.LOESS_SOIL, Color(0.68, 0.58, 0.42), 27, 27, 27)

	# Ores & Gems (drop authentic mined items!)
	_register(BlockID.COAL_ORE, "Coal Ore", false, true, 2.5, "pickaxe", 201, Color(0.3, 0.3, 0.3), 28, 28, 28, false) # Drops COAL
	_register(BlockID.IRON_ORE, "Iron Ore", false, true, 3.0, "pickaxe", 202, Color(0.65, 0.52, 0.44), 29, 29, 29, false) # Drops IRON_INGOT (smelted/ore)
	_register(BlockID.COPPER_ORE, "Copper Ore", false, true, 2.8, "pickaxe", 203, Color(0.48, 0.65, 0.55), 30, 30, 30, false) # Drops COPPER_INGOT
	_register(BlockID.GOLD_ORE, "Zeravshan Gold Ore", false, true, 3.5, "pickaxe", 204, Color(0.9, 0.8, 0.3), 31, 31, 31, false) # Drops GOLD_INGOT
	_register(BlockID.LAPIS_LAZULI_ORE, "Badakhshan Lapis Ore", false, true, 3.2, "pickaxe", 205, Color(0.18, 0.32, 0.78), 32, 32, 32, false) # Drops LAPIS_GEM
	_register(BlockID.RUBY_ORE, "Pamir Ruby Ore", false, true, 3.8, "pickaxe", 206, Color(0.85, 0.15, 0.28), 33, 33, 33, false) # Drops RUBY_GEM

	# Traditional Tajik Architecture & Construction
	_register(BlockID.CLAY_BRICK, "Hisor Fortress Brick", false, true, 2.5, "pickaxe", BlockID.CLAY_BRICK, Color(0.72, 0.42, 0.28), 34, 34, 34)
	_register(BlockID.CARVED_WOOD_PANEL, "Traditional Carved Wood", false, true, 1.8, "axe", BlockID.CARVED_WOOD_PANEL, Color(0.55, 0.38, 0.22), 35, 35, 35)
	_register(BlockID.TAJIK_CARPET_BLOCK, "Suzani Carpet Block", false, true, 0.8, "shears", BlockID.TAJIK_CARPET_BLOCK, Color(0.78, 0.18, 0.22), 36, 36, 36)
	_register(BlockID.TANDOOR_OVEN, "Tandoor Bread Oven", false, true, 2.5, "pickaxe", BlockID.TANDOOR_OVEN, Color(0.68, 0.48, 0.35), 37, 38, 37)
	_register(BlockID.GLASS, "Glass Window", true, true, 0.3, "pickaxe", 0, Color(0.85, 0.95, 1.0, 0.4), 39, 39, 39)
	_register(BlockID.WOODEN_DOOR, "Wooden Door", true, true, 1.5, "axe", BlockID.WOODEN_DOOR, Color(0.6, 0.42, 0.25), 40, 40, 40)
	_register(BlockID.WOODEN_FENCE, "Wooden Fence", true, true, 1.2, "axe", BlockID.WOODEN_FENCE, Color(0.65, 0.48, 0.3), 41, 41, 41)
	_register(BlockID.ROOF_CLAY_TILE, "Clay Roof Tile", false, true, 1.8, "pickaxe", BlockID.ROOF_CLAY_TILE, Color(0.62, 0.35, 0.24), 42, 42, 42)
	_register(BlockID.CHORXONA_PILLAR, "Pamiri House Pillar", false, true, 2.0, "axe", BlockID.CHORXONA_PILLAR, Color(0.52, 0.36, 0.2), 43, 43, 43)
	_register(BlockID.CHEST, "Carved Wooden Chest (Sanduq)", false, true, 1.8, "axe", BlockID.CHEST, Color(0.5, 0.32, 0.18), 44, 45, 44)
	_register(BlockID.CRAFTING_TABLE, "Artisan Workbench", false, true, 1.8, "axe", BlockID.CRAFTING_TABLE, Color(0.68, 0.5, 0.32), 46, 47, 17)

	# Flora & Crops
	_register(BlockID.WILDFLOWER_TULIP, "Wild Mountain Tulip (Lola)", true, false, 0.0, "none", BlockID.WILDFLOWER_TULIP, Color(0.9, 0.15, 0.18), 48, 48, 48)
	_register(BlockID.ARTEMISIA, "Artemisia (Darmona)", true, false, 0.0, "none", BlockID.ARTEMISIA, Color(0.45, 0.62, 0.48), 49, 49, 49)
	_register(BlockID.ALPINE_FLOWERS, "Alpine Wildflowers", true, false, 0.0, "none", BlockID.ALPINE_FLOWERS, Color(0.65, 0.4, 0.85), 50, 50, 50)
	_register(BlockID.WHEAT_CROP, "Wheat Crop", true, false, 0.0, "none", 301, Color(0.85, 0.75, 0.35), 51, 51, 51, false) # Drops WHEAT
	_register(BlockID.COTTON_PLANT, "Khatlon Cotton", true, false, 0.0, "none", 209, Color(0.95, 0.95, 0.92), 52, 52, 52, false) # Drops RAW_COTTON
	_register(BlockID.MELON_BLOCK, "Tajik Sweet Melon", false, true, 1.0, "axe", 409, Color(0.55, 0.75, 0.28), 53, 53, 53, false) # Drops MELON_SLICE
	_register(BlockID.BED, "Traditional Tochak Bed", false, true, 1.0, "axe", BlockID.BED, Color(0.75, 0.25, 0.3), 54, 54, 54)
	_register(BlockID.TORCH, "Torch", true, false, 0.0, "none", BlockID.TORCH, Color(1.0, 0.85, 0.4), 55, 55, 55)

	# Expanded Tajik Trees, Flora & Masonry
	_register(BlockID.LEAVES_APPLE, "Apple Tree Leaves", true, true, 0.2, "shears", 414, Color(0.35, 0.65, 0.22), 56, 56, 56, false) # Drops APPLE_FRUIT
	_register(BlockID.LEAVES_MULBERRY, "Mulberry Tree Leaves", true, true, 0.2, "shears", 415, Color(0.30, 0.58, 0.24), 57, 57, 57, false) # Drops MULBERRY_FRUIT
	_register(BlockID.WOOD_LOG_WILLOW, "Willow Wood", false, true, 1.8, "axe", BlockID.WOOD_LOG_WILLOW, Color(0.45, 0.40, 0.30), 13, 58, 13)
	_register(BlockID.LEAVES_WILLOW, "Willow Drooping Leaves", true, true, 0.2, "shears", 0, Color(0.38, 0.65, 0.28), 59, 59, 59)
	_register(BlockID.DECORATIVE_TILE, "Turquoise Mosaic Tile", false, true, 2.0, "pickaxe", BlockID.DECORATIVE_TILE, Color(0.10, 0.72, 0.78), 60, 60, 60)
	_register(BlockID.FARMLAND, "Tilled Farmland Soil", false, true, 0.5, "shovel", BlockID.DIRT, Color(0.35, 0.22, 0.12), 61, 1, 1)
	_register(BlockID.MEDICINAL_HERBS, "Mountain Medicinal Herbs", true, false, 0.0, "none", BlockID.MEDICINAL_HERBS, Color(0.25, 0.58, 0.35), 62, 62, 62)
	_register(BlockID.MUDBRICK_PAKHSA, "Panjakent Mudbrick (Pakhsa)", false, true, 1.8, "pickaxe", BlockID.MUDBRICK_PAKHSA, Color(0.75, 0.62, 0.45), 63, 63, 63)
	_register(BlockID.WOODEN_STAIRS, "Wooden Steps", false, true, 1.5, "axe", BlockID.WOODEN_STAIRS, Color(0.65, 0.48, 0.30), 64, 64, 64)
	_register(BlockID.SNOW_GRASS, "Alpine Snow-Grass", false, true, 0.6, "shovel", BlockID.DIRT, Color(0.90, 0.94, 0.98), 4, 65, 1)

static func get_block(id: int) -> Dictionary:
	if not blocks.has(id):
		if blocks.is_empty():
			_register_all()
		return blocks.get(id, blocks[BlockID.AIR])
	return blocks[id]

static func is_transparent(id: int) -> bool:
	return get_block(id)["transparent"]

static func is_solid(id: int) -> bool:
	return get_block(id)["solid"]

static func is_plant(id: int) -> bool:
	return get_block(id)["is_plant"]

static func get_hardness(id: int) -> float:
	return get_block(id)["hardness"]

static func get_color(id: int) -> Color:
	return get_block(id)["color"]

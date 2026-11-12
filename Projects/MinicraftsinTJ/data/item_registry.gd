class_name ItemRegistry
extends RefCounted

enum ItemID {
	NONE = 0,
	# Tools & Weapons
	WOOD_PICKAXE = 100,
	STONE_PICKAXE = 101,
	IRON_PICKAXE = 102,
	WOOD_AXE = 103,
	STONE_AXE = 104,
	IRON_AXE = 105,
	WOOD_SHOVEL = 106,
	STONE_SHOVEL = 107,
	IRON_SHOVEL = 108,
	WOOD_HOE = 109,
	IRON_HOE = 110,
	WOOD_SWORD = 111,
	STONE_SWORD = 112,
	IRON_SWORD = 113,
	PAMIR_KORD = 114,
	FISHING_ROD = 115,

	# Materials & Resources
	STICK = 200,
	COAL = 201,
	IRON_INGOT = 202,
	COPPER_INGOT = 203,
	GOLD_INGOT = 204,
	LAPIS_GEM = 205,
	RUBY_GEM = 206,
	CLAY_BALL = 207,
	BRICK_ITEM = 208,
	RAW_COTTON = 209,
	COTTON_FABRIC = 210,
	SHEEP_WOOL = 211,
	LEATHER = 212,

	# Seeds & Farming
	WHEAT_SEEDS = 300,
	WHEAT = 301,
	COTTON_SEEDS = 302,
	MELON_SEEDS = 303,

	# Traditional Food & Cuisine
	NON_BREAD = 400,
	FATIR = 401,
	SAMBUSA = 402,
	OSHI_PALOV = 403,
	QURUTOB = 404,
	QURUT = 405,
	DRIED_APRICOTS = 406,
	WALNUTS = 407,
	GRAPES = 408,
	MELON_SLICE = 409,
	RAW_MEAT = 410,
	COOKED_MEAT = 411,
	MILK_BOWL = 412,
	GREEN_TEA = 413,
	APPLE_FRUIT = 414,
	MULBERRY_FRUIT = 415,
	RAW_TROUT = 416,
	COOKED_TROUT = 417,
	EGG = 418,

	# Cultural Artefacts & Wearables
	TOKI_CAP = 500,
	CHAPAN_COAT = 501,
	PAMIRI_SOCKS = 502,
	DUTAR = 503,
	RUBAB = 504,
	CERAMIC_TEAPOT = 505
}

static var items: Dictionary = {}

static func _static_init() -> void:
	_register_all()

static func _register(id: int, name: String, max_stack: int, category: String, hunger_restore: float = 0.0, temp_warmth: float = 0.0, tool_tier: int = 0, tool_power: float = 1.0, is_food: bool = false, is_tool: bool = false, atlas_idx: int = 83) -> void:
	items[id] = {
		"id": id,
		"name": name,
		"max_stack": max_stack,
		"category": category,
		"hunger_restore": hunger_restore,
		"temp_warmth": temp_warmth,
		"tool_tier": tool_tier,
		"tool_power": tool_power,
		"is_food": is_food,
		"is_tool": is_tool,
		"atlas_idx": atlas_idx
	}

static func _register_all() -> void:
	items.clear()
	_register(ItemID.NONE, "Empty", 0, "none", 0, 0, 0, 0, false, false, 0)

	# Tools & Weapons (atlas 68..82 + 120)
	_register(ItemID.WOOD_PICKAXE, "Wooden Pickaxe", 1, "tool", 0, 0, 1, 2.0, false, true, 68)
	_register(ItemID.STONE_PICKAXE, "Stone Pickaxe", 1, "tool", 0, 0, 2, 4.0, false, true, 69)
	_register(ItemID.IRON_PICKAXE, "Iron Pickaxe", 1, "tool", 0, 0, 3, 6.5, false, true, 70)
	_register(ItemID.WOOD_AXE, "Wooden Axe", 1, "tool", 0, 0, 1, 2.0, false, true, 71)
	_register(ItemID.STONE_AXE, "Stone Axe", 1, "tool", 0, 0, 2, 4.0, false, true, 72)
	_register(ItemID.IRON_AXE, "Iron Axe", 1, "tool", 0, 0, 3, 6.0, false, true, 73)
	_register(ItemID.WOOD_SHOVEL, "Wooden Shovel", 1, "tool", 0, 0, 1, 2.0, false, true, 74)
	_register(ItemID.STONE_SHOVEL, "Stone Shovel", 1, "tool", 0, 0, 2, 3.5, false, true, 75)
	_register(ItemID.IRON_SHOVEL, "Iron Shovel", 1, "tool", 0, 0, 3, 5.5, false, true, 76)
	_register(ItemID.WOOD_HOE, "Wooden Hoe", 1, "tool", 0, 0, 1, 1.0, false, true, 77)
	_register(ItemID.IRON_HOE, "Iron Hoe", 1, "tool", 0, 0, 3, 1.0, false, true, 78)
	_register(ItemID.WOOD_SWORD, "Wooden Sword", 1, "weapon", 0, 0, 1, 3.0, false, true, 79)
	_register(ItemID.STONE_SWORD, "Stone Sword", 1, "weapon", 0, 0, 2, 4.5, false, true, 80)
	_register(ItemID.IRON_SWORD, "Iron Sword", 1, "weapon", 0, 0, 3, 6.0, false, true, 81)
	_register(ItemID.PAMIR_KORD, "Pamir Steel Kord Dagger", 1, "weapon", 0, 0, 4, 8.0, false, true, 82)
	_register(ItemID.FISHING_ROD, "River Fishing Rod (Chubdast)", 1, "tool", 0, 0, 1, 1.0, false, true, 120)

	# Materials (atlas 83..95)
	_register(ItemID.STICK, "Wooden Stick", 64, "material", 0, 0, 0, 1.0, false, false, 83)
	_register(ItemID.COAL, "Mineral Coal", 64, "material", 0, 0, 0, 1.0, false, false, 84)
	_register(ItemID.IRON_INGOT, "Forged Iron Ingot", 64, "material", 0, 0, 0, 1.0, false, false, 85)
	_register(ItemID.COPPER_INGOT, "Copper Ingot", 64, "material", 0, 0, 0, 1.0, false, false, 86)
	_register(ItemID.GOLD_INGOT, "Zeravshan Gold Bar", 64, "material", 0, 0, 0, 1.0, false, false, 87)
	_register(ItemID.LAPIS_GEM, "Badakhshan Lapis Lazuli", 64, "material", 0, 0, 0, 1.0, false, false, 88)
	_register(ItemID.RUBY_GEM, "Pamir Mountain Ruby", 64, "material", 0, 0, 0, 1.0, false, false, 89)
	_register(ItemID.CLAY_BALL, "River Clay Ball", 64, "material", 0, 0, 0, 1.0, false, false, 90)
	_register(ItemID.BRICK_ITEM, "Fired Clay Brick", 64, "material", 0, 0, 0, 1.0, false, false, 91)
	_register(ItemID.RAW_COTTON, "Khatlon Raw Cotton", 64, "material", 0, 0, 0, 1.0, false, false, 92)
	_register(ItemID.COTTON_FABRIC, "Woven Cotton Fabric", 64, "material", 0, 0, 0, 1.0, false, false, 93)
	_register(ItemID.SHEEP_WOOL, "Mountain Sheep Wool", 64, "material", 0, 0, 0, 1.0, false, false, 94)
	_register(ItemID.LEATHER, "Cured Animal Leather", 64, "material", 0, 0, 0, 1.0, false, false, 95)

	# Farming & Seeds (atlas 96..99)
	_register(ItemID.WHEAT_SEEDS, "Wheat Seeds", 64, "seed", 0, 0, 0, 1.0, false, false, 96)
	_register(ItemID.WHEAT, "Harvested Wheat", 64, "material", 0, 0, 0, 1.0, false, false, 97)
	_register(ItemID.COTTON_SEEDS, "Cotton Seeds", 64, "seed", 0, 0, 0, 1.0, false, false, 98)
	_register(ItemID.MELON_SEEDS, "Melon Seeds", 64, "seed", 0, 0, 0, 1.0, false, false, 99)

	# Traditional Foods (atlas 100..113 + 121..125)
	_register(ItemID.NON_BREAD, "Tandoor Non Bread", 16, "food", 25.0, 5.0, 0, 0, true, false, 100)
	_register(ItemID.FATIR, "Crispy Fatir Bread", 16, "food", 20.0, 4.0, 0, 0, true, false, 101)
	_register(ItemID.SAMBUSA, "Mountain Mutton Sambusa", 16, "food", 35.0, 10.0, 0, 0, true, false, 102)
	_register(ItemID.OSHI_PALOV, "Traditional Oshi Palov", 8, "food", 60.0, 20.0, 0, 0, true, false, 103)
	_register(ItemID.QURUTOB, "Authentic Qurutob", 8, "food", 55.0, 15.0, 0, 0, true, false, 104)
	_register(ItemID.QURUT, "Dried Qurut Balls", 32, "food", 12.0, 2.0, 0, 0, true, false, 105)
	_register(ItemID.DRIED_APRICOTS, "Dried Pamir Apricots (Uryuk)", 32, "food", 15.0, 2.0, 0, 0, true, false, 106)
	_register(ItemID.WALNUTS, "Zeravshan Walnuts", 32, "food", 14.0, 3.0, 0, 0, true, false, 107)
	_register(ItemID.GRAPES, "Sweet Valley Grapes", 32, "food", 12.0, 0.0, 0, 0, true, false, 108)
	_register(ItemID.MELON_SLICE, "Juicy Melon Slice", 32, "food", 18.0, 0.0, 0, 0, true, false, 109)
	_register(ItemID.RAW_MEAT, "Raw Mountain Meat", 16, "food", 8.0, 0.0, 0, 0, true, false, 110)
	_register(ItemID.COOKED_MEAT, "Roasted Shashlik Meat", 16, "food", 40.0, 12.0, 0, 0, true, false, 111)
	_register(ItemID.MILK_BOWL, "Fresh Yak Milk", 8, "food", 20.0, 8.0, 0, 0, true, false, 112)
	_register(ItemID.GREEN_TEA, "Kok-Chai (Green Tea)", 16, "food", 10.0, 15.0, 0, 0, true, false, 113)
	_register(ItemID.APPLE_FRUIT, "Crisp Mountain Apple", 32, "food", 14.0, 0.0, 0, 0, true, false, 124)
	_register(ItemID.MULBERRY_FRUIT, "Sweet Mulberries (Tut)", 32, "food", 10.0, 0.0, 0, 0, true, false, 125)
	_register(ItemID.RAW_TROUT, "Mountain Trout (Gulmohi)", 16, "food", 10.0, 0.0, 0, 0, true, false, 121)
	_register(ItemID.COOKED_TROUT, "Grilled Mountain Trout", 16, "food", 38.0, 10.0, 0, 0, true, false, 122)
	_register(ItemID.EGG, "Fresh Farm Egg", 16, "material", 0.0, 0.0, 0, 0, false, false, 123)

	# Cultural & Wearable (atlas 114..119)
	_register(ItemID.TOKI_CAP, "Embroidered Toki Cap", 1, "armor", 0, 5.0, 0, 0, false, false, 114)
	_register(ItemID.CHAPAN_COAT, "Warm Quilted Chapan", 1, "armor", 0, 25.0, 0, 0, false, false, 115)
	_register(ItemID.PAMIRI_SOCKS, "Pamiri Wool Jurab Socks", 1, "armor", 0, 15.0, 0, 0, false, false, 116)
	_register(ItemID.DUTAR, "Handmade Tajik Dutar", 1, "cultural", 0, 0, 0, 0, false, false, 117)
	_register(ItemID.RUBAB, "Pamiri Rubab", 1, "cultural", 0, 0, 0, 0, false, false, 118)
	_register(ItemID.CERAMIC_TEAPOT, "Painted Chaynik Teapot", 4, "cultural", 0, 0, 0, 0, false, false, 119)

static func get_item(id: int) -> Dictionary:
	if not items.has(id):
		if items.is_empty():
			_register_all()
		return items.get(id, items[ItemID.NONE])
	return items[id]

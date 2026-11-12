class_name RecipeRegistry
extends RefCounted

# Recipe struct:
# result_id (Item or Block ID), result_count, is_block (bool),
# ingredients: Dictionary of { id: count } or 2D array for shaped recipes.
# We support both shapeless matching by ingredient count and grid matching.

static var recipes: Array[Dictionary] = []

static func _static_init() -> void:
	_register_all()

static func _register_recipe(result_id: int, result_count: int, is_block: bool, ingredients: Dictionary, workstation: String = "any") -> void:
	recipes.append({
		"result_id": result_id,
		"result_count": result_count,
		"is_block": is_block,
		"ingredients": ingredients, # { item/block_id: needed_count }
		"workstation": workstation # "any", "crafting_table", "tandoor"
	})

static func _register_all() -> void:
	recipes.clear()
	
	# Wood processing
	_register_recipe(BlockRegistry.BlockID.WOOD_PLANKS, 4, true, { BlockRegistry.BlockID.WOOD_LOG_JUNIPER: 1 })
	_register_recipe(BlockRegistry.BlockID.WOOD_PLANKS, 4, true, { BlockRegistry.BlockID.WOOD_LOG_POPLAR: 1 })
	_register_recipe(BlockRegistry.BlockID.WOOD_PLANKS, 4, true, { BlockRegistry.BlockID.WOOD_LOG_WALNUT: 1 })
	_register_recipe(ItemRegistry.ItemID.STICK, 4, false, { BlockRegistry.BlockID.WOOD_PLANKS: 2 })
	_register_recipe(BlockRegistry.BlockID.CRAFTING_TABLE, 1, true, { BlockRegistry.BlockID.WOOD_PLANKS: 4 })
	_register_recipe(BlockRegistry.BlockID.CHEST, 1, true, { BlockRegistry.BlockID.WOOD_PLANKS: 8 }, "crafting_table")
	_register_recipe(BlockRegistry.BlockID.TORCH, 4, true, { ItemRegistry.ItemID.COAL: 1, ItemRegistry.ItemID.STICK: 1 })
	
	# Wooden Tools
	_register_recipe(ItemRegistry.ItemID.WOOD_PICKAXE, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.WOOD_AXE, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.WOOD_SHOVEL, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 1, ItemRegistry.ItemID.STICK: 2 })
	_register_recipe(ItemRegistry.ItemID.WOOD_HOE, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 2, ItemRegistry.ItemID.STICK: 2 })
	_register_recipe(ItemRegistry.ItemID.WOOD_SWORD, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 2, ItemRegistry.ItemID.STICK: 1 })

	# Stone Tools
	_register_recipe(ItemRegistry.ItemID.STONE_PICKAXE, 1, false, { BlockRegistry.BlockID.COBBLESTONE: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.STONE_AXE, 1, false, { BlockRegistry.BlockID.COBBLESTONE: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.STONE_SHOVEL, 1, false, { BlockRegistry.BlockID.COBBLESTONE: 1, ItemRegistry.ItemID.STICK: 2 })
	_register_recipe(ItemRegistry.ItemID.STONE_SWORD, 1, false, { BlockRegistry.BlockID.COBBLESTONE: 2, ItemRegistry.ItemID.STICK: 1 })

	# Iron Tools
	_register_recipe(ItemRegistry.ItemID.IRON_PICKAXE, 1, false, { ItemRegistry.ItemID.IRON_INGOT: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.IRON_AXE, 1, false, { ItemRegistry.ItemID.IRON_INGOT: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.IRON_SHOVEL, 1, false, { ItemRegistry.ItemID.IRON_INGOT: 1, ItemRegistry.ItemID.STICK: 2 })
	_register_recipe(ItemRegistry.ItemID.IRON_HOE, 1, false, { ItemRegistry.ItemID.IRON_INGOT: 2, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.IRON_SWORD, 1, false, { ItemRegistry.ItemID.IRON_INGOT: 2, ItemRegistry.ItemID.STICK: 1 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.PAMIR_KORD, 1, false, { ItemRegistry.ItemID.RUBY_GEM: 1, ItemRegistry.ItemID.IRON_INGOT: 2, ItemRegistry.ItemID.STICK: 1 }, "crafting_table")

	# Traditional Tajik Architecture
	_register_recipe(BlockRegistry.BlockID.CLAY_BRICK, 4, true, { BlockRegistry.BlockID.CLAY: 4 })
	_register_recipe(BlockRegistry.BlockID.TANDOOR_OVEN, 1, true, { BlockRegistry.BlockID.CLAY_BRICK: 6, BlockRegistry.BlockID.COBBLESTONE: 2 }, "crafting_table")
	_register_recipe(BlockRegistry.BlockID.CARVED_WOOD_PANEL, 2, true, { BlockRegistry.BlockID.WOOD_PLANKS: 2 })
	_register_recipe(BlockRegistry.BlockID.CHORXONA_PILLAR, 2, true, { BlockRegistry.BlockID.WOOD_PLANKS: 3, BlockRegistry.BlockID.CARVED_WOOD_PANEL: 1 }, "crafting_table")
	_register_recipe(BlockRegistry.BlockID.TAJIK_CARPET_BLOCK, 1, true, { ItemRegistry.ItemID.SHEEP_WOOL: 2, ItemRegistry.ItemID.COTTON_FABRIC: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.COTTON_FABRIC, 2, false, { ItemRegistry.ItemID.RAW_COTTON: 4 })
	_register_recipe(BlockRegistry.BlockID.BED, 1, true, { ItemRegistry.ItemID.SHEEP_WOOL: 3, BlockRegistry.BlockID.WOOD_PLANKS: 3 }, "crafting_table")
	_register_recipe(BlockRegistry.BlockID.WOODEN_DOOR, 1, true, { BlockRegistry.BlockID.WOOD_PLANKS: 6 }, "crafting_table")
	_register_recipe(BlockRegistry.BlockID.WOODEN_FENCE, 3, true, { BlockRegistry.BlockID.WOOD_PLANKS: 4, ItemRegistry.ItemID.STICK: 2 })

	# Cultural Artefacts & Clothing
	_register_recipe(ItemRegistry.ItemID.TOKI_CAP, 1, false, { ItemRegistry.ItemID.COTTON_FABRIC: 2, ItemRegistry.ItemID.SHEEP_WOOL: 1 })
	_register_recipe(ItemRegistry.ItemID.CHAPAN_COAT, 1, false, { ItemRegistry.ItemID.SHEEP_WOOL: 4, ItemRegistry.ItemID.COTTON_FABRIC: 3 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.PAMIRI_SOCKS, 1, false, { ItemRegistry.ItemID.SHEEP_WOOL: 3 })
	_register_recipe(ItemRegistry.ItemID.DUTAR, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 3, ItemRegistry.ItemID.STICK: 2 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.RUBAB, 1, false, { BlockRegistry.BlockID.WOOD_PLANKS: 4, ItemRegistry.ItemID.LEATHER: 1 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.CERAMIC_TEAPOT, 1, false, { ItemRegistry.ItemID.CLAY_BALL: 4 })

	# Traditional Tajik Cooking (Tandoor & Hearth)
	_register_recipe(ItemRegistry.ItemID.NON_BREAD, 2, false, { ItemRegistry.ItemID.WHEAT: 3 }, "tandoor")
	_register_recipe(ItemRegistry.ItemID.FATIR, 2, false, { ItemRegistry.ItemID.WHEAT: 2, ItemRegistry.ItemID.MILK_BOWL: 1 }, "tandoor")
	_register_recipe(ItemRegistry.ItemID.SAMBUSA, 2, false, { ItemRegistry.ItemID.WHEAT: 2, ItemRegistry.ItemID.RAW_MEAT: 1 }, "tandoor")
	_register_recipe(ItemRegistry.ItemID.COOKED_MEAT, 1, false, { ItemRegistry.ItemID.RAW_MEAT: 1, ItemRegistry.ItemID.COAL: 1 })
	_register_recipe(ItemRegistry.ItemID.COOKED_TROUT, 1, false, { ItemRegistry.ItemID.RAW_TROUT: 1, ItemRegistry.ItemID.COAL: 1 }, "tandoor")
	_register_recipe(ItemRegistry.ItemID.OSHI_PALOV, 1, false, { ItemRegistry.ItemID.WHEAT: 2, ItemRegistry.ItemID.RAW_MEAT: 1, ItemRegistry.ItemID.COOKED_MEAT: 1 }, "crafting_table")
	_register_recipe(ItemRegistry.ItemID.QURUTOB, 1, false, { ItemRegistry.ItemID.FATIR: 1, ItemRegistry.ItemID.QURUT: 2 })
	_register_recipe(ItemRegistry.ItemID.QURUT, 4, false, { ItemRegistry.ItemID.MILK_BOWL: 2 })
	_register_recipe(ItemRegistry.ItemID.GREEN_TEA, 2, false, { BlockRegistry.BlockID.MEDICINAL_HERBS: 1, ItemRegistry.ItemID.CERAMIC_TEAPOT: 1 })

	# Additional Tools, Building & Farming
	_register_recipe(ItemRegistry.ItemID.FISHING_ROD, 1, false, { ItemRegistry.ItemID.STICK: 3, ItemRegistry.ItemID.RAW_COTTON: 2 })
	_register_recipe(ItemRegistry.ItemID.WHEAT_SEEDS, 2, false, { ItemRegistry.ItemID.WHEAT: 1 })
	_register_recipe(BlockRegistry.BlockID.DECORATIVE_TILE, 4, true, { BlockRegistry.BlockID.CLAY_BRICK: 2, ItemRegistry.ItemID.LAPIS_GEM: 1 }, "crafting_table")
	_register_recipe(BlockRegistry.BlockID.MUDBRICK_PAKHSA, 4, true, { BlockRegistry.BlockID.CLAY: 2, BlockRegistry.BlockID.DIRT: 2 })
	_register_recipe(BlockRegistry.BlockID.WOODEN_STAIRS, 4, true, { BlockRegistry.BlockID.WOOD_PLANKS: 6 })

static func find_matching_recipes(available_items: Dictionary, current_workstation: String = "any") -> Array[Dictionary]:
	var matches: Array[Dictionary] = []
	for recipe in recipes:
		if recipe["workstation"] != "any" and current_workstation != "crafting_table" and recipe["workstation"] != current_workstation:
			continue
		var can_craft: bool = true
		for req_id in recipe["ingredients"]:
			var req_count: int = recipe["ingredients"][req_id]
			if available_items.get(req_id, 0) < req_count:
				can_craft = false
				break
		if can_craft:
			matches.append(recipe)
	return matches


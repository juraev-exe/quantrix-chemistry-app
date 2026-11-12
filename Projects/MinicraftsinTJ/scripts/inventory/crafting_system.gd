class_name CraftingSystem
extends RefCounted

# Evaluates available recipes against player inventory and executes crafts

static func get_available_recipes(inventory: InventoryManager, workstation: String = "any") -> Array[Dictionary]:
	var counts: Dictionary = {}
	for slot in inventory.slots:
		if slot["id"] != 0 and slot["count"] > 0:
			counts[slot["id"]] = counts.get(slot["id"], 0) + slot["count"]

	return RecipeRegistry.find_matching_recipes(counts, workstation)

static func craft_recipe(recipe: Dictionary, inventory: InventoryManager) -> bool:
	var ingredients: Dictionary = recipe["ingredients"]
	
	# 1. Verify player has all ingredients
	for item_id in ingredients:
		var req_count: int = ingredients[item_id]
		# Check both item and block slots
		var found_count: int = 0
		for slot in inventory.slots:
			if slot["id"] == item_id:
				found_count += slot["count"]
		if found_count < req_count:
			return false

	# 2. Deduct ingredients
	for item_id in ingredients:
		var to_remove: int = ingredients[item_id]
		for i in range(inventory.TOTAL_INV_SIZE):
			if inventory.slots[i]["id"] == item_id:
				var take: int = min(to_remove, inventory.slots[i]["count"])
				inventory.remove_item_at(i, take)
				to_remove -= take
				if to_remove <= 0:
					break

	# 3. Add crafted result
	var leftover: int = inventory.add_item(recipe["result_id"], recipe["result_count"], recipe["is_block"])
	if leftover > 0:
		print("[Crafting] Inventory full! Leftover items: ", leftover)
		# Future: drop to ground if inventory full
	return true


class_name InventoryManager
extends Node

# Manages player inventory, hotbar, equipment, and storage containers

signal inventory_changed()
signal hotbar_selection_changed(slot_idx: int)
signal item_used(slot_data: Dictionary)

const HOTBAR_SIZE: int = 9
const MAIN_INV_SIZE: int = 27
const TOTAL_INV_SIZE: int = HOTBAR_SIZE + MAIN_INV_SIZE # 36

# Inventory array: each element is Dictionary { "id": int, "count": int, "is_block": bool }
var slots: Array[Dictionary] = []
var active_hotbar_index: int = 0

# Equipment slots: "head", "chest", "legs", "feet"
var equipment: Dictionary = {
	"head": {"id": 0, "count": 0, "is_block": false},
	"chest": {"id": 0, "count": 0, "is_block": false},
	"legs": {"id": 0, "count": 0, "is_block": false},
	"feet": {"id": 0, "count": 0, "is_block": false}
}

func _init() -> void:
	slots.resize(TOTAL_INV_SIZE)
	for i in range(TOTAL_INV_SIZE):
		slots[i] = _empty_slot()

func _ready() -> void:
	# Give starter items suited for Tajik wilderness survival:
	# Wooden pickaxe, bread (non), wooden axe, torches, seeds
	add_item(ItemRegistry.ItemID.WOOD_PICKAXE, 1, false)
	add_item(ItemRegistry.ItemID.WOOD_AXE, 1, false)
	add_item(ItemRegistry.ItemID.NON_BREAD, 6, false)
	add_item(BlockRegistry.BlockID.TORCH, 8, true)
	add_item(BlockRegistry.BlockID.WOOD_PLANKS, 16, true)

func _empty_slot() -> Dictionary:
	return {"id": 0, "count": 0, "is_block": false}

func select_hotbar_slot(index: int) -> void:
	active_hotbar_index = clamp(index, 0, HOTBAR_SIZE - 1)
	hotbar_selection_changed.emit(active_hotbar_index)

func get_active_item() -> Dictionary:
	return slots[active_hotbar_index]

func add_item(item_id: int, count: int, is_block: bool) -> int:
	if item_id == 0 or count <= 0:
		return 0

	var max_stack: int = 64
	if not is_block:
		var item_info = ItemRegistry.get_item(item_id)
		max_stack = item_info.get("max_stack", 64)

	var remaining: int = count

	# 1. Stack onto existing matching slots
	for i in range(TOTAL_INV_SIZE):
		if slots[i]["id"] == item_id and slots[i]["is_block"] == is_block:
			var space: int = max_stack - slots[i]["count"]
			if space > 0:
				var to_add: int = min(remaining, space)
				slots[i]["count"] += to_add
				remaining -= to_add
				if remaining <= 0:
					inventory_changed.emit()
					return 0

	# 2. Fill first available empty slots
	for i in range(TOTAL_INV_SIZE):
		if slots[i]["id"] == 0:
			var to_add: int = min(remaining, max_stack)
			slots[i] = {
				"id": item_id,
				"count": to_add,
				"is_block": is_block
			}
			remaining -= to_add
			if remaining <= 0:
				inventory_changed.emit()
				return 0

	inventory_changed.emit()
	return remaining

func remove_item_at(slot_idx: int, count: int) -> bool:
	if slot_idx < 0 or slot_idx >= TOTAL_INV_SIZE:
		return false
	if slots[slot_idx]["id"] == 0 or slots[slot_idx]["count"] < count:
		return false

	slots[slot_idx]["count"] -= count
	if slots[slot_idx]["count"] <= 0:
		slots[slot_idx] = _empty_slot()

	inventory_changed.emit()
	return true

func consume_active_item() -> bool:
	return remove_item_at(active_hotbar_index, 1)

func swap_slots(idx_a: int, idx_b: int) -> void:
	if idx_a < 0 or idx_a >= TOTAL_INV_SIZE or idx_b < 0 or idx_b >= TOTAL_INV_SIZE:
		return
	var temp = slots[idx_a]
	slots[idx_a] = slots[idx_b]
	slots[idx_b] = temp
	inventory_changed.emit()

func get_item_count(item_id: int, is_block: bool) -> int:
	var total: int = 0
	for s in slots:
		if s["id"] == item_id and s["is_block"] == is_block:
			total += s["count"]
	return total

func has_item(item_id: int, count: int, is_block: bool) -> bool:
	return get_item_count(item_id, is_block) >= count

func serialize() -> Dictionary:
	return {
		"slots": slots,
		"active_hotbar": active_hotbar_index,
		"equipment": equipment
	}

func deserialize(data: Dictionary) -> void:
	if data.has("slots"):
		var saved_slots = data["slots"]
		for i in range(min(TOTAL_INV_SIZE, saved_slots.size())):
			slots[i] = saved_slots[i]
	if data.has("active_hotbar"):
		active_hotbar_index = data["active_hotbar"]
	if data.has("equipment"):
		equipment = data["equipment"]
	inventory_changed.emit()
	hotbar_selection_changed.emit(active_hotbar_index)


class_name InventoryUI
extends Control

signal ui_closed()

var main_panel: Panel = Panel.new()
var inv_grid: GridContainer = GridContainer.new()
var recipe_list: VBoxContainer = VBoxContainer.new()
var lbl_header: Label = Label.new()
var lbl_craft: Label = Label.new()

var player: PlayerController = null
var slot_buttons: Array[Button] = []
var current_workstation: String = "crafting_table"

func _ready() -> void:
	visible = false
	set_anchors_preset(Control.PRESET_FULL_RECT)
	_build_ui()

func set_player(p_player: PlayerController) -> void:
	player = p_player
	player.inventory.inventory_changed.connect(refresh)
	player.open_workstation.connect(open_station)

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("inventory"):
		current_workstation = "crafting_table"
		toggle_visibility()
		get_viewport().set_input_as_handled()

func open_station(station_type: String) -> void:
	current_workstation = station_type
	if not visible:
		toggle_visibility()
	else:
		refresh()

func toggle_visibility() -> void:
	visible = !visible
	if visible:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		refresh()
	else:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		ui_closed.emit()

func _build_ui() -> void:
	var bg: ColorRect = ColorRect.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.color = Color(0.05, 0.08, 0.12, 0.8)
	add_child(bg)

	main_panel.set_anchors_preset(Control.PRESET_CENTER)
	main_panel.position = Vector2(-420, -260)
	main_panel.size = Vector2(840, 520)

	var sb: StyleBoxFlat = StyleBoxFlat.new()
	sb.bg_color = Color(0.14, 0.16, 0.22, 0.95)
	sb.border_color = Color(0.78, 0.65, 0.35)
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(8)
	main_panel.add_theme_stylebox_override("panel", sb)
	add_child(main_panel)

	lbl_header.text = Loc.t("inventory_title") + " & " + Loc.t("crafting_title")
	lbl_header.position = Vector2(25, 15)
	lbl_header.add_theme_font_size_override("font_size", 18)
	lbl_header.add_theme_color_override("font_color", Color(1.0, 0.85, 0.25))
	main_panel.add_child(lbl_header)

	var left_box: VBoxContainer = VBoxContainer.new()
	left_box.position = Vector2(25, 55)
	left_box.size = Vector2(440, 440)
	main_panel.add_child(left_box)

	var lbl_inv: Label = Label.new()
	lbl_inv.text = "Backpack & Hotbar (36 slots - Click slot 1..9 to equip)"
	lbl_inv.add_theme_font_size_override("font_size", 13)
	left_box.add_child(lbl_inv)

	inv_grid.columns = 9
	inv_grid.custom_minimum_size = Vector2(430, 220)
	left_box.add_child(inv_grid)

	for i in range(36):
		var btn: Button = Button.new()
		btn.custom_minimum_size = Vector2(46, 46)
		btn.pressed.connect(_on_slot_clicked.bind(i))

		var icon_rect := TextureRect.new()
		icon_rect.name = "IconRect"
		icon_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
		icon_rect.offset_left = 6
		icon_rect.offset_top = 6
		icon_rect.offset_right = -6
		icon_rect.offset_bottom = -6
		icon_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon_rect.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		icon_rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
		btn.add_child(icon_rect)

		var count_lbl := Label.new()
		count_lbl.name = "CountLabel"
		count_lbl.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
		count_lbl.position = Vector2(-20, -16)
		count_lbl.add_theme_font_size_override("font_size", 10)
		count_lbl.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3))
		btn.add_child(count_lbl)

		inv_grid.add_child(btn)
		slot_buttons.append(btn)

	var right_box: VBoxContainer = VBoxContainer.new()
	right_box.position = Vector2(485, 55)
	right_box.size = Vector2(330, 440)
	main_panel.add_child(right_box)

	lbl_craft.text = "Craftable Recipes"
	lbl_craft.add_theme_font_size_override("font_size", 14)
	lbl_craft.add_theme_color_override("font_color", Color(0.4, 0.9, 0.6))
	right_box.add_child(lbl_craft)

	var scroll: ScrollContainer = ScrollContainer.new()
	scroll.custom_minimum_size = Vector2(330, 390)
	recipe_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(recipe_list)
	right_box.add_child(scroll)

func refresh() -> void:
	if not player or not player.inventory:
		return

	lbl_craft.text = "Tandoor Baking Oven (Танӯр)" if current_workstation == "tandoor" else "Craftable Recipes"

	for i in range(36):
		var slot_data = player.inventory.slots[i]
		var btn: Button = slot_buttons[i]
		var icon_rect: TextureRect = btn.get_node("IconRect")
		var count_lbl: Label = btn.get_node("CountLabel")

		if slot_data["id"] != 0 and slot_data["count"] > 0:
			var tile_idx: int = 0
			var item_name: String = ""
			if slot_data["is_block"]:
				var b = BlockRegistry.get_block(slot_data["id"])
				tile_idx = b.get("atlas_side", 0)
				item_name = b["name"]
			else:
				var it = ItemRegistry.get_item(slot_data["id"])
				tile_idx = it.get("atlas_idx", 83)
				item_name = it["name"]

			icon_rect.texture = TextureGenerator.get_tile_atlas_texture(tile_idx)
			btn.tooltip_text = "%s (x%d)" % [item_name, slot_data["count"]]
			count_lbl.text = str(slot_data["count"]) if slot_data["count"] > 1 else ""
		else:
			icon_rect.texture = null
			btn.tooltip_text = ""
			count_lbl.text = ""

	for child in recipe_list.get_children():
		child.queue_free()

	var available = CraftingSystem.get_available_recipes(player.inventory, current_workstation)
	if available.is_empty():
		var empty_lbl = Label.new()
		empty_lbl.text = "No recipes available right now.\nGather wood, stone, wheat, clay, or wool!"
		empty_lbl.add_theme_color_override("font_color", Color(0.7, 0.7, 0.7))
		recipe_list.add_child(empty_lbl)
	else:
		for recipe in available:
			var card: PanelContainer = PanelContainer.new()
			var hbox: HBoxContainer = HBoxContainer.new()
			card.add_child(hbox)

			var res_name: String = ""
			var res_tile: int = 0
			if recipe["is_block"]:
				var b = BlockRegistry.get_block(recipe["result_id"])
				res_name = b["name"]
				res_tile = b.get("atlas_side", 0)
			else:
				var it = ItemRegistry.get_item(recipe["result_id"])
				res_name = it["name"]
				res_tile = it.get("atlas_idx", 83)

			var icon := TextureRect.new()
			icon.custom_minimum_size = Vector2(28, 28)
			icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			icon.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
			icon.texture = TextureGenerator.get_tile_atlas_texture(res_tile)
			hbox.add_child(icon)

			var info_lbl: Label = Label.new()
			info_lbl.text = " %s (x%d)" % [res_name, recipe["result_count"]]
			info_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			hbox.add_child(info_lbl)

			var craft_btn: Button = Button.new()
			craft_btn.text = "Bake" if recipe["workstation"] == "tandoor" else "Craft"
			craft_btn.pressed.connect(_on_craft_clicked.bind(recipe))
			hbox.add_child(craft_btn)

			recipe_list.add_child(card)

func _on_slot_clicked(slot_idx: int) -> void:
	if slot_idx < 9 and player:
		player.inventory.select_hotbar_slot(slot_idx)

func _on_craft_clicked(recipe: Dictionary) -> void:
	if player:
		var success = CraftingSystem.craft_recipe(recipe, player.inventory)
		if success:
			refresh()

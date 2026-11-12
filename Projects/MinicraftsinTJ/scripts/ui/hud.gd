class_name GameHUD
extends Control

var lbl_biome: Label = Label.new()
var lbl_altitude: Label = Label.new()
var lbl_time: Label = Label.new()
var lbl_fps: Label = Label.new()
var lbl_compass: Label = Label.new()
var lbl_target: Label = Label.new()
var lbl_notification: Label = Label.new()
var crosshair: Label = Label.new()

var bar_health: ProgressBar = ProgressBar.new()
var bar_hunger: ProgressBar = ProgressBar.new()
var bar_stamina: ProgressBar = ProgressBar.new()
var lbl_temp: Label = Label.new()

var hotbar_container: HBoxContainer = HBoxContainer.new()
var hotbar_slots: Array[Panel] = []

var death_overlay: Panel = Panel.new()
var map_overlay: Panel = Panel.new()
var map_image_rect: TextureRect = TextureRect.new()

var player: PlayerController = null
var notif_timer: float = 0.0
var discovered_biomes: Dictionary = {}

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	set_anchors_preset(Control.PRESET_FULL_RECT)
	_build_ui()
	GameManager.time_changed.connect(_on_time_changed)

func set_player_reference(p_player: PlayerController) -> void:
	player = p_player
	player.survival_stats.stats_updated.connect(_on_stats_updated)
	player.survival_stats.player_died.connect(_on_player_died)
	player.survival_stats.player_respawned.connect(_on_player_respawned)
	player.inventory.inventory_changed.connect(_update_hotbar_display)
	player.inventory.hotbar_selection_changed.connect(_on_hotbar_selection_changed)
	player.interaction_target_changed.connect(_on_target_changed)
	player.action_notification.connect(show_notification)
	_update_hotbar_display()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("map") and not GameManager.is_game_paused:
		_toggle_world_map()

func _build_ui() -> void:
	# 1. Top-Left Info Panel
	var info_box: VBoxContainer = VBoxContainer.new()
	info_box.position = Vector2(20, 20)
	add_child(info_box)

	var title_lbl: Label = Label.new()
	title_lbl.text = "TAJIKCRAFT: LAND OF MOUNTAINS"
	title_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2))
	info_box.add_child(title_lbl)

	info_box.add_child(lbl_biome)
	info_box.add_child(lbl_altitude)
	info_box.add_child(lbl_time)
	info_box.add_child(lbl_fps)

	# Top-Center Compass Bar
	lbl_compass.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_compass.set_anchors_preset(Control.PRESET_CENTER_TOP)
	lbl_compass.position = Vector2(-120, 18)
	lbl_compass.size = Vector2(240, 28)
	lbl_compass.add_theme_color_override("font_color", Color(1.0, 0.9, 0.5))
	add_child(lbl_compass)

	# Action / Discovery Notification Banner
	lbl_notification.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_notification.set_anchors_preset(Control.PRESET_CENTER_TOP)
	lbl_notification.position = Vector2(-220, 56)
	lbl_notification.size = Vector2(440, 32)
	lbl_notification.add_theme_font_size_override("font_size", 15)
	lbl_notification.add_theme_color_override("font_color", Color(0.4, 1.0, 0.6))
	add_child(lbl_notification)

	# 2. Centered Crosshair
	crosshair.text = "+"
	crosshair.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	crosshair.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	crosshair.set_anchors_preset(Control.PRESET_CENTER)
	crosshair.position = Vector2(-10, -10)
	crosshair.add_theme_font_size_override("font_size", 24)
	crosshair.add_theme_color_override("font_color", Color(1, 1, 1, 0.85))
	add_child(crosshair)

	lbl_target.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_target.set_anchors_preset(Control.PRESET_CENTER)
	lbl_target.position = Vector2(-175, 25)
	lbl_target.size = Vector2(350, 30)
	lbl_target.add_theme_color_override("font_color", Color(1.0, 1.0, 0.7))
	add_child(lbl_target)

	# 3. Bottom Stats Container
	var bottom_box: VBoxContainer = VBoxContainer.new()
	bottom_box.set_anchors_preset(Control.PRESET_CENTER_BOTTOM)
	bottom_box.position = Vector2(-265, -145)
	bottom_box.size = Vector2(530, 130)
	add_child(bottom_box)

	var stats_row: HBoxContainer = HBoxContainer.new()
	stats_row.alignment = BoxContainer.ALIGNMENT_CENTER
	bottom_box.add_child(stats_row)

	_setup_bar(bar_health, Color(0.9, 0.15, 0.18), "Health", stats_row)
	_setup_bar(bar_hunger, Color(0.92, 0.65, 0.15), "Hunger", stats_row)
	_setup_bar(bar_stamina, Color(0.2, 0.8, 0.35), "Stamina", stats_row)

	lbl_temp.text = "Temp: 36.6°C (Comfortable)"
	lbl_temp.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_temp.add_theme_font_size_override("font_size", 13)
	lbl_temp.add_theme_color_override("font_color", Color(0.85, 0.95, 1.0))
	bottom_box.add_child(lbl_temp)

	# 4. 9-Slot Hotbar with Pixel Art Icons
	hotbar_container.alignment = BoxContainer.ALIGNMENT_CENTER
	bottom_box.add_child(hotbar_container)

	for i in range(9):
		var slot_panel: Panel = Panel.new()
		slot_panel.custom_minimum_size = Vector2(52, 52)

		var icon_rect: TextureRect = TextureRect.new()
		icon_rect.name = "IconRect"
		icon_rect.set_anchors_preset(Control.PRESET_FULL_RECT)
		icon_rect.offset_left = 6
		icon_rect.offset_top = 6
		icon_rect.offset_right = -6
		icon_rect.offset_bottom = -6
		icon_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon_rect.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		slot_panel.add_child(icon_rect)

		var count_lbl: Label = Label.new()
		count_lbl.name = "CountLabel"
		count_lbl.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
		count_lbl.position = Vector2(-22, -18)
		count_lbl.add_theme_font_size_override("font_size", 11)
		count_lbl.add_theme_color_override("font_color", Color(1, 1, 0.4))
		slot_panel.add_child(count_lbl)

		hotbar_container.add_child(slot_panel)
		hotbar_slots.append(slot_panel)

	_on_hotbar_selection_changed(0)
	_build_death_overlay()
	_build_map_overlay()

func _build_death_overlay() -> void:
	death_overlay.visible = false
	death_overlay.set_anchors_preset(Control.PRESET_FULL_RECT)
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.35, 0.05, 0.05, 0.8)
	death_overlay.add_theme_stylebox_override("panel", sb)
	add_child(death_overlay)

	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(Control.PRESET_CENTER)
	vbox.position = Vector2(-150, -80)
	vbox.size = Vector2(300, 160)
	death_overlay.add_child(vbox)

	var lbl := Label.new()
	lbl.text = "YOU FELL IN THE MOUNTAINS"
	lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl.add_theme_font_size_override("font_size", 22)
	lbl.add_theme_color_override("font_color", Color(1.0, 0.4, 0.4))
	vbox.add_child(lbl)

	var btn_respawn := Button.new()
	btn_respawn.text = "Respawn at Camp / Bed"
	btn_respawn.custom_minimum_size = Vector2(0, 44)
	btn_respawn.pressed.connect(func():
		if player:
			player.respawn_player()
	)
	vbox.add_child(btn_respawn)

func _build_map_overlay() -> void:
	map_overlay.visible = false
	map_overlay.set_anchors_preset(Control.PRESET_CENTER)
	map_overlay.position = Vector2(-220, -240)
	map_overlay.size = Vector2(440, 480)
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.1, 0.13, 0.18, 0.94)
	sb.border_color = Color(0.85, 0.72, 0.3)
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(8)
	map_overlay.add_theme_stylebox_override("panel", sb)
	add_child(map_overlay)

	var title := Label.new()
	title.text = "TAJIKISTAN EXPLORATION MAP [M]"
	title.position = Vector2(20, 12)
	title.add_theme_font_size_override("font_size", 16)
	title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.25))
	map_overlay.add_child(title)

	map_image_rect.position = Vector2(40, 50)
	map_image_rect.size = Vector2(360, 360)
	map_image_rect.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	map_overlay.add_child(map_image_rect)

	var legend := Label.new()
	legend.text = "White: Pamir | Cyan: Fann | Green: Hissar/Zeravshan | Gold: Khatlon"
	legend.position = Vector2(20, 430)
	legend.add_theme_font_size_override("font_size", 11)
	map_overlay.add_child(legend)

func _toggle_world_map() -> void:
	map_overlay.visible = !map_overlay.visible
	if map_overlay.visible and player and GameManager.world_node:
		_render_procedural_map()

func _render_procedural_map() -> void:
	var sz: int = 90
	var img := Image.create(sz, sz, false, Image.FORMAT_RGBA8)
	var gen: TerrainGenerator = GameManager.world_node.terrain_generator
	var px: int = int(player.global_position.x)
	var pz: int = int(player.global_position.z)

	for mx in range(sz):
		for mz in range(sz):
			var wx: float = float(px + (mx - sz / 2) * 3)
			var wz: float = float(pz + (mz - sz / 2) * 3)
			var b_id: int = gen.get_biome_at(wx, wz)
			var col: Color = Color(0.3, 0.65, 0.25)
			match b_id:
				BiomeRegistry.BiomeID.PAMIR_MOUNTAINS: col = Color(0.92, 0.94, 0.98)
				BiomeRegistry.BiomeID.FANN_MOUNTAINS: col = Color(0.20, 0.72, 0.78)
				BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY: col = Color(0.28, 0.65, 0.30)
				BiomeRegistry.BiomeID.HISSAR_VALLEY: col = Color(0.38, 0.72, 0.28)
				BiomeRegistry.BiomeID.KHATLON_LOWLANDS: col = Color(0.82, 0.68, 0.38)
				BiomeRegistry.BiomeID.VAKHSH_RIVER_VALLEY: col = Color(0.12, 0.60, 0.85)
				BiomeRegistry.BiomeID.SEMI_ARID_FOOTHILLS: col = Color(0.75, 0.45, 0.30)
				BiomeRegistry.BiomeID.ALPINE_MEADOWS: col = Color(0.50, 0.78, 0.35)
			img.set_pixel(mx, mz, col)

	# Mark player location at center in bright red
	for dx in range(-1, 2):
		for dz in range(-1, 2):
			img.set_pixel(sz / 2 + dx, sz / 2 + dz, Color(1.0, 0.1, 0.1))

	map_image_rect.texture = ImageTexture.create_from_image(img)

func _setup_bar(bar: ProgressBar, col: Color, label_text: String, parent: Node) -> void:
	var box: VBoxContainer = VBoxContainer.new()
	var lbl: Label = Label.new()
	lbl.text = label_text
	lbl.add_theme_font_size_override("font_size", 11)
	box.add_child(lbl)

	bar.custom_minimum_size = Vector2(130, 14)
	bar.max_value = 100.0
	bar.value = 100.0
	bar.show_percentage = false

	var style: StyleBoxFlat = StyleBoxFlat.new()
	style.bg_color = col
	style.set_corner_radius_all(3)
	bar.add_theme_stylebox_override("fill", style)

	box.add_child(bar)
	parent.add_child(box)

func show_notification(msg: String) -> void:
	lbl_notification.text = msg
	notif_timer = 3.5

func _process(delta: float) -> void:
	if notif_timer > 0.0:
		notif_timer -= delta
		if notif_timer <= 0.0:
			lbl_notification.text = ""

	lbl_fps.text = "FPS: " + str(Engine.get_frames_per_second())
	if player:
		lbl_altitude.text = Loc.t("altitude_label") + " " + str(int(player.global_position.y)) + "m"
		var b_id: int = player.survival_stats.current_biome_id
		var biome_data = BiomeRegistry.get_biome(b_id)
		lbl_biome.text = Loc.t("biome_label") + " " + biome_data["name"]

		if not discovered_biomes.has(b_id):
			discovered_biomes[b_id] = true
			show_notification("Discovered Biome: " + biome_data["name"] + "!")

		# Compass heading calculation
		var deg: float = fmod(rad_to_deg(-player.rotation.y) + 360.0, 360.0)
		var dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
		var idx: int = int(round(deg / 45.0)) % 8
		lbl_compass.text = "Compass: %s (%d°) | X:%d Z:%d" % [dirs[idx], int(deg), int(player.global_position.x), int(player.global_position.z)]

func _on_time_changed(hours: float) -> void:
	var hh: int = int(hours)
	var mm: int = int((hours - float(hh)) * 60.0)
	lbl_time.text = Loc.t("time_label") + " %02d:%02d" % [hh, mm]

func _on_stats_updated(health: float, hunger: float, stamina: float, temp: float) -> void:
	bar_health.value = health
	bar_hunger.value = hunger
	bar_stamina.value = stamina

	var temp_status: String = Loc.t("temp_normal")
	if temp <= SurvivalStats.FROSTBITE_THRESHOLD:
		temp_status = Loc.t("temp_hypothermia")
	elif temp <= SurvivalStats.HYPOTHERMIA_THRESHOLD:
		temp_status = Loc.t("temp_cold")
	elif temp >= SurvivalStats.HEATSTROKE_THRESHOLD:
		temp_status = Loc.t("temp_hot")

	lbl_temp.text = "%s: %.1f°C (%s)" % [Loc.t("stat_temperature"), temp, temp_status]

func _on_player_died(_cause: String) -> void:
	death_overlay.visible = true
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE

func _on_player_respawned() -> void:
	death_overlay.visible = false
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _on_target_changed(block_name: String, _dist: float) -> void:
	lbl_target.text = block_name

func _on_hotbar_selection_changed(active_idx: int) -> void:
	for i in range(hotbar_slots.size()):
		var panel = hotbar_slots[i]
		var sb: StyleBoxFlat = StyleBoxFlat.new()
		sb.set_corner_radius_all(4)
		if i == active_idx:
			sb.bg_color = Color(0.25, 0.28, 0.35, 0.85)
			sb.set_border_width_all(3)
			sb.border_color = Color(1.0, 0.85, 0.2)
		else:
			sb.bg_color = Color(0.12, 0.14, 0.18, 0.7)
			sb.set_border_width_all(1)
			sb.border_color = Color(0.3, 0.35, 0.4)
		panel.add_theme_stylebox_override("panel", sb)

func _update_hotbar_display() -> void:
	if not player or not player.inventory:
		return

	for i in range(9):
		var slot_data = player.inventory.slots[i]
		var panel = hotbar_slots[i]
		var icon_rect: TextureRect = panel.get_node("IconRect")
		var count_lbl: Label = panel.get_node("CountLabel")

		if slot_data["id"] != 0 and slot_data["count"] > 0:
			var tile_idx: int = 0
			var tooltip: String = ""
			if slot_data["is_block"]:
				var b = BlockRegistry.get_block(slot_data["id"])
				tile_idx = b.get("atlas_side", 0)
				tooltip = b["name"]
			else:
				var it = ItemRegistry.get_item(slot_data["id"])
				tile_idx = it.get("atlas_idx", 83)
				tooltip = it["name"]

			icon_rect.texture = TextureGenerator.get_tile_atlas_texture(tile_idx)
			panel.tooltip_text = tooltip
			count_lbl.text = str(slot_data["count"]) if slot_data["count"] > 1 else ""
		else:
			icon_rect.texture = null
			panel.tooltip_text = ""
			count_lbl.text = ""

class_name MainMenu
extends Control

@onready var sub_viewport: SubViewport = SubViewport.new()
@onready var bg_camera: Camera3D = Camera3D.new()

# Menu UI elements
@onready var main_box: VBoxContainer = VBoxContainer.new()
@onready var new_world_dialog: Panel = Panel.new()
@onready var settings_dialog: Panel = Panel.new()

# Dialog inputs
@onready var input_world_name: LineEdit = LineEdit.new()
@onready var input_seed: LineEdit = LineEdit.new()
@onready var opt_mode: OptionButton = OptionButton.new()

var cam_angle: float = 0.0

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	set_anchors_preset(Control.PRESET_FULL_RECT)
	_build_3d_mountain_panorama()
	_build_ui()

func _build_3d_mountain_panorama() -> void:
	# 3D Viewport in background
	var sv_container: SubViewportContainer = SubViewportContainer.new()
	sv_container.set_anchors_preset(Control.PRESET_FULL_RECT)
	sv_container.stretch = true
	add_child(sv_container)

	sub_viewport.size = Vector2i(1280, 720)
	sub_viewport.own_world_3d = true
	sv_container.add_child(sub_viewport)

	# 3D Scene setup
	var scene_root: Node3D = Node3D.new()
	sub_viewport.add_child(scene_root)

	# Environment & Sky
	var world_env: WorldEnvironment = WorldEnvironment.new()
	var env: Environment = Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.48, 0.70, 0.95)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.65, 0.75, 0.88)
	env.ambient_light_energy = 0.6
	env.fog_enabled = true
	env.fog_light_color = Color(0.65, 0.78, 0.92)
	env.fog_density = 0.008
	world_env.environment = env
	scene_root.add_child(world_env)

	# Directional Sunlight
	var sun: DirectionalLight3D = DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-35, 45, 0)
	sun.light_color = Color(1.0, 0.95, 0.85)
	sun.light_energy = 1.2
	sun.shadow_enabled = true
	scene_root.add_child(sun)

	# Build a miniature majestic Pamir mountain panorama chunk
	var chunk: VoxelChunk = VoxelChunk.new()
	chunk.chunk_coord = Vector2i(0, 0)
	scene_root.add_child(chunk)

	var gen: TerrainGenerator = TerrainGenerator.new(19910909)
	gen.generate_chunk_data(chunk)
	chunk.rebuild_mesh()

	# Animated Panoramic Camera
	bg_camera.current = true
	bg_camera.fov = 68.0
	bg_camera.position = Vector3(8, 55, 30)
	bg_camera.look_at(Vector3(8, 40, 8), Vector3.UP)
	scene_root.add_child(bg_camera)

func _process(delta: float) -> void:
	cam_angle += delta * 0.08
	var radius: float = 24.0
	bg_camera.position.x = 8.0 + cos(cam_angle) * radius
	bg_camera.position.z = 8.0 + sin(cam_angle) * radius
	bg_camera.position.y = 52.0 + sin(cam_angle * 0.5) * 3.0
	bg_camera.look_at(Vector3(8, 38, 8), Vector3.UP)

func _build_ui() -> void:
	# Main Vertical Menu Box
	main_box.set_anchors_preset(Control.PRESET_CENTER_LEFT)
	main_box.position = Vector2(80, -180)
	main_box.size = Vector2(380, 360)
	add_child(main_box)

	# Title & Subtitle
	var title_lbl: Label = Label.new()
	title_lbl.text = "TAJIKCRAFT"
	title_lbl.add_theme_font_size_override("font_size", 42)
	title_lbl.add_theme_color_override("font_color", Color(1.0, 0.88, 0.25))
	main_box.add_child(title_lbl)

	var sub_lbl: Label = Label.new()
	sub_lbl.text = "LAND OF MOUNTAINS • САРЗАМИНИ КӮҲҲО"
	sub_lbl.add_theme_font_size_override("font_size", 14)
	sub_lbl.add_theme_color_override("font_color", Color(0.9, 0.95, 1.0))
	main_box.add_child(sub_lbl)

	main_box.add_child(HSeparator.new())

	# Menu Buttons
	var btn_play: Button = _create_menu_button(Loc.t("menu_play"), _on_play_pressed)
	var btn_new: Button = _create_menu_button(Loc.t("menu_new_world"), _on_new_world_pressed)
	var btn_settings: Button = _create_menu_button(Loc.t("menu_settings"), _on_settings_pressed)
	var btn_quit: Button = _create_menu_button(Loc.t("menu_quit"), _on_quit_pressed)

	main_box.add_child(btn_play)
	main_box.add_child(btn_new)
	main_box.add_child(btn_settings)
	main_box.add_child(btn_quit)

	_build_new_world_dialog()
	_build_settings_dialog()

func _create_menu_button(text: String, callback: Callable) -> Button:
	var btn: Button = Button.new()
	btn.text = text
	btn.custom_minimum_size = Vector2(0, 44)
	btn.add_theme_font_size_override("font_size", 15)
	btn.pressed.connect(callback)
	return btn

func _build_new_world_dialog() -> void:
	new_world_dialog.visible = false
	new_world_dialog.set_anchors_preset(Control.PRESET_CENTER)
	new_world_dialog.position = Vector2(-200, -170)
	new_world_dialog.size = Vector2(400, 340)

	var sb: StyleBoxFlat = StyleBoxFlat.new()
	sb.bg_color = Color(0.12, 0.14, 0.18, 0.96)
	sb.border_color = Color(0.85, 0.70, 0.3)
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(8)
	new_world_dialog.add_theme_stylebox_override("panel", sb)
	add_child(new_world_dialog)

	var vbox: VBoxContainer = VBoxContainer.new()
	vbox.position = Vector2(30, 25)
	vbox.size = Vector2(340, 290)
	new_world_dialog.add_child(vbox)

	var title: Label = Label.new()
	title.text = Loc.t("menu_new_world")
	title.add_theme_font_size_override("font_size", 18)
	title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.25))
	vbox.add_child(title)

	vbox.add_child(Label.new()) # Spacing

	# World Name
	var lbl_name: Label = Label.new()
	lbl_name.text = Loc.t("world_name")
	vbox.add_child(lbl_name)
	input_world_name.text = "Tajikistan_Expedition_1"
	vbox.add_child(input_world_name)

	# Seed
	var lbl_seed: Label = Label.new()
	lbl_seed.text = Loc.t("world_seed")
	vbox.add_child(lbl_seed)
	input_seed.text = "19910909"
	vbox.add_child(input_seed)

	# Game Mode
	var lbl_mode: Label = Label.new()
	lbl_mode.text = Loc.t("game_mode")
	vbox.add_child(lbl_mode)
	opt_mode.add_item(Loc.t("mode_survival"), 0)
	opt_mode.add_item(Loc.t("mode_creative"), 1)
	opt_mode.add_item(Loc.t("mode_peaceful"), 2)
	vbox.add_child(opt_mode)

	vbox.add_child(Label.new())

	# Buttons
	var hbox: HBoxContainer = HBoxContainer.new()
	var btn_start: Button = Button.new()
	btn_start.text = Loc.t("btn_create")
	btn_start.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	btn_start.pressed.connect(_on_create_world_confirmed)
	hbox.add_child(btn_start)

	var btn_cancel: Button = Button.new()
	btn_cancel.text = Loc.t("btn_cancel")
	btn_cancel.pressed.connect(func(): new_world_dialog.visible = false)
	hbox.add_child(btn_cancel)

	vbox.add_child(hbox)

func _build_settings_dialog() -> void:
	settings_dialog.visible = false
	settings_dialog.set_anchors_preset(Control.PRESET_CENTER)
	settings_dialog.position = Vector2(-180, -150)
	settings_dialog.size = Vector2(360, 300)

	var sb: StyleBoxFlat = StyleBoxFlat.new()
	sb.bg_color = Color(0.12, 0.14, 0.18, 0.96)
	sb.border_color = Color(0.85, 0.70, 0.3)
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(8)
	settings_dialog.add_theme_stylebox_override("panel", sb)
	add_child(settings_dialog)

	var vbox: VBoxContainer = VBoxContainer.new()
	vbox.position = Vector2(30, 25)
	vbox.size = Vector2(300, 250)
	settings_dialog.add_child(vbox)

	var title: Label = Label.new()
	title.text = Loc.t("menu_settings")
	title.add_theme_font_size_override("font_size", 18)
	title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.25))
	vbox.add_child(title)

	# Language toggle
	var btn_lang_toggle: Button = Button.new()
	btn_lang_toggle.text = "Language: " + GameManager.language.to_upper()
	btn_lang_toggle.pressed.connect(func():
		if GameManager.language == "en":
			GameManager.language = "tg"
		elif GameManager.language == "tg":
			GameManager.language = "ru"
		else:
			GameManager.language = "en"
		btn_lang_toggle.text = "Language: " + GameManager.language.to_upper()
	)
	vbox.add_child(btn_lang_toggle)

	# Render distance
	var lbl_rd: Label = Label.new()
	lbl_rd.text = "Render Distance: %d chunks" % GameManager.render_distance_chunks
	vbox.add_child(lbl_rd)
	var slider_rd: HSlider = HSlider.new()
	slider_rd.min_value = 2
	slider_rd.max_value = 8
	slider_rd.value = GameManager.render_distance_chunks
	slider_rd.value_changed.connect(func(v: float):
		GameManager.render_distance_chunks = int(v)
		lbl_rd.text = "Render Distance: %d chunks" % int(v)
	)
	vbox.add_child(slider_rd)

	vbox.add_child(Label.new())
	var btn_close: Button = Button.new()
	btn_close.text = "Close"
	btn_close.pressed.connect(func(): settings_dialog.visible = false)
	vbox.add_child(btn_close)

func _on_play_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/world/world.tscn")

func _on_new_world_pressed() -> void:
	new_world_dialog.visible = true

func _on_create_world_confirmed() -> void:
	GameManager.current_world_name = input_world_name.text.strip_edges()
	var s_text = input_seed.text.strip_edges()
	if s_text.is_valid_int():
		GameManager.current_seed = s_text.to_int()
	else:
		GameManager.current_seed = s_text.hash()

	GameManager.current_game_mode = opt_mode.selected as GameManager.GameMode
	get_tree().change_scene_to_file("res://scenes/world/world.tscn")

func _on_settings_pressed() -> void:
	settings_dialog.visible = true

func _on_quit_pressed() -> void:
	get_tree().quit()


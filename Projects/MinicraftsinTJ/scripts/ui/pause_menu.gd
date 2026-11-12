class_name PauseMenu
extends Control

@onready var panel: Panel = Panel.new()
@onready var btn_resume: Button = Button.new()
@onready var btn_save: Button = Button.new()
@onready var btn_lang: Button = Button.new()
@onready var btn_main_menu: Button = Button.new()
@onready var lbl_status: Label = Label.new()

func _ready() -> void:
	visible = false
	set_anchors_preset(Control.PRESET_FULL_RECT)
	_build_ui()
	GameManager.game_paused.connect(_on_game_paused)

func _build_ui() -> void:
	var bg: ColorRect = ColorRect.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.color = Color(0, 0, 0, 0.65)
	add_child(bg)

	panel.set_anchors_preset(Control.PRESET_CENTER)
	panel.position = Vector2(-160, -160)
	panel.size = Vector2(320, 320)

	var sb: StyleBoxFlat = StyleBoxFlat.new()
	sb.bg_color = Color(0.12, 0.15, 0.20, 0.95)
	sb.border_color = Color(0.8, 0.65, 0.3)
	sb.set_border_width_all(2)
	sb.set_corner_radius_all(8)
	panel.add_theme_stylebox_override("panel", sb)
	add_child(panel)

	var vbox: VBoxContainer = VBoxContainer.new()
	vbox.position = Vector2(25, 25)
	vbox.size = Vector2(270, 270)
	panel.add_child(vbox)

	var title: Label = Label.new()
	title.text = "PAUSED / ТАВАҚҚУФ"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 18)
	title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.25))
	vbox.add_child(title)

	vbox.add_child(HSeparator.new())

	btn_resume.text = Loc.t("btn_resume")
	btn_resume.custom_minimum_size = Vector2(0, 36)
	btn_resume.pressed.connect(_on_resume_pressed)
	vbox.add_child(btn_resume)

	btn_save.text = Loc.t("btn_save")
	btn_save.custom_minimum_size = Vector2(0, 36)
	btn_save.pressed.connect(_on_save_pressed)
	vbox.add_child(btn_save)

	btn_lang.text = "Language: " + GameManager.language.to_upper()
	btn_lang.custom_minimum_size = Vector2(0, 36)
	btn_lang.pressed.connect(_on_lang_toggle_pressed)
	vbox.add_child(btn_lang)

	btn_main_menu.text = Loc.t("btn_main_menu")
	btn_main_menu.custom_minimum_size = Vector2(0, 36)
	btn_main_menu.pressed.connect(_on_main_menu_pressed)
	vbox.add_child(btn_main_menu)

	lbl_status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_status.add_theme_font_size_override("font_size", 11)
	lbl_status.add_theme_color_override("font_color", Color(0.4, 0.9, 0.5))
	vbox.add_child(lbl_status)

func _on_game_paused(is_paused: bool) -> void:
	visible = is_paused
	if is_paused:
		lbl_status.text = ""

func _on_resume_pressed() -> void:
	GameManager.toggle_pause()

func _on_save_pressed() -> void:
	if GameManager.world_node:
		GameManager.world_node.save_world_modifications()
		lbl_status.text = "World saved successfully!"

func _on_lang_toggle_pressed() -> void:
	if GameManager.language == "en":
		GameManager.language = "tg"
	elif GameManager.language == "tg":
		GameManager.language = "ru"
	else:
		GameManager.language = "en"
	btn_lang.text = "Language: " + GameManager.language.to_upper()
	btn_resume.text = Loc.t("btn_resume")
	btn_save.text = Loc.t("btn_save")
	btn_main_menu.text = Loc.t("btn_main_menu")

func _on_main_menu_pressed() -> void:
	GameManager.toggle_pause()
	get_tree().change_scene_to_file("res://scenes/ui/main_menu.tscn")


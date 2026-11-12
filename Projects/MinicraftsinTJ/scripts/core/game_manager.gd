extends Node

# TajikCraft Global Game Manager Autoload

signal world_loaded(world_name: String)
signal game_paused(is_paused: bool)
signal time_changed(time_of_day: float)
signal weather_changed(weather_name: String)

enum GameMode {
	SURVIVAL = 0,
	CREATIVE = 1,
	PEACEFUL = 2
}

var current_game_mode: GameMode = GameMode.SURVIVAL
var current_world_name: String = "Tajikistan_World_1"
var current_seed: int = 19910909 # Independence Day of Tajikistan
var render_distance_chunks: int = 4 # Default 4 chunks radius for smooth performance
var is_game_paused: bool = false
var language: String = "en" # "en", "tg", "ru"

# Active world time (0.0 to 24.0 hours, 12.0 = Noon, 0.0/24.0 = Midnight)
var world_time_hours: float = 8.0 # Starts in bright morning
var time_speed_multiplier: float = 1.0 # 1 real second = 1 game minute (~24 min day)

# Current weather: "clear", "rain", "snowstorm", "fog", "mountain_wind"
var current_weather: String = "clear"

# Active player references
var player_node: Node = null
var world_node: Node = null

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	_setup_inputs()
	_initialize_registries()
	print("[TajikCraft] Game Manager Initialized. Seed: ", current_seed)

func _setup_inputs() -> void:
	# Register any input actions if not present
	_ensure_action_key("move_forward", KEY_W, KEY_UP)
	_ensure_action_key("move_backward", KEY_S, KEY_DOWN)
	_ensure_action_key("move_left", KEY_A, KEY_LEFT)
	_ensure_action_key("move_right", KEY_D, KEY_RIGHT)
	_ensure_action_key("jump", KEY_SPACE)
	_ensure_action_key("sprint", KEY_SHIFT)
	_ensure_action_key("crouch", KEY_CTRL, KEY_C)
	_ensure_action_key("interact", KEY_E)
	_ensure_action_key("inventory", KEY_TAB, KEY_I)
	_ensure_action_key("toggle_perspective", KEY_F5)
	_ensure_action_key("pause", KEY_ESCAPE)
	_ensure_action_key("map", KEY_M)
	_ensure_action_key("crafting", KEY_C)

	# Hotbar keys 1-9
	var num_keys = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9]
	for i in range(9):
		_ensure_action_key("hotbar_" + str(i + 1), num_keys[i])

	# Mouse clicks
	_ensure_action_mouse("attack_break", MOUSE_BUTTON_LEFT)
	_ensure_action_mouse("place_use", MOUSE_BUTTON_RIGHT)

func _ensure_action_key(action_name: String, keycode1: Key, keycode2: Key = KEY_NONE) -> void:
	if not InputMap.has_action(action_name):
		InputMap.add_action(action_name)
	
	# Check if event already bound
	var existing = InputMap.action_get_events(action_name)
	if existing.is_empty():
		var ev1 = InputEventKey.new()
		ev1.physical_keycode = keycode1
		InputMap.action_add_event(action_name, ev1)
		if keycode2 != KEY_NONE:
			var ev2 = InputEventKey.new()
			ev2.physical_keycode = keycode2
			InputMap.action_add_event(action_name, ev2)

func _ensure_action_mouse(action_name: String, button_index: MouseButton) -> void:
	if not InputMap.has_action(action_name):
		InputMap.add_action(action_name)
	var existing = InputMap.action_get_events(action_name)
	if existing.is_empty():
		var ev = InputEventMouseButton.new()
		ev.button_index = button_index
		InputMap.action_add_event(action_name, ev)

func _initialize_registries() -> void:
	BlockRegistry._static_init()
	ItemRegistry._static_init()
	RecipeRegistry._static_init()
	BiomeRegistry._static_init()
	LandmarkRegistry._static_init()

func _process(delta: float) -> void:
	if is_game_paused:
		return
	# Advance world time: 24 hours per 1440 seconds = 1/60 hr per second
	world_time_hours += (delta / 60.0) * time_speed_multiplier
	if world_time_hours >= 24.0:
		world_time_hours -= 24.0
	time_changed.emit(world_time_hours)

func toggle_pause() -> void:
	is_game_paused = !is_game_paused
	get_tree().paused = is_game_paused
	game_paused.emit(is_game_paused)
	if is_game_paused:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	else:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func set_weather(weather_name: String) -> void:
	current_weather = weather_name
	weather_changed.emit(weather_name)


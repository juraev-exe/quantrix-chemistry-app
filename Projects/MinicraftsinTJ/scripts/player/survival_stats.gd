class_name SurvivalStats
extends Node

# Survival mechanics: Health, Hunger, Stamina, Body Temperature, Altitude Effects

signal stats_updated(health: float, hunger: float, stamina: float, temperature: float)
signal player_died(cause: String)
signal player_respawned()

const MAX_HEALTH: float = 100.0
const MAX_HUNGER: float = 100.0
const MAX_STAMINA: float = 100.0

var health: float = 100.0
var hunger: float = 100.0
var stamina: float = 100.0
var body_temperature: float = 36.6 # Normal human core temp in Celsius

# Rates per second
var hunger_drain_rate: float = 0.08
var stamina_recovery_rate: float = 22.0
var stamina_sprint_cost: float = 18.0
var stamina_jump_cost: float = 12.0

# Temperature thresholds (Celsius)
const HYPOTHERMIA_THRESHOLD: float = 28.0
const FROSTBITE_THRESHOLD: float = 20.0
const HEATSTROKE_THRESHOLD: float = 40.0

# Environmental state
var current_altitude: float = 30.0
var current_biome_id: int = BiomeRegistry.BiomeID.HISSAR_VALLEY
var is_near_fire: bool = false
var is_swimming: bool = false
var is_sprinting: bool = false
var is_dead: bool = false

# Warm clothing protection factor (0.0 to 1.0)
var cold_insulation: float = 0.0

func _process(delta: float) -> void:
	if is_dead or GameManager.is_game_paused:
		return
		
	# Creative mode: infinite stats, no hunger or damage
	if GameManager.current_game_mode == GameManager.GameMode.CREATIVE:
		health = MAX_HEALTH
		hunger = MAX_HUNGER
		stamina = MAX_STAMINA
		body_temperature = 36.6
		stats_updated.emit(health, hunger, stamina, body_temperature)
		return

	_update_stamina(delta)
	_update_hunger(delta)
	_update_temperature(delta)
	_apply_environmental_effects(delta)

	stats_updated.emit(health, hunger, stamina, body_temperature)

func _update_stamina(delta: float) -> void:
	if is_sprinting:
		stamina = max(0.0, stamina - stamina_sprint_cost * delta)
	else:
		stamina = min(MAX_STAMINA, stamina + stamina_recovery_rate * delta)

func _update_hunger(delta: float) -> void:
	# Peaceful mode doesn't deplete hunger
	if GameManager.current_game_mode == GameManager.GameMode.PEACEFUL:
		return

	var multiplier: float = 1.6 if is_sprinting else 1.0
	hunger = max(0.0, hunger - hunger_drain_rate * multiplier * delta)

	# Starvation damage
	if hunger <= 0.0:
		take_damage(2.0 * delta, "starvation")
	# Natural healing when well fed
	elif hunger >= 85.0 and health < MAX_HEALTH:
		health = min(MAX_HEALTH, health + 1.5 * delta)

func _update_temperature(delta: float) -> void:
	# Target temperature depends on biome, altitude, weather, shelter, and clothing
	var biome_data = BiomeRegistry.get_biome(current_biome_id)
	var ambient: float = biome_data.get("ambient_temp", 20.0)

	# Altitude lapse rate: -6.5°C per 100 blocks elevation
	var lapse: float = (current_altitude - 30.0) * 0.4
	var effective_ambient: float = ambient - lapse

	# Weather effects
	if GameManager.current_weather == "snowstorm":
		effective_ambient -= 12.0
	elif GameManager.current_weather == "rain":
		effective_ambient -= 5.0
	elif GameManager.current_weather == "mountain_wind":
		effective_ambient -= 4.0

	# Water chill
	if is_swimming:
		effective_ambient -= 10.0

	# Warmth from campfire or tandoor
	if is_near_fire:
		effective_ambient += 25.0

	# Apply cold insulation (e.g. Chapan coat, Jurab socks)
	if effective_ambient < 36.6:
		effective_ambient += (36.6 - effective_ambient) * cold_insulation

	# Smoothly converge core body temp toward effective ambient
	var convergence_speed: float = 0.015
	body_temperature = move_toward(body_temperature, clamp(effective_ambient, 15.0, 42.0), convergence_speed * delta)

func _apply_environmental_effects(delta: float) -> void:
	# Hypothermia damage in extreme mountain cold
	if body_temperature <= FROSTBITE_THRESHOLD:
		take_damage(3.5 * delta, "frostbite")
	elif body_temperature <= HYPOTHERMIA_THRESHOLD:
		take_damage(1.0 * delta, "hypothermia")
	# Heat stroke in hot lowlands
	elif body_temperature >= HEATSTROKE_THRESHOLD:
		take_damage(2.0 * delta, "heatstroke")

func can_sprint() -> bool:
	return stamina > 5.0 and hunger > 15.0

func consume_jump_stamina() -> void:
	stamina = max(0.0, stamina - stamina_jump_cost)

func take_damage(amount: float, cause: String = "general") -> void:
	if is_dead:
		return
	health = max(0.0, health - amount)
	if health <= 0.0:
		die(cause)

func heal(amount: float) -> void:
	if is_dead:
		return
	health = min(MAX_HEALTH, health + amount)

func feed(hunger_amount: float, warmth_amount: float = 0.0) -> void:
	hunger = min(MAX_HUNGER, hunger + hunger_amount)
	if warmth_amount > 0.0:
		body_temperature = min(37.5, body_temperature + warmth_amount)

func die(cause: String) -> void:
	is_dead = true
	print("[TajikCraft] Player died: ", cause)
	player_died.emit(cause)

func respawn(spawn_pos: Vector3) -> void:
	is_dead = false
	health = MAX_HEALTH
	hunger = MAX_HUNGER
	stamina = MAX_STAMINA
	body_temperature = 36.6
	player_respawned.emit()


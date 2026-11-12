class_name AnimalAI
extends CharacterBody3D

enum AnimalType {
	MARCO_POLO_SHEEP,
	SIBERIAN_IBEX,
	SNOW_LEOPARD,
	BROWN_BEAR,
	WOLF,
	RED_FOX,
	MARMOT,
	YAK,
	SHEEP,
	GOAT,
	COW,
	HORSE,
	DONKEY,
	CHICKEN,
	DOG,
	GOLDEN_EAGLE
}

enum State {
	IDLE,
	WANDER,
	FLEE,
	ATTACK,
	FLY_SOAR
}

@export var animal_type: AnimalType = AnimalType.MARCO_POLO_SHEEP
var current_state: State = State.IDLE

var state_timer: float = 2.0
var wander_target: Vector3 = Vector3.ZERO
var move_speed: float = 2.2
var run_speed: float = 5.5
var health: float = 30.0
var is_dead: bool = false
var product_cooldown: float = 0.0

var body_node: Node3D = Node3D.new()
var head_node: Node3D = Node3D.new()
var leg_fl: MeshInstance3D = MeshInstance3D.new()
var leg_fr: MeshInstance3D = MeshInstance3D.new()
var leg_bl: MeshInstance3D = MeshInstance3D.new()
var leg_br: MeshInstance3D = MeshInstance3D.new()
var horns_mesh: MeshInstance3D = MeshInstance3D.new()

var anim_walk_time: float = 0.0
static var animal_atlas_material: StandardMaterial3D = null

func _ready() -> void:
	_ensure_atlas_material()
	_construct_3d_voxel_model()
	_setup_collision()

func _ensure_atlas_material() -> void:
	if animal_atlas_material == null:
		animal_atlas_material = StandardMaterial3D.new()
		animal_atlas_material.albedo_texture = TextureGenerator.get_atlas_texture()
		animal_atlas_material.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST_WITH_MIPMAPS
		animal_atlas_material.roughness = 0.9

func _create_textured_box(size: Vector3, tile_idx: int) -> ArrayMesh:
	var box_mesh := BoxMesh.new()
	box_mesh.size = size
	var st := SurfaceTool.new()
	st.create_from(box_mesh, 0)
	var arr_mesh := st.commit()

	# Remap BoxMesh UVs to the single 16x16 atlas tile
	var tx: int = tile_idx % 16
	var ty: int = tile_idx / 16
	var u0: float = float(tx) / 16.0
	var v0: float = float(ty) / 16.0
	var step: float = 1.0 / 16.0

	var arrays = arr_mesh.surface_get_arrays(0)
	var uvs: PackedVector2Array = arrays[Mesh.ARRAY_TEX_UV]
	for i in range(uvs.size()):
		uvs[i] = Vector2(u0 + uvs[i].x * step, v0 + uvs[i].y * step)
	arrays[Mesh.ARRAY_TEX_UV] = uvs

	var final_mesh := ArrayMesh.new()
	final_mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arrays)
	final_mesh.surface_set_material(0, animal_atlas_material)
	return final_mesh

func _construct_3d_voxel_model() -> void:
	add_child(body_node)

	var coat_tile: int = 128 # Default Marco Polo wool
	var horn_tile: int = 140
	var body_size: Vector3 = Vector3(0.6, 0.6, 1.0)
	var head_size: Vector3 = Vector3(0.4, 0.4, 0.5)

	match animal_type:
		AnimalType.MARCO_POLO_SHEEP, AnimalType.SHEEP:
			coat_tile = 128
			body_size = Vector3(0.65, 0.65, 1.1)
		AnimalType.SIBERIAN_IBEX, AnimalType.GOAT:
			coat_tile = 130
			body_size = Vector3(0.55, 0.65, 1.0)
		AnimalType.SNOW_LEOPARD:
			coat_tile = 129
			body_size = Vector3(0.5, 0.45, 1.2)
			head_size = Vector3(0.4, 0.35, 0.4)
		AnimalType.YAK:
			coat_tile = 131
			body_size = Vector3(0.9, 0.85, 1.3)
		AnimalType.BROWN_BEAR:
			coat_tile = 132
			body_size = Vector3(0.8, 0.8, 1.3)
		AnimalType.WOLF:
			coat_tile = 133
			body_size = Vector3(0.45, 0.5, 1.0)
		AnimalType.RED_FOX, AnimalType.MARMOT:
			coat_tile = 134
			body_size = Vector3(0.35, 0.35, 0.7)
		AnimalType.GOLDEN_EAGLE:
			coat_tile = 135
			body_size = Vector3(1.2, 0.2, 0.6) # Broad soaring wingspan!
			current_state = State.FLY_SOAR
		AnimalType.COW:
			coat_tile = 136
			body_size = Vector3(0.75, 0.75, 1.2)
		AnimalType.HORSE, AnimalType.DONKEY:
			coat_tile = 137
			body_size = Vector3(0.65, 0.75, 1.3)
		AnimalType.DOG:
			coat_tile = 138
			body_size = Vector3(0.45, 0.5, 0.9)
		AnimalType.CHICKEN:
			coat_tile = 139
			body_size = Vector3(0.3, 0.35, 0.4)

	# Main Torso (Textured!)
	var body_inst: MeshInstance3D = MeshInstance3D.new()
	body_inst.mesh = _create_textured_box(body_size, coat_tile)
	body_inst.position = Vector3(0, body_size.y * 0.5 + 0.4, 0)
	body_node.add_child(body_inst)

	# Head (Textured!)
	head_node.position = body_inst.position + Vector3(0, body_size.y * 0.35, -body_size.z * 0.5)
	var head_inst: MeshInstance3D = MeshInstance3D.new()
	head_inst.mesh = _create_textured_box(head_size, coat_tile)
	head_node.add_child(head_inst)
	body_node.add_child(head_node)

	# Iconic Textured Horns for Pamir & Fann ungulates
	if animal_type in [AnimalType.MARCO_POLO_SHEEP, AnimalType.SIBERIAN_IBEX, AnimalType.YAK, AnimalType.GOAT]:
		var h_size: Vector3 = Vector3(1.1, 0.25, 0.4) if animal_type == AnimalType.MARCO_POLO_SHEEP else Vector3(0.7, 0.5, 0.2)
		horns_mesh.mesh = _create_textured_box(h_size, horn_tile)
		horns_mesh.position = Vector3(0, head_size.y * 0.6, 0)
		head_node.add_child(horns_mesh)

	# 4 Voxel Legs (Textured!)
	var leg_w: float = 0.16
	var leg_h: float = 0.45
	var leg_arr_mesh = _create_textured_box(Vector3(leg_w, leg_h, leg_w), coat_tile)

	var hx: float = body_size.x * 0.38
	var hz: float = body_size.z * 0.38
	leg_fl.mesh = leg_arr_mesh
	leg_fl.position = Vector3(-hx, leg_h * 0.5, -hz)
	leg_fr.mesh = leg_arr_mesh
	leg_fr.position = Vector3(hx, leg_h * 0.5, -hz)
	leg_bl.mesh = leg_arr_mesh
	leg_bl.position = Vector3(-hx, leg_h * 0.5, hz)
	leg_br.mesh = leg_arr_mesh
	leg_br.position = Vector3(hx, leg_h * 0.5, hz)

	body_node.add_child(leg_fl)
	body_node.add_child(leg_fr)
	body_node.add_child(leg_bl)
	body_node.add_child(leg_br)

func _setup_collision() -> void:
	var col: CollisionShape3D = CollisionShape3D.new()
	var box: BoxShape3D = BoxShape3D.new()
	box.size = Vector3(0.8, 1.0, 1.2)
	col.shape = box
	col.position = Vector3(0, 0.5, 0)
	add_child(col)

func _physics_process(delta: float) -> void:
	if is_dead or GameManager.is_game_paused:
		return

	if product_cooldown > 0.0:
		product_cooldown -= delta

	if current_state == State.FLY_SOAR:
		var t: float = Time.get_ticks_msec() * 0.001
		velocity.x = cos(t * 0.5) * 4.0
		velocity.z = sin(t * 0.5) * 4.0
		velocity.y = sin(t * 1.2) * 0.5
		rotation.y = atan2(-velocity.x, -velocity.z)
		move_and_slide()
		return

	if not is_on_floor():
		velocity.y -= 18.0 * delta

	state_timer -= delta
	if state_timer <= 0.0:
		_transition_state()

	_execute_behavior(delta)
	move_and_slide()
	_animate_legs(delta)

func _transition_state() -> void:
	var player = GameManager.player_node
	var player_dist: float = 999.0
	if player:
		player_dist = global_position.distance_to(player.global_position)

	if animal_type in [AnimalType.MARCO_POLO_SHEEP, AnimalType.SIBERIAN_IBEX, AnimalType.MARMOT]:
		if player_dist < 8.0:
			current_state = State.FLEE
			state_timer = 4.0
			return

	if animal_type in [AnimalType.SNOW_LEOPARD, AnimalType.WOLF, AnimalType.BROWN_BEAR]:
		if player_dist < 6.5 and GameManager.current_game_mode == GameManager.GameMode.SURVIVAL:
			current_state = State.ATTACK
			state_timer = 5.0
			return

	var roll: float = randf()
	if roll < 0.45:
		current_state = State.IDLE
		state_timer = randf_range(2.0, 4.5)
		velocity.x = 0
		velocity.z = 0
	else:
		current_state = State.WANDER
		state_timer = randf_range(3.0, 6.0)
		var angle = randf() * TAU
		var dist = randf_range(4.0, 10.0)
		wander_target = global_position + Vector3(cos(angle) * dist, 0, sin(angle) * dist)

func _execute_behavior(delta: float) -> void:
	var player = GameManager.player_node
	match current_state:
		State.IDLE:
			velocity.x = move_toward(velocity.x, 0, 5.0 * delta)
			velocity.z = move_toward(velocity.z, 0, 5.0 * delta)
		State.WANDER:
			var to_target: Vector3 = (wander_target - global_position)
			to_target.y = 0
			if to_target.length() > 0.5:
				var dir: Vector3 = to_target.normalized()
				velocity.x = dir.x * move_speed
				velocity.z = dir.z * move_speed
				rotation.y = lerp_angle(rotation.y, atan2(-dir.x, -dir.z), 6.0 * delta)
			else:
				current_state = State.IDLE
		State.FLEE:
			if player:
				var away: Vector3 = (global_position - player.global_position)
				away.y = 0
				var dir: Vector3 = away.normalized()
				velocity.x = dir.x * run_speed
				velocity.z = dir.z * run_speed
				rotation.y = lerp_angle(rotation.y, atan2(-dir.x, -dir.z), 8.0 * delta)
		State.ATTACK:
			if player:
				var towards: Vector3 = (player.global_position - global_position)
				towards.y = 0
				if towards.length() > 1.3:
					var dir: Vector3 = towards.normalized()
					velocity.x = dir.x * run_speed
					velocity.z = dir.z * run_speed
					rotation.y = lerp_angle(rotation.y, atan2(-dir.x, -dir.z), 8.0 * delta)
				else:
					player.survival_stats.take_damage(12.0 * delta, "wildlife_attack")

func _animate_legs(delta: float) -> void:
	var horiz_vel: float = Vector2(velocity.x, velocity.z).length()
	if horiz_vel > 0.2:
		anim_walk_time += delta * horiz_vel * 4.0
		var swing: float = sin(anim_walk_time) * 0.45
		leg_fl.rotation.x = swing
		leg_br.rotation.x = swing
		leg_fr.rotation.x = -swing
		leg_bl.rotation.x = -swing
	else:
		leg_fl.rotation.x = move_toward(leg_fl.rotation.x, 0, 4.0 * delta)
		leg_fr.rotation.x = move_toward(leg_fr.rotation.x, 0, 4.0 * delta)
		leg_bl.rotation.x = move_toward(leg_bl.rotation.x, 0, 4.0 * delta)
		leg_br.rotation.x = move_toward(leg_br.rotation.x, 0, 4.0 * delta)

func interact_animal(player: Node) -> String:
	if product_cooldown > 0.0:
		return "Wait before gathering again..."
	if animal_type in [AnimalType.MARCO_POLO_SHEEP, AnimalType.SHEEP]:
		player.inventory.add_item(ItemRegistry.ItemID.SHEEP_WOOL, 2, false)
		product_cooldown = 15.0
		return "Sheared Mountain Sheep Wool (+2)!"
	elif animal_type in [AnimalType.COW, AnimalType.YAK, AnimalType.GOAT]:
		player.inventory.add_item(ItemRegistry.ItemID.MILK_BOWL, 1, false)
		product_cooldown = 15.0
		return "Milked Fresh Yak/Cow Milk (+1)!"
	elif animal_type == AnimalType.CHICKEN:
		player.inventory.add_item(ItemRegistry.ItemID.EGG, 1, false)
		product_cooldown = 15.0
		return "Collected Farm Egg (+1)!"
	return ""

func take_damage(amount: float) -> void:
	if is_dead:
		return
	health -= amount
	current_state = State.FLEE
	state_timer = 5.0
	if health <= 0.0:
		die()

func die() -> void:
	is_dead = true
	var player = GameManager.player_node
	if player and player.inventory:
		player.inventory.add_item(ItemRegistry.ItemID.RAW_MEAT, 2, false)
		if animal_type in [AnimalType.MARCO_POLO_SHEEP, AnimalType.SHEEP, AnimalType.YAK]:
			player.inventory.add_item(ItemRegistry.ItemID.SHEEP_WOOL, 2, false)
		else:
			player.inventory.add_item(ItemRegistry.ItemID.LEATHER, 1, false)
	queue_free()

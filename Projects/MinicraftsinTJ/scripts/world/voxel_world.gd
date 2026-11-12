class_name VoxelWorld
extends Node3D

# Central coordinator for voxel chunks, streaming, persistence, and world interaction

signal chunk_loaded(coord: Vector2i)
signal block_modified(world_pos: Vector3i, block_id: int)

var terrain_generator: TerrainGenerator
var chunks: Dictionary = {} # Vector2i -> VoxelChunk
var chunk_generate_queue: Array[Vector2i] = []
var chunk_mesh_queue: Array[VoxelChunk] = []

# Persistent dictionary of player block modifications: Vector3i -> block_id
var modified_blocks: Dictionary = {}

var player: Node3D = null
var current_player_chunk: Vector2i = Vector2i(999999, 999999)
var render_distance: int = 4 # Configurable radius in chunks

const CHUNKS_MESHED_PER_FRAME: int = 2

func _ready() -> void:
	GameManager.world_node = self
	render_distance = GameManager.render_distance_chunks
	terrain_generator = TerrainGenerator.new(GameManager.current_seed)
	load_world_modifications()

func _process(_delta: float) -> void:
	_process_player_streaming()
	_process_chunk_queues()

func set_player(p_player: Node3D) -> void:
	player = p_player
	_check_player_chunk_change(true)

func _process_player_streaming() -> void:
	if player == null:
		return
	_check_player_chunk_change(false)

func ensure_chunk_immediate(coord: Vector2i) -> VoxelChunk:
	if chunks.has(coord):
		var ch = chunks[coord]
		if not ch.is_generated:
			terrain_generator.generate_chunk_data(ch)
			_apply_modifications_to_chunk(ch)
			ch.rebuild_mesh()
		return ch

	var ch: VoxelChunk = VoxelChunk.new()
	ch.chunk_coord = coord
	ch.position = Vector3(coord.x * VoxelChunk.CHUNK_SIZE_X, 0, coord.y * VoxelChunk.CHUNK_SIZE_Z)
	add_child(ch)
	chunks[coord] = ch

	terrain_generator.generate_chunk_data(ch)
	_apply_modifications_to_chunk(ch)
	ch.rebuild_mesh()
	chunk_loaded.emit(coord)
	return ch

func _check_player_chunk_change(force: bool) -> void:
	if player == null:
		return

	var px: int = int(floor(player.global_position.x / float(VoxelChunk.CHUNK_SIZE_X)))
	var pz: int = int(floor(player.global_position.z / float(VoxelChunk.CHUNK_SIZE_Z)))
	var new_chunk_coord = Vector2i(px, pz)

	if force or new_chunk_coord != current_player_chunk:
		current_player_chunk = new_chunk_coord
		_update_active_chunks()

func _update_active_chunks() -> void:
	var needed_coords: Dictionary = {}

	# Collect all coordinates within render distance
	for dz in range(-render_distance, render_distance + 1):
		for dx in range(-render_distance, render_distance + 1):
			if dx * dx + dz * dz <= (render_distance * render_distance) + 1:
				var coord = Vector2i(current_player_chunk.x + dx, current_player_chunk.y + dz)
				needed_coords[coord] = true
				if not chunks.has(coord) and not chunk_generate_queue.has(coord):
					chunk_generate_queue.append(coord)

	# Unload distant chunks
	var to_remove: Array[Vector2i] = []
	for coord in chunks:
		var dx: int = coord.x - current_player_chunk.x
		var dz: int = coord.y - current_player_chunk.y
		if dx * dx + dz * dz > (render_distance + 2) * (render_distance + 2):
			to_remove.append(coord)

	for c in to_remove:
		var ch: VoxelChunk = chunks[c]
		chunks.erase(c)
		ch.queue_free()

func _process_chunk_queues() -> void:
	# 1. Generate chunk data (1 per frame)
	if not chunk_generate_queue.is_empty():
		var coord = chunk_generate_queue.pop_front()
		if not chunks.has(coord):
			var ch: VoxelChunk = VoxelChunk.new()
			ch.chunk_coord = coord
			ch.position = Vector3(coord.x * VoxelChunk.CHUNK_SIZE_X, 0, coord.y * VoxelChunk.CHUNK_SIZE_Z)
			add_child(ch)
			chunks[coord] = ch

			terrain_generator.generate_chunk_data(ch)
			_apply_modifications_to_chunk(ch)
			chunk_mesh_queue.append(ch)

	# 2. Build mesh for generated chunks (time-sliced)
	var meshed_this_frame: int = 0
	while not chunk_mesh_queue.is_empty() and meshed_this_frame < CHUNKS_MESHED_PER_FRAME:
		var ch: VoxelChunk = chunk_mesh_queue.pop_front()
		if is_instance_valid(ch):
			ch.rebuild_mesh()
			chunk_loaded.emit(ch.chunk_coord)
			meshed_this_frame += 1

func _apply_modifications_to_chunk(chunk: VoxelChunk) -> void:
	var min_wx: int = chunk.chunk_coord.x * VoxelChunk.CHUNK_SIZE_X
	var max_wx: int = min_wx + VoxelChunk.CHUNK_SIZE_X
	var min_wz: int = chunk.chunk_coord.y * VoxelChunk.CHUNK_SIZE_Z
	var max_wz: int = min_wz + VoxelChunk.CHUNK_SIZE_Z

	for pos in modified_blocks:
		if pos.x >= min_wx and pos.x < max_wx and pos.z >= min_wz and pos.z < max_wz:
			var lx: int = pos.x - min_wx
			var lz: int = pos.z - min_wz
			var ly: int = pos.y
			chunk.set_voxel(lx, ly, lz, modified_blocks[pos])

func get_voxel_at(world_pos: Vector3i) -> int:
	var cx: int = int(floor(float(world_pos.x) / float(VoxelChunk.CHUNK_SIZE_X)))
	var cz: int = int(floor(float(world_pos.z) / float(VoxelChunk.CHUNK_SIZE_Z)))
	var coord = Vector2i(cx, cz)

	if chunks.has(coord):
		var ch: VoxelChunk = chunks[coord]
		var lx: int = world_pos.x - (cx * VoxelChunk.CHUNK_SIZE_X)
		var lz: int = world_pos.z - (cz * VoxelChunk.CHUNK_SIZE_Z)
		return ch.get_voxel(lx, world_pos.y, lz)
	
	if modified_blocks.has(world_pos):
		return modified_blocks[world_pos]

	return BlockRegistry.BlockID.AIR

func set_voxel_at(world_pos: Vector3i, block_id: int) -> void:
	modified_blocks[world_pos] = block_id

	var cx: int = int(floor(float(world_pos.x) / float(VoxelChunk.CHUNK_SIZE_X)))
	var cz: int = int(floor(float(world_pos.z) / float(VoxelChunk.CHUNK_SIZE_Z)))
	var coord = Vector2i(cx, cz)

	if chunks.has(coord):
		var ch: VoxelChunk = chunks[coord]
		var lx: int = world_pos.x - (cx * VoxelChunk.CHUNK_SIZE_X)
		var lz: int = world_pos.z - (cz * VoxelChunk.CHUNK_SIZE_Z)
		ch.set_voxel(lx, world_pos.y, lz, block_id)
		ch.rebuild_mesh()

		# Rebuild neighbor chunk if edit was on chunk border
		if lx == 0:
			_rebuild_neighbor(Vector2i(cx - 1, cz))
		elif lx == VoxelChunk.CHUNK_SIZE_X - 1:
			_rebuild_neighbor(Vector2i(cx + 1, cz))
		if lz == 0:
			_rebuild_neighbor(Vector2i(cx, cz - 1))
		elif lz == VoxelChunk.CHUNK_SIZE_Z - 1:
			_rebuild_neighbor(Vector2i(cx, cz + 1))

	block_modified.emit(world_pos, block_id)

func _rebuild_neighbor(coord: Vector2i) -> void:
	if chunks.has(coord):
		chunks[coord].rebuild_mesh()

func get_highest_block_y(world_x: int, world_z: int) -> int:
	for y in range(VoxelChunk.CHUNK_SIZE_Y - 1, 0, -1):
		var id: int = get_voxel_at(Vector3i(world_x, y, world_z))
		if id != BlockRegistry.BlockID.AIR and id != BlockRegistry.BlockID.WATER:
			return y
	return 25

# --- Persistence ---

var loaded_player_data: Dictionary = {}

func save_world_modifications() -> void:
	var save_dir: String = "user://saves/" + GameManager.current_world_name
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(save_dir))

	var file_path: String = save_dir + "/world_data.json"
	var data: Dictionary = {
		"version": 2,
		"seed": GameManager.current_seed,
		"time": GameManager.world_time_hours,
		"weather": GameManager.current_weather,
		"game_mode": GameManager.current_game_mode,
		"modifications": []
	}

	if player and player is PlayerController:
		data["player"] = {
			"x": player.global_position.x,
			"y": player.global_position.y,
			"z": player.global_position.z,
			"health": player.survival_stats.health,
			"hunger": player.survival_stats.hunger,
			"stamina": player.survival_stats.stamina,
			"temp": player.survival_stats.body_temperature,
			"inventory": player.inventory.serialize()
		}

	for pos in modified_blocks:
		data["modifications"].append({
			"x": pos.x,
			"y": pos.y,
			"z": pos.z,
			"id": modified_blocks[pos]
		})

	var f: FileAccess = FileAccess.open(file_path, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data, "  "))
		f.close()
		print("[TajikCraft] World saved successfully: ", file_path)

func load_world_modifications() -> void:
	var file_path: String = "user://saves/" + GameManager.current_world_name + "/world_data.json"
	if not FileAccess.file_exists(file_path):
		return

	var f: FileAccess = FileAccess.open(file_path, FileAccess.READ)
	if f:
		var content: String = f.get_as_text()
		f.close()
		var json = JSON.new()
		if json.parse(content) == OK and json.data is Dictionary:
			var data: Dictionary = json.data
			if data.has("seed"):
				GameManager.current_seed = data["seed"]
			if data.has("time"):
				GameManager.world_time_hours = data["time"]
			if data.has("weather"):
				GameManager.current_weather = data["weather"]
			if data.has("player"):
				loaded_player_data = data["player"]
			if data.has("modifications"):
				for m in data["modifications"]:
					var pos = Vector3i(m["x"], m["y"], m["z"])
					modified_blocks[pos] = m["id"]
			print("[TajikCraft] World loaded successfully from: ", file_path)

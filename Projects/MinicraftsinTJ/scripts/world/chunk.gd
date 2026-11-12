class_name VoxelChunk
extends StaticBody3D

const CHUNK_SIZE_X: int = 16
const CHUNK_SIZE_Z: int = 16
const CHUNK_SIZE_Y: int = 96
const TOTAL_VOXELS: int = CHUNK_SIZE_X * CHUNK_SIZE_Z * CHUNK_SIZE_Y # 24,576

# Texture Atlas UV metrics (16x16 tiles in 256x256 image)
const ATLAS_TILES: float = 16.0
const UV_STEP: float = 1.0 / ATLAS_TILES

var chunk_coord: Vector2i = Vector2i.ZERO
var voxels: PackedByteArray = PackedByteArray()
var is_dirty: bool = false
var is_generated: bool = false

var mesh_instance: MeshInstance3D = MeshInstance3D.new()
var collision_shape: CollisionShape3D = CollisionShape3D.new()

static var chunk_material: StandardMaterial3D = null

func _init() -> void:
	voxels.resize(TOTAL_VOXELS)
	voxels.fill(0) # Air
	add_child(mesh_instance)
	add_child(collision_shape)
	_ensure_material()

func _ready() -> void:
	pass

func _ensure_material() -> void:
	if chunk_material == null:
		chunk_material = StandardMaterial3D.new()
		chunk_material.albedo_texture = TextureGenerator.get_atlas_texture()
		chunk_material.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST_WITH_MIPMAPS
		chunk_material.roughness = 0.95
		chunk_material.metallic_specular = 0.05
		chunk_material.cull_mode = BaseMaterial3D.CULL_BACK
		chunk_material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA_DEPTH_PRE_PASS
	mesh_instance.material_override = chunk_material

# Flat index calculation: x + z * 16 + y * 256
static func get_voxel_index(x: int, y: int, z: int) -> int:
	return x + (z * CHUNK_SIZE_X) + (y * CHUNK_SIZE_X * CHUNK_SIZE_Z)

func get_voxel(x: int, y: int, z: int) -> int:
	if x < 0 or x >= CHUNK_SIZE_X or y < 0 or y >= CHUNK_SIZE_Y or z < 0 or z >= CHUNK_SIZE_Z:
		return 0 # Air out of bounds
	return voxels[get_voxel_index(x, y, z)]

func set_voxel(x: int, y: int, z: int, block_id: int) -> void:
	if x < 0 or x >= CHUNK_SIZE_X or y < 0 or y >= CHUNK_SIZE_Y or z < 0 or z >= CHUNK_SIZE_Z:
		return
	voxels[get_voxel_index(x, y, z)] = block_id
	is_dirty = true

# Face Directions: Normal, UV offsets, and Lighting multipliers
const FACE_DIRECTIONS = [
	Vector3i(0, 1, 0),  # TOP
	Vector3i(0, -1, 0), # BOTTOM
	Vector3i(0, 0, 1),  # SOUTH
	Vector3i(0, 0, -1), # NORTH
	Vector3i(1, 0, 0),  # EAST
	Vector3i(-1, 0, 0)  # WEST
]

const FACE_LIGHT = [
	1.0,  # Top: Full direct sunlight
	0.55, # Bottom: Shadow
	0.82, # South
	0.75, # North
	0.88, # East
	0.80  # West
]

# Generate chunk visual mesh and physics collision
func rebuild_mesh() -> void:
	var vertices: PackedVector3Array = PackedVector3Array()
	var normals: PackedVector3Array = PackedVector3Array()
	var uvs: PackedVector2Array = PackedVector2Array()
	var colors: PackedColorArray = PackedColorArray()
	var indices: PackedInt32Array = PackedInt32Array()

	var vertex_offset: int = 0

	for y in range(CHUNK_SIZE_Y):
		for z in range(CHUNK_SIZE_Z):
			for x in range(CHUNK_SIZE_X):
				var block_id: int = voxels[get_voxel_index(x, y, z)]
				if block_id == BlockRegistry.BlockID.AIR:
					continue

				var is_plant: bool = BlockRegistry.is_plant(block_id)
				if is_plant:
					_append_plant_quads(x, y, z, block_id, vertices, normals, uvs, colors, indices, vertex_offset)
					vertex_offset = vertices.size()
					continue

				var is_water: bool = (block_id == BlockRegistry.BlockID.WATER)
				var block_info = BlockRegistry.get_block(block_id)

				# Check each of the 6 faces
				for f in range(6):
					var dir: Vector3i = FACE_DIRECTIONS[f]
					var nx: int = x + dir.x
					var ny: int = y + dir.y
					var nz: int = z + dir.z

					var neighbor_id: int = get_voxel(nx, ny, nz)
					var neighbor_transparent: bool = (neighbor_id == BlockRegistry.BlockID.AIR) or BlockRegistry.is_transparent(neighbor_id)
					
					# Don't draw internal water faces between adjacent water blocks
					if is_water and neighbor_id == BlockRegistry.BlockID.WATER:
						continue

					if neighbor_transparent and (neighbor_id != block_id or is_water == false):
						var tile_idx: int = block_info["atlas_side"]
						if f == 0:
							tile_idx = block_info["atlas_top"]
						elif f == 1:
							tile_idx = block_info["atlas_bottom"]

						var light: float = FACE_LIGHT[f]
						var col: Color = Color(light, light, light, 1.0)
						if is_water:
							col = Color(0.2, 0.65, 0.85, 0.75) * light

						_append_face(f, x, y, z, tile_idx, col, vertices, normals, uvs, colors, indices, vertex_offset)
						vertex_offset += 4

	if vertices.is_empty():
		mesh_instance.mesh = ArrayMesh.new()
		collision_shape.shape = null
		is_dirty = false
		return

	var arrays: Array = []
	arrays.resize(Mesh.ARRAY_MAX)
	arrays[Mesh.ARRAY_VERTEX] = vertices
	arrays[Mesh.ARRAY_NORMAL] = normals
	arrays[Mesh.ARRAY_TEX_UV] = uvs
	arrays[Mesh.ARRAY_COLOR] = colors
	arrays[Mesh.ARRAY_INDEX] = indices

	var array_mesh: ArrayMesh = ArrayMesh.new()
	array_mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arrays)
	mesh_instance.mesh = array_mesh

	# Physics collision trimesh shape
	var shape: ConcavePolygonShape3D = array_mesh.create_trimesh_shape()
	collision_shape.shape = shape
	is_dirty = false

func _append_face(f: int, x: int, y: int, z: int, tile_idx: int, col: Color,
		verts: PackedVector3Array, norms: PackedVector3Array, uvs: PackedVector2Array,
		colors: PackedColorArray, indices: PackedInt32Array, offset: int) -> void:

	# UV rect on the atlas
	var tx: int = tile_idx % int(ATLAS_TILES)
	var ty: int = tile_idx / int(ATLAS_TILES)
	var u0: float = float(tx) * UV_STEP
	var v0: float = float(ty) * UV_STEP
	var u1: float = u0 + UV_STEP
	var v1: float = v0 + UV_STEP

	var p = Vector3(x, y, z)
	var norm = Vector3(FACE_DIRECTIONS[f])

	# 4 vertices per face
	match f:
		0: # TOP (+Y)
			verts.append(p + Vector3(0, 1, 1))
			verts.append(p + Vector3(1, 1, 1))
			verts.append(p + Vector3(1, 1, 0))
			verts.append(p + Vector3(0, 1, 0))
		1: # BOTTOM (-Y)
			verts.append(p + Vector3(0, 0, 0))
			verts.append(p + Vector3(1, 0, 0))
			verts.append(p + Vector3(1, 0, 1))
			verts.append(p + Vector3(0, 0, 1))
		2: # SOUTH (+Z)
			verts.append(p + Vector3(0, 0, 1))
			verts.append(p + Vector3(1, 0, 1))
			verts.append(p + Vector3(1, 1, 1))
			verts.append(p + Vector3(0, 1, 1))
		3: # NORTH (-Z)
			verts.append(p + Vector3(1, 0, 0))
			verts.append(p + Vector3(0, 0, 0))
			verts.append(p + Vector3(0, 1, 0))
			verts.append(p + Vector3(1, 1, 0))
		4: # EAST (+X)
			verts.append(p + Vector3(1, 0, 1))
			verts.append(p + Vector3(1, 0, 0))
			verts.append(p + Vector3(1, 1, 0))
			verts.append(p + Vector3(1, 1, 1))
		5: # WEST (-X)
			verts.append(p + Vector3(0, 0, 0))
			verts.append(p + Vector3(0, 0, 1))
			verts.append(p + Vector3(0, 1, 1))
			verts.append(p + Vector3(0, 1, 0))

	# Normals, UVs, Colors
	for i in range(4):
		norms.append(norm)
		colors.append(col)

	uvs.append(Vector2(u0, v1))
	uvs.append(Vector2(u1, v1))
	uvs.append(Vector2(u1, v0))
	uvs.append(Vector2(u0, v0))

	# Two triangles: 0,1,2 and 0,2,3
	indices.append(offset + 0)
	indices.append(offset + 1)
	indices.append(offset + 2)
	indices.append(offset + 0)
	indices.append(offset + 2)
	indices.append(offset + 3)

func _append_plant_quads(x: int, y: int, z: int, block_id: int,
		verts: PackedVector3Array, norms: PackedVector3Array, uvs: PackedVector2Array,
		colors: PackedColorArray, indices: PackedInt32Array, offset: int) -> void:

	var block_info = BlockRegistry.get_block(block_id)
	var tile_idx: int = block_info["atlas_side"]
	var tx: int = tile_idx % int(ATLAS_TILES)
	var ty: int = tile_idx / int(ATLAS_TILES)
	var u0: float = float(tx) * UV_STEP
	var v0: float = float(ty) * UV_STEP
	var u1: float = u0 + UV_STEP
	var v1: float = v0 + UV_STEP

	var p = Vector3(x, y, z)
	var col = Color(1, 1, 1, 1)

	# Diagonal 1
	verts.append(p + Vector3(0, 0, 0))
	verts.append(p + Vector3(1, 0, 1))
	verts.append(p + Vector3(1, 1, 1))
	verts.append(p + Vector3(0, 1, 0))
	# Diagonal 2
	verts.append(p + Vector3(0, 0, 1))
	verts.append(p + Vector3(1, 0, 0))
	verts.append(p + Vector3(1, 1, 0))
	verts.append(p + Vector3(0, 1, 1))

	var n1 = Vector3(1, 0, -1).normalized()
	var n2 = Vector3(1, 0, 1).normalized()
	for i in range(4):
		norms.append(n1)
		colors.append(col)
	for i in range(4):
		norms.append(n2)
		colors.append(col)

	# UVs for both diagonals
	for d in range(2):
		uvs.append(Vector2(u0, v1))
		uvs.append(Vector2(u1, v1))
		uvs.append(Vector2(u1, v0))
		uvs.append(Vector2(u0, v0))

	# Indices
	indices.append(offset + 0)
	indices.append(offset + 1)
	indices.append(offset + 2)
	indices.append(offset + 0)
	indices.append(offset + 2)
	indices.append(offset + 3)

	indices.append(offset + 4)
	indices.append(offset + 5)
	indices.append(offset + 6)
	indices.append(offset + 4)
	indices.append(offset + 6)
	indices.append(offset + 7)

class_name LandmarkRegistry
extends RefCounted

# Landmark definitions provide procedural or voxel-blueprint structure templates
# that can be embedded into the terrain during chunk generation.

enum LandmarkType {
	HISOR_FORTRESS = 0,
	PAMIRI_CHORXONA = 1,
	PANJAKENT_RUINS = 2,
	MOUNTAIN_CAMP = 3,
	TRADITIONAL_VILLAGE_HOUSE = 4,
	GORGE_BRIDGE = 5
}

static var landmarks: Dictionary = {}

static func _static_init() -> void:
	_register_all()

static func _register_all() -> void:
	landmarks.clear()
	
	landmarks[LandmarkType.HISOR_FORTRESS] = {
		"id": LandmarkType.HISOR_FORTRESS,
		"name": "Hisor Fortress (Қалъаи Ҳисор)",
		"size_x": 14,
		"size_y": 10,
		"size_z": 8,
		"target_biome": BiomeRegistry.BiomeID.HISSAR_VALLEY,
		"frequency": 0.0008,
		"description": "Historical 18th-century fortress gate with twin cylindrical bastions and arched brick portal."
	}

	landmarks[LandmarkType.PAMIRI_CHORXONA] = {
		"id": LandmarkType.PAMIRI_CHORXONA,
		"name": "Traditional Pamiri House (Чорхона)",
		"size_x": 9,
		"size_y": 6,
		"size_z": 9,
		"target_biome": BiomeRegistry.BiomeID.PAMIR_MOUNTAINS,
		"frequency": 0.0012,
		"description": "Sacred 5-pillar Pamiri stone-and-timber dwelling with traditional skylight roof."
	}

	landmarks[LandmarkType.PANJAKENT_RUINS] = {
		"id": LandmarkType.PANJAKENT_RUINS,
		"name": "Ancient Panjakent (Панҷакенти Қадим)",
		"size_x": 12,
		"size_y": 5,
		"size_z": 12,
		"target_biome": BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY,
		"frequency": 0.0007,
		"description": "Ancient Sogdian ruins with weathered adobe walls, columns and stone artifacts."
	}

	landmarks[LandmarkType.MOUNTAIN_CAMP] = {
		"id": LandmarkType.MOUNTAIN_CAMP,
		"name": "High Mountain Pasture Camp",
		"size_x": 7,
		"size_y": 4,
		"size_z": 7,
		"target_biome": BiomeRegistry.BiomeID.ALPINE_MEADOWS,
		"frequency": 0.0015,
		"description": "Shepherd's summer stone shelter with tandoor oven, wooden fence and yurt foundation."
	}

	landmarks[LandmarkType.TRADITIONAL_VILLAGE_HOUSE] = {
		"id": LandmarkType.TRADITIONAL_VILLAGE_HOUSE,
		"name": "Tajik Village Homestead (Ҳавлии деҳотӣ)",
		"size_x": 8,
		"size_y": 5,
		"size_z": 8,
		"target_biome": BiomeRegistry.BiomeID.ZERAVSHAN_VALLEY,
		"frequency": 0.0014,
		"description": "Rural village home with wooden carved pillars, flat clay roof, and tandoor courtyard."
	}

# Generates voxel deltas: Array of { "rel_x": int, "rel_y": int, "rel_z": int, "block_id": int }
static func build_landmark_voxels(type: int) -> Array[Dictionary]:
	var voxels: Array[Dictionary] = []
	match type:
		LandmarkType.PAMIRI_CHORXONA:
			# 9x9 floor, 4 stone walls, 5 central pillars, elevated roof with skylight
			for x in range(9):
				for z in range(9):
					# Foundation / Stone Floor
					voxels.append({"rel_x": x, "rel_y": 0, "rel_z": z, "block_id": BlockRegistry.BlockID.SLATE})
					# Outer Walls
					for y in range(1, 4):
						if x == 0 or x == 8 or z == 0 or z == 8:
							# Doorway at z==0, x in [4]
							if z == 0 and x == 4 and y < 3:
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.AIR})
							# Window at z==8, x==4
							elif z == 8 and x == 4 and y == 2:
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.GLASS})
							else:
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.PAMIR_GRANITE})
						else:
							voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.AIR})
					# Roof
					if (x in [0,1,7,8] or z in [0,1,7,8]):
						voxels.append({"rel_x": x, "rel_y": 4, "rel_z": z, "block_id": BlockRegistry.BlockID.WOOD_PLANKS})
					elif (x in [2,6] or z in [2,6]):
						voxels.append({"rel_x": x, "rel_y": 5, "rel_z": z, "block_id": BlockRegistry.BlockID.WOOD_PLANKS})
					else:
						# Skylight (Rushan Window / Chorkhona opening)
						voxels.append({"rel_x": x, "rel_y": 5, "rel_z": z, "block_id": BlockRegistry.BlockID.GLASS})

			# The 5 Sacred Pamiri Pillars (Sutun)
			var pillar_coords = [
				Vector2i(2, 2), # Pillar 1: Surush / Earth
				Vector2i(6, 2), # Pillar 2: Mehr / Sun
				Vector2i(2, 6), # Pillar 3: Zamyod / Water
				Vector2i(6, 6), # Pillar 4: Ozar / Fire
				Vector2i(4, 4)  # Pillar 5: Daena / Pillar of Light
			]
			for p in pillar_coords:
				for y in range(1, 4):
					voxels.append({"rel_x": p.x, "rel_y": y, "rel_z": p.y, "block_id": BlockRegistry.BlockID.CHORXONA_PILLAR})
			
			# Suzani Rug and Sanduq (Chest) in the room
			voxels.append({"rel_x": 3, "rel_y": 1, "rel_z": 4, "block_id": BlockRegistry.BlockID.TAJIK_CARPET_BLOCK})
			voxels.append({"rel_x": 4, "rel_y": 1, "rel_z": 3, "block_id": BlockRegistry.BlockID.TAJIK_CARPET_BLOCK})
			voxels.append({"rel_x": 5, "rel_y": 1, "rel_z": 4, "block_id": BlockRegistry.BlockID.TAJIK_CARPET_BLOCK})
			voxels.append({"rel_x": 1, "rel_y": 1, "rel_z": 7, "block_id": BlockRegistry.BlockID.CHEST})
			voxels.append({"rel_x": 7, "rel_y": 1, "rel_z": 7, "block_id": BlockRegistry.BlockID.TANDOOR_OVEN})

		LandmarkType.HISOR_FORTRESS:
			# Twin bastions (towers) at Left (x 0..3) and Right (x 10..13) with central arch (x 4..9)
			for x in range(14):
				for z in range(6):
					var is_left_tower: bool = (x <= 3 and z <= 3)
					var is_right_tower: bool = (x >= 10 and z <= 3)
					var is_arch_wall: bool = (z == 2 and x > 3 and x < 10)
					
					for y in range(0, 8):
						if is_left_tower or is_right_tower:
							if y == 0:
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.COBBLESTONE})
							elif y < 7:
								# Hollow tower
								if (x == 0 or x == 3 or x == 10 or x == 13 or z == 0 or z == 3):
									voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.CLAY_BRICK})
							else:
								# Tower battlements
								if (x + z) % 2 == 0:
									voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.CLAY_BRICK})
						elif is_arch_wall:
							if y >= 4:
								# Wall over arch
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.CLAY_BRICK})
							elif y == 3 and (x == 4 or x == 9):
								# Arch curve shoulders
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.CLAY_BRICK})

		LandmarkType.MOUNTAIN_CAMP:
			# Campfire / Tandoor, fence, chest, bed
			for x in range(7):
				for z in range(7):
					voxels.append({"rel_x": x, "rel_y": 0, "rel_z": z, "block_id": BlockRegistry.BlockID.COBBLESTONE})
					if x == 0 or x == 6 or z == 0 or z == 6:
						if not (z == 0 and x == 3): # Gate opening
							voxels.append({"rel_x": x, "rel_y": 1, "rel_z": z, "block_id": BlockRegistry.BlockID.WOODEN_FENCE})
			voxels.append({"rel_x": 3, "rel_y": 1, "rel_z": 3, "block_id": BlockRegistry.BlockID.TANDOOR_OVEN})
			voxels.append({"rel_x": 1, "rel_y": 1, "rel_z": 5, "block_id": BlockRegistry.BlockID.BED})
			voxels.append({"rel_x": 2, "rel_y": 1, "rel_z": 5, "block_id": BlockRegistry.BlockID.CHEST})
			voxels.append({"rel_x": 5, "rel_y": 1, "rel_z": 5, "block_id": BlockRegistry.BlockID.CRAFTING_TABLE})

		LandmarkType.PANJAKENT_RUINS:
			# Ancient Sogdian temple courtyard with mudbrick pakhsa walls and columns
			for x in range(10):
				for z in range(10):
					voxels.append({"rel_x": x, "rel_y": 0, "rel_z": z, "block_id": BlockRegistry.BlockID.RED_SANDSTONE})
					if x == 0 or x == 9 or z == 0 or z == 9:
						var wall_h: int = 3 if ((x + z) % 3 != 0) else 2 # Weathered ruined edges
						for y in range(1, wall_h + 1):
							if not (z == 0 and x in [4, 5]):
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.MUDBRICK_PAKHSA})
			# Sogdian inner pillars and turquoise mosaic altar
			for px in [3, 6]:
				for pz in [3, 6]:
					for y in range(1, 4):
						voxels.append({"rel_x": px, "rel_y": y, "rel_z": pz, "block_id": BlockRegistry.BlockID.CARVED_WOOD_PANEL})
			voxels.append({"rel_x": 4, "rel_y": 1, "rel_z": 5, "block_id": BlockRegistry.BlockID.DECORATIVE_TILE})
			voxels.append({"rel_x": 5, "rel_y": 1, "rel_z": 5, "block_id": BlockRegistry.BlockID.CHEST})

		LandmarkType.TRADITIONAL_VILLAGE_HOUSE:
			# Tajik homestead with front Aiwan (veranda), carved pillars, clay tile roof, and tandoor
			for x in range(8):
				for z in range(8):
					voxels.append({"rel_x": x, "rel_y": 0, "rel_z": z, "block_id": BlockRegistry.BlockID.COBBLESTONE})
					if z >= 2: # Enclosed main house
						for y in range(1, 4):
							if x == 0 or x == 7 or z == 2 or z == 7:
								if z == 2 and x == 3 and y < 3:
									voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.AIR})
								elif (x == 0 or x == 7) and z == 5 and y == 2:
									voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.GLASS})
								else:
									voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.MUDBRICK_PAKHSA})
					# Flat clay-tiled roof extending over Aiwan veranda
					voxels.append({"rel_x": x, "rel_y": 4, "rel_z": z, "block_id": BlockRegistry.BlockID.ROOF_CLAY_TILE})
			# Aiwan carved porch pillars
			for px in [0, 3, 7]:
				for y in range(1, 4):
					voxels.append({"rel_x": px, "rel_y": y, "rel_z": 0, "block_id": BlockRegistry.BlockID.CHORXONA_PILLAR})
			voxels.append({"rel_x": 4, "rel_y": 1, "rel_z": 5, "block_id": BlockRegistry.BlockID.TAJIK_CARPET_BLOCK})
			voxels.append({"rel_x": 6, "rel_y": 1, "rel_z": 6, "block_id": BlockRegistry.BlockID.BED})
			voxels.append({"rel_x": 1, "rel_y": 1, "rel_z": 6, "block_id": BlockRegistry.BlockID.CRAFTING_TABLE})
			voxels.append({"rel_x": 6, "rel_y": 1, "rel_z": 1, "block_id": BlockRegistry.BlockID.TANDOOR_OVEN})

		LandmarkType.GORGE_BRIDGE:
			# Wooden suspension/beam bridge across river
			for x in range(12):
				for z in range(3):
					voxels.append({"rel_x": x, "rel_y": 0, "rel_z": z, "block_id": BlockRegistry.BlockID.WOOD_PLANKS})
					if z == 0 or z == 2:
						voxels.append({"rel_x": x, "rel_y": 1, "rel_z": z, "block_id": BlockRegistry.BlockID.WOODEN_FENCE})

		_:
			# Default small stone-and-timber Tajik shelter
			for x in range(6):
				for z in range(6):
					voxels.append({"rel_x": x, "rel_y": 0, "rel_z": z, "block_id": BlockRegistry.BlockID.COBBLESTONE})
					for y in range(1, 4):
						if (x == 0 or x == 5 or z == 0 or z == 5):
							if not (z == 0 and x == 2 and y < 3):
								voxels.append({"rel_x": x, "rel_y": y, "rel_z": z, "block_id": BlockRegistry.BlockID.CLAY_BRICK})
					voxels.append({"rel_x": x, "rel_y": 4, "rel_z": z, "block_id": BlockRegistry.BlockID.WOOD_PLANKS})
			voxels.append({"rel_x": 4, "rel_y": 1, "rel_z": 4, "block_id": BlockRegistry.BlockID.TANDOOR_OVEN})

	return voxels


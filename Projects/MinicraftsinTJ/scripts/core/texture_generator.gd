class_name TextureGenerator
extends RefCounted

const TILE_SIZE: int = 16
const ATLAS_TILES_PER_ROW: int = 16
const ATLAS_SIZE: int = TILE_SIZE * ATLAS_TILES_PER_ROW # 256x256 (256 total tiles: 0..255)

static func create_atlas_image() -> Image:
	var img: Image = Image.create(ATLAS_SIZE, ATLAS_SIZE, false, Image.FORMAT_RGBA8)
	img.fill(Color(0, 0, 0, 0))

	var rng: RandomNumberGenerator = RandomNumberGenerator.new()
	rng.seed = 1337

	# --- TILES 0..55: Core Terrain, Ores, Flora, Architecture ---
	_draw_grass_top(img, 0, rng)
	_draw_dirt(img, 1, rng)
	_draw_grass_side(img, 2, rng)
	_draw_stone(img, 3, rng)
	_draw_snow(img, 4, rng)
	_draw_ice(img, 5, rng)
	_draw_water(img, 6, rng)
	_draw_sand(img, 7, rng)
	_draw_gravel(img, 8, rng)
	_draw_clay(img, 9, rng)
	_draw_cobblestone(img, 10, rng)
	_draw_wood_top(img, 11, Color(0.48, 0.35, 0.22), rng) # Juniper top
	_draw_wood_side(img, 12, Color(0.42, 0.28, 0.18), rng) # Juniper side
	_draw_wood_top(img, 13, Color(0.65, 0.60, 0.50), rng) # Poplar top
	_draw_wood_side(img, 14, Color(0.60, 0.55, 0.45), rng) # Poplar side
	_draw_wood_top(img, 15, Color(0.40, 0.26, 0.16), rng) # Walnut top
	_draw_wood_side(img, 16, Color(0.35, 0.22, 0.12), rng) # Walnut side
	_draw_planks(img, 17, Color(0.72, 0.55, 0.35), rng)
	_draw_leaves(img, 18, Color(0.22, 0.45, 0.25), rng) # Juniper
	_draw_leaves(img, 19, Color(0.42, 0.68, 0.22), rng) # Poplar
	_draw_leaves(img, 20, Color(0.32, 0.58, 0.20), rng) # Walnut
	_draw_leaves(img, 21, Color(0.48, 0.72, 0.28), rng, true, Color(1.0, 0.65, 0.1)) # Apricot
	_draw_granite(img, 22, rng)
	_draw_limestone(img, 23, rng)
	_draw_slate(img, 24, rng)
	_draw_river_stone(img, 25, rng)
	_draw_red_sandstone(img, 26, rng)
	_draw_loess(img, 27, rng)
	_draw_ore(img, 28, Color(0.12, 0.12, 0.12), rng) # Coal
	_draw_ore(img, 29, Color(0.78, 0.52, 0.38), rng) # Iron
	_draw_ore(img, 30, Color(0.40, 0.75, 0.60), rng) # Copper
	_draw_ore(img, 31, Color(0.95, 0.85, 0.20), rng) # Gold
	_draw_ore(img, 32, Color(0.15, 0.35, 0.85), rng) # Badakhshan Lapis
	_draw_ore(img, 33, Color(0.90, 0.15, 0.30), rng) # Pamir Ruby
	_draw_brick(img, 34, rng)
	_draw_carved_wood(img, 35, rng)
	_draw_suzani_carpet(img, 36, rng)
	_draw_tandoor_top(img, 37, rng)
	_draw_tandoor_side(img, 38, rng)
	_draw_glass(img, 39, rng)
	_draw_door(img, 40, rng)
	_draw_fence(img, 41, rng)
	_draw_roof_tile(img, 42, rng)
	_draw_pillar(img, 43, rng)
	_draw_chest_top(img, 44, rng)
	_draw_chest_side(img, 45, rng)
	_draw_crafting_top(img, 46, rng)
	_draw_crafting_side(img, 47, rng)
	_draw_tulip(img, 48, rng)
	_draw_artemisia(img, 49, rng)
	_draw_alpine_flowers(img, 50, rng)
	_draw_wheat(img, 51, rng)
	_draw_cotton(img, 52, rng)
	_draw_melon(img, 53, rng)
	_draw_bed(img, 54, rng)
	_draw_torch(img, 55, rng)

	# --- TILES 56..67: Additional Tajik Trees, Flora & Masonry ---
	_draw_leaves(img, 56, Color(0.35, 0.65, 0.22), rng, true, Color(0.92, 0.15, 0.15)) # Apple leaves
	_draw_leaves(img, 57, Color(0.30, 0.58, 0.24), rng, true, Color(0.55, 0.15, 0.45)) # Mulberry leaves
	_draw_wood_side(img, 58, Color(0.45, 0.40, 0.30), rng) # Willow bark
	_draw_willow_leaves(img, 59, rng) # Drooping willow foliage
	_draw_decorative_tile(img, 60, rng) # Samarkand/Istaravshan turquoise tile
	_draw_farmland(img, 61, rng) # Tilled soil
	_draw_medicinal_herbs(img, 62, rng) # Mountain herbs
	_draw_mudbrick_pakhsa(img, 63, rng) # Panjakent adobe wall
	_draw_stairs_planks(img, 64, rng) # Wooden step texture
	_draw_snow_grass_side(img, 65, rng) # Alpine snow-dusted grass

	# --- TILES 68..123: Pixel-Art Item, Tool, Food & Cultural Icons ---
	_draw_pickaxe(img, 68, Color(0.68, 0.48, 0.28)) # Wood pickaxe
	_draw_pickaxe(img, 69, Color(0.58, 0.58, 0.62)) # Stone pickaxe
	_draw_pickaxe(img, 70, Color(0.85, 0.88, 0.92)) # Iron pickaxe
	_draw_axe(img, 71, Color(0.68, 0.48, 0.28)) # Wood axe
	_draw_axe(img, 72, Color(0.58, 0.58, 0.62)) # Stone axe
	_draw_axe(img, 73, Color(0.85, 0.88, 0.92)) # Iron axe
	_draw_shovel(img, 74, Color(0.68, 0.48, 0.28)) # Wood shovel
	_draw_shovel(img, 75, Color(0.58, 0.58, 0.62)) # Stone shovel
	_draw_shovel(img, 76, Color(0.85, 0.88, 0.92)) # Iron shovel
	_draw_hoe(img, 77, Color(0.68, 0.48, 0.28)) # Wood hoe
	_draw_hoe(img, 78, Color(0.85, 0.88, 0.92)) # Iron hoe
	_draw_sword(img, 79, Color(0.68, 0.48, 0.28)) # Wood sword
	_draw_sword(img, 80, Color(0.58, 0.58, 0.62)) # Stone sword
	_draw_sword(img, 81, Color(0.85, 0.88, 0.92)) # Iron sword
	_draw_kord_dagger(img, 82) # Pamir Steel Kord Dagger
	_draw_stick(img, 83) # Stick
	_draw_gem_or_lump(img, 84, Color(0.15, 0.15, 0.18)) # Coal
	_draw_ingot(img, 85, Color(0.82, 0.85, 0.88)) # Iron ingot
	_draw_ingot(img, 86, Color(0.82, 0.48, 0.30)) # Copper ingot
	_draw_ingot(img, 87, Color(0.98, 0.84, 0.20)) # Gold bar
	_draw_gem_or_lump(img, 88, Color(0.15, 0.38, 0.92)) # Lapis gem
	_draw_gem_or_lump(img, 89, Color(0.92, 0.12, 0.28)) # Pamir Ruby
	_draw_gem_or_lump(img, 90, Color(0.68, 0.64, 0.66)) # Clay ball
	_draw_ingot(img, 91, Color(0.74, 0.40, 0.26)) # Fired brick
	_draw_cotton_item(img, 92) # Raw cotton
	_draw_fabric_item(img, 93, Color(0.94, 0.92, 0.88)) # Cotton fabric
	_draw_fabric_item(img, 94, Color(0.88, 0.85, 0.80)) # Sheep wool
	_draw_leather_item(img, 95) # Cured leather
	_draw_seeds(img, 96, Color(0.75, 0.68, 0.35)) # Wheat seeds
	_draw_wheat_item(img, 97) # Harvested wheat
	_draw_seeds(img, 98, Color(0.35, 0.32, 0.28)) # Cotton seeds
	_draw_seeds(img, 99, Color(0.25, 0.22, 0.18)) # Melon seeds
	_draw_non_bread(img, 100) # Non bread!
	_draw_fatir_bread(img, 101) # Crispy Fatir
	_draw_sambusa(img, 102) # Sambusa triangle pastry
	_draw_oshi_palov(img, 103) # Oshi Palov bowl
	_draw_qurutob(img, 104) # Qurutob wooden dish
	_draw_qurut_balls(img, 105) # Dried Qurut balls
	_draw_apricots(img, 106) # Dried apricots
	_draw_walnuts(img, 107) # Walnuts
	_draw_grapes(img, 108) # Grapes
	_draw_melon_slice(img, 109) # Melon slice
	_draw_meat(img, 110, Color(0.78, 0.22, 0.22)) # Raw meat
	_draw_meat(img, 111, Color(0.55, 0.28, 0.15)) # Cooked meat / Shashlik
	_draw_bowl(img, 112, Color(0.95, 0.95, 0.98)) # Milk bowl
	_draw_piyala_tea(img, 113) # Kok-Chai green tea
	_draw_toki_cap(img, 114) # Traditional Toki skullcap
	_draw_chapan_coat(img, 115) # Warm quilted Chapan coat
	_draw_jurab_socks(img, 116) # Pamiri Jurab wool socks
	_draw_dutar(img, 117) # Tajik Dutar lute
	_draw_rubab(img, 118) # Pamiri Rubab
	_draw_chaynik(img, 119) # Ceramic Chaynik teapot
	_draw_fishing_rod(img, 120) # Fishing rod
	_draw_fish(img, 121, Color(0.45, 0.65, 0.78)) # Raw Trout
	_draw_fish(img, 122, Color(0.75, 0.45, 0.22)) # Cooked Trout
	_draw_egg(img, 123) # Fresh egg
	_draw_apple_item(img, 124) # Red Apple
	_draw_mulberry_item(img, 125) # Mulberries

	# --- TILES 128..140: Animal Coat & Skin Textures ---
	_draw_animal_coat(img, 128, Color(0.88, 0.85, 0.78), Color(0.78, 0.72, 0.65), rng, false) # Marco Polo sheep wool
	_draw_snow_leopard_pelt(img, 129, rng) # Snow Leopard spotted coat
	_draw_animal_coat(img, 130, Color(0.62, 0.52, 0.42), Color(0.48, 0.40, 0.32), rng, false) # Siberian Ibex
	_draw_animal_coat(img, 131, Color(0.22, 0.16, 0.12), Color(0.14, 0.10, 0.08), rng, true) # Pamir Yak shaggy coat
	_draw_animal_coat(img, 132, Color(0.42, 0.26, 0.14), Color(0.32, 0.18, 0.10), rng, true) # Himalayan Brown Bear
	_draw_animal_coat(img, 133, Color(0.58, 0.60, 0.65), Color(0.42, 0.44, 0.48), rng, false) # Mountain Wolf
	_draw_animal_coat(img, 134, Color(0.88, 0.40, 0.15), Color(0.95, 0.90, 0.82), rng, false) # Red Fox
	_draw_animal_coat(img, 135, Color(0.35, 0.22, 0.12), Color(0.85, 0.65, 0.20), rng, false) # Golden Eagle plumage
	_draw_cow_spotted(img, 136, rng) # Domestic Cow
	_draw_animal_coat(img, 137, Color(0.55, 0.30, 0.15), Color(0.38, 0.20, 0.10), rng, false) # Horse chestnut
	_draw_animal_coat(img, 138, Color(0.82, 0.76, 0.65), Color(0.25, 0.22, 0.20), rng, false) # Alabay Shepherd Dog
	_draw_animal_coat(img, 139, Color(0.96, 0.95, 0.92), Color(0.85, 0.80, 0.72), rng, false) # Chicken feathers
	_draw_horn_ridged(img, 140, rng) # Curled ridged horn texture

	return img

static func get_atlas_texture() -> Texture2D:
	var path: String = "res://assets/textures/block_atlas.png"
	if ResourceLoader.exists(path):
		var tex: Texture2D = load(path)
		if tex:
			return tex

	var img: Image = create_atlas_image()
	var global_dir: String = ProjectSettings.globalize_path("res://assets/textures")
	DirAccess.make_dir_recursive_absolute(global_dir)
	img.save_png(path)
	return ImageTexture.create_from_image(img)

static func get_tile_atlas_texture(tile_idx: int) -> AtlasTexture:
	var atlas_tex := AtlasTexture.new()
	atlas_tex.atlas = get_atlas_texture()
	var tx: int = (tile_idx % ATLAS_TILES_PER_ROW) * TILE_SIZE
	var ty: int = (tile_idx / ATLAS_TILES_PER_ROW) * TILE_SIZE
	atlas_tex.region = Rect2(tx, ty, TILE_SIZE, TILE_SIZE)
	return atlas_tex

# --- Drawing helper routines ---

static func _tile_origin(tile_idx: int) -> Vector2i:
	var tx: int = (tile_idx % ATLAS_TILES_PER_ROW) * TILE_SIZE
	var ty: int = (tile_idx / ATLAS_TILES_PER_ROW) * TILE_SIZE
	return Vector2i(tx, ty)

static func _set_pixel(img: Image, tile_idx: int, lx: int, ly: int, col: Color) -> void:
	if lx < 0 or lx >= 16 or ly < 0 or ly >= 16:
		return
	var orig: Vector2i = _tile_origin(tile_idx)
	img.set_pixel(orig.x + lx, orig.y + ly, col)

static func _fill_rect(img: Image, idx: int, x0: int, y0: int, w: int, h: int, col: Color) -> void:
	for x in range(x0, x0 + w):
		for y in range(y0, y0 + h):
			_set_pixel(img, idx, x, y, col)

static func _draw_grass_top(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.34, 0.65, 0.22)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_dirt(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.48, 0.32, 0.18)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.darkened(rng.randf_range(-0.1, 0.1)))

static func _draw_grass_side(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var grass: Color = Color(0.34, 0.65, 0.22)
	var dirt: Color = Color(0.48, 0.32, 0.18)
	for x in range(16):
		var grass_depth: int = 3 + (x % 3)
		for y in range(16):
			if y < grass_depth:
				_set_pixel(img, idx, x, y, grass.lightened(rng.randf_range(-0.06, 0.06)))
			else:
				_set_pixel(img, idx, x, y, dirt.darkened(rng.randf_range(-0.08, 0.08)))

static func _draw_snow_grass_side(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var snow: Color = Color(0.95, 0.97, 1.0)
	var dirt: Color = Color(0.48, 0.32, 0.18)
	for x in range(16):
		var snow_depth: int = 4 + (x % 3)
		for y in range(16):
			if y < snow_depth:
				_set_pixel(img, idx, x, y, snow.darkened(rng.randf_range(-0.03, 0.04)))
			else:
				_set_pixel(img, idx, x, y, dirt.darkened(rng.randf_range(-0.08, 0.08)))

static func _draw_stone(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.55, 0.55, 0.58)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.12, 0.12)))

static func _draw_snow(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.95, 0.97, 1.0)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.darkened(rng.randf_range(-0.03, 0.03)))

static func _draw_ice(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.68, 0.86, 0.98, 0.9)
	for x in range(16):
		for y in range(16):
			var streak: float = 0.1 if (x + y) % 7 == 0 else 0.0
			_set_pixel(img, idx, x, y, base.lightened(streak + rng.randf_range(-0.04, 0.06)))

static func _draw_water(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.15, 0.58, 0.82, 0.82)
	for x in range(16):
		for y in range(16):
			var wave: float = sin((x + y) * 0.8) * 0.1
			_set_pixel(img, idx, x, y, base.lightened(wave))

static func _draw_sand(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.86, 0.78, 0.55)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.06, 0.06)))

static func _draw_gravel(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.6, 0.58, 0.55)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.darkened(rng.randf_range(-0.15, 0.15)))

static func _draw_clay(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.68, 0.64, 0.65)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_cobblestone(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.48, 0.48, 0.50)
	for x in range(16):
		for y in range(16):
			var is_border: bool = (x % 5 == 0 or y % 4 == 0)
			if is_border:
				_set_pixel(img, idx, x, y, Color(0.28, 0.28, 0.30))
			else:
				_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.1, 0.1)))

static func _draw_wood_top(img: Image, idx: int, base: Color, _rng: RandomNumberGenerator) -> void:
	for x in range(16):
		for y in range(16):
			var dist: float = Vector2(x - 7.5, y - 7.5).length()
			var ring: float = sin(dist * 1.5) * 0.15
			_set_pixel(img, idx, x, y, base.darkened(ring))

static func _draw_wood_side(img: Image, idx: int, base: Color, rng: RandomNumberGenerator) -> void:
	for x in range(16):
		for y in range(16):
			var stripe: float = sin(x * 1.2) * 0.12
			_set_pixel(img, idx, x, y, base.darkened(stripe + rng.randf_range(-0.05, 0.05)))

static func _draw_planks(img: Image, idx: int, base: Color, rng: RandomNumberGenerator) -> void:
	for x in range(16):
		for y in range(16):
			if y % 4 == 0:
				_set_pixel(img, idx, x, y, Color(0.35, 0.25, 0.15))
			else:
				_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_leaves(img: Image, idx: int, base: Color, rng: RandomNumberGenerator, with_fruit: bool = false, fruit_col: Color = Color(1, 0.6, 0.1)) -> void:
	for x in range(16):
		for y in range(16):
			if with_fruit and rng.randf() < 0.06:
				_set_pixel(img, idx, x, y, fruit_col)
			elif rng.randf() < 0.15:
				_set_pixel(img, idx, x, y, base.darkened(0.2))
			else:
				_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.1, 0.1)))

static func _draw_willow_leaves(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.38, 0.65, 0.28)
	for x in range(16):
		for y in range(16):
			if x % 2 == 0 or y < 8:
				_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.08, 0.1)))
			else:
				_set_pixel(img, idx, x, y, base.darkened(0.15))

static func _draw_granite(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.78, 0.60, 0.60)
	for x in range(16):
		for y in range(16):
			var r: float = rng.randf()
			if r < 0.1:
				_set_pixel(img, idx, x, y, Color(0.9, 0.85, 0.85))
			elif r < 0.2:
				_set_pixel(img, idx, x, y, Color(0.2, 0.15, 0.15))
			else:
				_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_limestone(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.82, 0.82, 0.78)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_slate(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.28, 0.30, 0.32)
	for x in range(16):
		for y in range(16):
			var layer: float = -0.1 if (y % 3 == 0) else 0.05
			_set_pixel(img, idx, x, y, base.lightened(layer + rng.randf_range(-0.04, 0.04)))

static func _draw_river_stone(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.50, 0.56, 0.58)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.12, 0.12)))

static func _draw_red_sandstone(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.78, 0.45, 0.32)
	for x in range(16):
		for y in range(16):
			var strat: float = sin(y * 1.5) * 0.1
			_set_pixel(img, idx, x, y, base.lightened(strat + rng.randf_range(-0.05, 0.05)))

static func _draw_loess(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.68, 0.58, 0.42)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.06, 0.06)))

static func _draw_ore(img: Image, idx: int, gem_col: Color, rng: RandomNumberGenerator) -> void:
	var stone: Color = Color(0.55, 0.55, 0.58)
	for x in range(16):
		for y in range(16):
			var is_gem: bool = (x in [4,5,6, 10,11,12] and y in [3,4, 9,10,11]) and rng.randf() < 0.72
			if is_gem:
				_set_pixel(img, idx, x, y, gem_col.lightened(rng.randf_range(-0.1, 0.15)))
			else:
				_set_pixel(img, idx, x, y, stone.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_brick(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var mortar: Color = Color(0.45, 0.40, 0.35)
	var brick: Color = Color(0.72, 0.42, 0.28)
	for x in range(16):
		for y in range(16):
			var row: int = y / 4
			var offset: int = (row % 2) * 4
			if y % 4 == 0 or (x + offset) % 8 == 0:
				_set_pixel(img, idx, x, y, mortar)
			else:
				_set_pixel(img, idx, x, y, brick.lightened(rng.randf_range(-0.06, 0.06)))

static func _draw_carved_wood(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.55, 0.38, 0.22)
	var carved: Color = Color(0.35, 0.24, 0.12)
	for x in range(16):
		for y in range(16):
			var dx: int = abs(x - 7)
			var dy: int = abs(y - 7)
			if (dx + dy == 4) or (dx + dy == 6) or (dx == 0 and dy < 6) or (dy == 0 and dx < 6):
				_set_pixel(img, idx, x, y, carved)
			else:
				_set_pixel(img, idx, x, y, base.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_suzani_carpet(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var red: Color = Color(0.78, 0.15, 0.18)
	var gold: Color = Color(0.95, 0.80, 0.20)
	var blue: Color = Color(0.15, 0.45, 0.75)
	var white: Color = Color(0.95, 0.95, 0.90)
	for x in range(16):
		for y in range(16):
			var dist: float = Vector2(x - 7.5, y - 7.5).length()
			if dist < 2.5:
				_set_pixel(img, idx, x, y, gold)
			elif dist < 4.5:
				_set_pixel(img, idx, x, y, blue)
			elif dist < 6.0:
				_set_pixel(img, idx, x, y, white)
			elif x == 0 or x == 15 or y == 0 or y == 15:
				_set_pixel(img, idx, x, y, gold)
			else:
				_set_pixel(img, idx, x, y, red.lightened(rng.randf_range(-0.04, 0.04)))

static func _draw_decorative_tile(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var turquoise: Color = Color(0.10, 0.72, 0.78)
	var cobalt: Color = Color(0.12, 0.28, 0.68)
	var gold: Color = Color(0.95, 0.82, 0.25)
	var white: Color = Color(0.95, 0.98, 1.0)
	for x in range(16):
		for y in range(16):
			var dx: int = abs(x - 7)
			var dy: int = abs(y - 7)
			if x == 0 or x == 15 or y == 0 or y == 15:
				_set_pixel(img, idx, x, y, cobalt)
			elif dx + dy <= 3:
				_set_pixel(img, idx, x, y, gold)
			elif dx == dy or dx == 0 or dy == 0:
				_set_pixel(img, idx, x, y, white)
			else:
				_set_pixel(img, idx, x, y, turquoise)

static func _draw_farmland(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var moist: Color = Color(0.32, 0.20, 0.10)
	var ridge: Color = Color(0.42, 0.28, 0.14)
	for x in range(16):
		for y in range(16):
			var c = moist if (y % 4 < 2) else ridge
			_set_pixel(img, idx, x, y, c.lightened(rng.randf_range(-0.04, 0.04)))

static func _draw_medicinal_herbs(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var leaf: Color = Color(0.25, 0.58, 0.35)
	var blossom: Color = Color(0.95, 0.88, 0.25)
	for x in range(16):
		for y in range(16):
			if (x in [4,5,7,8,10,11] and y >= 5) and rng.randf() < 0.65:
				_set_pixel(img, idx, x, y, blossom if y < 8 and rng.randf() < 0.35 else leaf)

static func _draw_mudbrick_pakhsa(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var base: Color = Color(0.75, 0.62, 0.45)
	for x in range(16):
		for y in range(16):
			var line: float = -0.12 if y % 5 == 0 else 0.04
			_set_pixel(img, idx, x, y, base.lightened(line + rng.randf_range(-0.05, 0.05)))

static func _draw_stairs_planks(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	_draw_planks(img, idx, Color(0.65, 0.48, 0.30), rng)
	_fill_rect(img, idx, 0, 7, 16, 2, Color(0.28, 0.18, 0.10))

static func _draw_tandoor_top(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var clay: Color = Color(0.68, 0.48, 0.35)
	for x in range(16):
		for y in range(16):
			var dist: float = Vector2(x - 7.5, y - 7.5).length()
			if dist < 4.0:
				_set_pixel(img, idx, x, y, Color(0.08, 0.06, 0.05))
			elif dist < 5.0:
				_set_pixel(img, idx, x, y, Color(0.85, 0.35, 0.1))
			else:
				_set_pixel(img, idx, x, y, clay.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_tandoor_side(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var clay: Color = Color(0.68, 0.48, 0.35)
	for x in range(16):
		for y in range(16):
			var band: float = -0.1 if (y % 4 == 0) else 0.05
			_set_pixel(img, idx, x, y, clay.lightened(band + rng.randf_range(-0.04, 0.04)))

static func _draw_glass(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var pane: Color = Color(0.85, 0.95, 1.0, 0.35)
	var frame: Color = Color(0.4, 0.3, 0.2, 0.9)
	for x in range(16):
		for y in range(16):
			if x == 0 or x == 15 or y == 0 or y == 15 or x == 7 or y == 7:
				_set_pixel(img, idx, x, y, frame)
			elif x == y and x in [2, 3, 11, 12]:
				_set_pixel(img, idx, x, y, Color(1, 1, 1, 0.8))
			else:
				_set_pixel(img, idx, x, y, pane)

static func _draw_door(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.60, 0.42, 0.25)
	for x in range(16):
		for y in range(16):
			if x in [1, 14] or y in [0, 15]:
				_set_pixel(img, idx, x, y, Color(0.35, 0.25, 0.15))
			elif x == 3 and y == 8:
				_set_pixel(img, idx, x, y, Color(0.8, 0.7, 0.2))
			else:
				_set_pixel(img, idx, x, y, wood.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_fence(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.65, 0.48, 0.30)
	for x in range(16):
		for y in range(16):
			if (x in [3, 4, 11, 12]) or (y in [4, 5, 10, 11]):
				_set_pixel(img, idx, x, y, wood)

static func _draw_roof_tile(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var tile: Color = Color(0.62, 0.35, 0.24)
	for x in range(16):
		for y in range(16):
			var wave: float = sin(x * 1.5) * 0.1
			var row_shadow: float = -0.15 if (y % 4 == 0) else 0.05
			_set_pixel(img, idx, x, y, tile.lightened(wave + row_shadow))

static func _draw_pillar(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.52, 0.36, 0.20)
	for x in range(16):
		for y in range(16):
			if y in [0, 1, 14, 15]:
				_set_pixel(img, idx, x, y, wood.lightened(0.1))
			else:
				var flute: float = -0.12 if (x % 3 == 0) else 0.06
				_set_pixel(img, idx, x, y, wood.lightened(flute))

static func _draw_chest_top(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.50, 0.32, 0.18)
	for x in range(16):
		for y in range(16):
			if x in [0, 15] or y in [0, 15]:
				_set_pixel(img, idx, x, y, Color(0.7, 0.55, 0.2))
			else:
				_set_pixel(img, idx, x, y, wood.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_chest_side(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.50, 0.32, 0.18)
	for x in range(16):
		for y in range(16):
			if x in [0, 15] or y in [0, 15]:
				_set_pixel(img, idx, x, y, Color(0.7, 0.55, 0.2))
			elif x in [7, 8] and y in [6, 7, 8]:
				_set_pixel(img, idx, x, y, Color(0.9, 0.8, 0.3))
			else:
				_set_pixel(img, idx, x, y, wood.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_crafting_top(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.68, 0.50, 0.32)
	for x in range(16):
		for y in range(16):
			if x % 5 == 0 or y % 5 == 0:
				_set_pixel(img, idx, x, y, Color(0.35, 0.25, 0.15))
			else:
				_set_pixel(img, idx, x, y, wood.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_crafting_side(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.68, 0.50, 0.32)
	for x in range(16):
		for y in range(16):
			if (x == 5 and y in [3,4,5,6,7,8]) or (y == 3 and x in [4,5,6]):
				_set_pixel(img, idx, x, y, Color(0.2, 0.2, 0.2))
			else:
				_set_pixel(img, idx, x, y, wood.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_tulip(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var red: Color = Color(0.92, 0.15, 0.18)
	var stem: Color = Color(0.28, 0.55, 0.20)
	for x in range(16):
		for y in range(16):
			if x == 7 and y >= 6:
				_set_pixel(img, idx, x, y, stem)
			elif (x in [6,7,8] and y in [3,4,5]) or (x in [5,9] and y in [2,3]):
				_set_pixel(img, idx, x, y, red)

static func _draw_artemisia(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var sage: Color = Color(0.48, 0.65, 0.52)
	for x in range(16):
		for y in range(16):
			if (x in [6,7,8,9] and y >= 4) and rng.randf() < 0.65:
				_set_pixel(img, idx, x, y, sage.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_alpine_flowers(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var purple: Color = Color(0.68, 0.35, 0.88)
	var stem: Color = Color(0.3, 0.6, 0.25)
	for x in range(16):
		for y in range(16):
			if (x in [5,10] and y >= 7):
				_set_pixel(img, idx, x, y, stem)
			elif (x in [4,5,6] and y in [5,6,7]) or (x in [9,10,11] and y in [4,5,6]):
				_set_pixel(img, idx, x, y, purple)

static func _draw_wheat(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var gold: Color = Color(0.85, 0.75, 0.32)
	for x in range(16):
		for y in range(16):
			if (x in [6,7,8] and y >= 2):
				_set_pixel(img, idx, x, y, gold.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_cotton(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var green: Color = Color(0.35, 0.55, 0.25)
	var white: Color = Color(0.96, 0.96, 0.92)
	for x in range(16):
		for y in range(16):
			if (x == 7 and y >= 5):
				_set_pixel(img, idx, x, y, green)
			elif (x in [5,6,7,8,9] and y in [2,3,4,5]):
				_set_pixel(img, idx, x, y, white)

static func _draw_melon(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var green1: Color = Color(0.35, 0.60, 0.22)
	var green2: Color = Color(0.55, 0.78, 0.32)
	for x in range(16):
		for y in range(16):
			_set_pixel(img, idx, x, y, green1 if (x % 4 < 2) else green2)

static func _draw_bed(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var quilt: Color = Color(0.75, 0.22, 0.28)
	var pillow: Color = Color(0.95, 0.92, 0.85)
	for x in range(16):
		for y in range(16):
			if y < 4:
				_set_pixel(img, idx, x, y, pillow)
			else:
				_set_pixel(img, idx, x, y, quilt.lightened(rng.randf_range(-0.05, 0.05)))

static func _draw_torch(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var wood: Color = Color(0.45, 0.32, 0.18)
	var flame: Color = Color(1.0, 0.85, 0.2)
	for x in range(16):
		for y in range(16):
			if x in [7, 8] and y >= 6:
				_set_pixel(img, idx, x, y, wood)
			elif x in [6, 7, 8, 9] and y in [2, 3, 4, 5]:
				_set_pixel(img, idx, x, y, flame)

# --- ITEM & TOOL PIXEL ART ROUTINES ---

static func _draw_stick(img: Image, idx: int) -> void:
	var wood: Color = Color(0.55, 0.38, 0.22)
	for i in range(3, 13):
		_set_pixel(img, idx, i, 15 - i, wood)
		_set_pixel(img, idx, i + 1, 15 - i, wood.darkened(0.2))

static func _draw_pickaxe(img: Image, idx: int, head_col: Color) -> void:
	_draw_stick(img, idx)
	for x in range(4, 13):
		_set_pixel(img, idx, x, 2, head_col)
		_set_pixel(img, idx, x, 3, head_col.darkened(0.15))
	_set_pixel(img, idx, 12, 4, head_col)
	_set_pixel(img, idx, 12, 5, head_col)
	_set_pixel(img, idx, 3, 4, head_col)

static func _draw_axe(img: Image, idx: int, head_col: Color) -> void:
	_draw_stick(img, idx)
	_fill_rect(img, idx, 8, 2, 5, 5, head_col)
	_set_pixel(img, idx, 12, 7, head_col.darkened(0.2))

static func _draw_shovel(img: Image, idx: int, head_col: Color) -> void:
	_draw_stick(img, idx)
	_fill_rect(img, idx, 10, 2, 4, 4, head_col)

static func _draw_hoe(img: Image, idx: int, head_col: Color) -> void:
	_draw_stick(img, idx)
	_fill_rect(img, idx, 7, 2, 6, 2, head_col)
	_set_pixel(img, idx, 7, 4, head_col)

static func _draw_sword(img: Image, idx: int, blade_col: Color) -> void:
	var hilt: Color = Color(0.55, 0.35, 0.15)
	_set_pixel(img, idx, 2, 13, hilt)
	_set_pixel(img, idx, 3, 12, hilt)
	_set_pixel(img, idx, 4, 10, hilt)
	_set_pixel(img, idx, 5, 11, hilt)
	for i in range(5, 14):
		_set_pixel(img, idx, i, 15 - i, blade_col)
		_set_pixel(img, idx, i - 1, 15 - i, blade_col.lightened(0.2))

static func _draw_kord_dagger(img: Image, idx: int) -> void:
	var ruby: Color = Color(0.9, 0.1, 0.25)
	var steel: Color = Color(0.85, 0.90, 0.95)
	_set_pixel(img, idx, 3, 12, ruby)
	_set_pixel(img, idx, 4, 11, Color(0.2, 0.2, 0.2))
	for i in range(5, 13):
		_set_pixel(img, idx, i, 15 - i, steel)
		_set_pixel(img, idx, i, 14 - i, steel.lightened(0.15))

static func _draw_gem_or_lump(img: Image, idx: int, col: Color) -> void:
	_fill_rect(img, idx, 5, 4, 6, 8, col)
	_fill_rect(img, idx, 4, 6, 8, 4, col)
	_fill_rect(img, idx, 6, 5, 2, 2, col.lightened(0.35))

static func _draw_ingot(img: Image, idx: int, col: Color) -> void:
	_fill_rect(img, idx, 3, 6, 10, 5, col)
	_fill_rect(img, idx, 4, 5, 8, 1, col.lightened(0.25))
	_fill_rect(img, idx, 3, 10, 10, 1, col.darkened(0.25))

static func _draw_cotton_item(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 5, 4, 6, 6, Color(0.97, 0.97, 0.95))
	_fill_rect(img, idx, 4, 6, 8, 4, Color(0.92, 0.92, 0.90))
	_fill_rect(img, idx, 6, 10, 4, 3, Color(0.35, 0.55, 0.25))

static func _draw_fabric_item(img: Image, idx: int, col: Color) -> void:
	_fill_rect(img, idx, 3, 4, 10, 8, col)
	for y in range(4, 12, 2):
		_fill_rect(img, idx, 3, y, 10, 1, col.darkened(0.15))

static func _draw_leather_item(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 4, 3, 8, 10, Color(0.62, 0.38, 0.20))
	_fill_rect(img, idx, 3, 5, 10, 6, Color(0.58, 0.34, 0.18))

static func _draw_seeds(img: Image, idx: int, col: Color) -> void:
	_fill_rect(img, idx, 4, 6, 2, 3, col)
	_fill_rect(img, idx, 8, 4, 2, 3, col)
	_fill_rect(img, idx, 9, 9, 2, 3, col)
	_fill_rect(img, idx, 5, 10, 2, 2, col)

static func _draw_wheat_item(img: Image, idx: int) -> void:
	var gold: Color = Color(0.9, 0.78, 0.28)
	for i in range(3, 13):
		_set_pixel(img, idx, i, 15 - i, gold)
		_set_pixel(img, idx, i + 1, 14 - i, gold.darkened(0.1))

static func _draw_non_bread(img: Image, idx: int) -> void:
	var crust: Color = Color(0.85, 0.60, 0.28)
	var center: Color = Color(0.94, 0.78, 0.45)
	for x in range(16):
		for y in range(16):
			var d: float = Vector2(x - 7.5, y - 7.5).length()
			if d < 3.0:
				_set_pixel(img, idx, x, y, center if (x + y) % 2 == 0 else crust) # Chekich stamp pattern!
			elif d < 6.0:
				_set_pixel(img, idx, x, y, crust)

static func _draw_fatir_bread(img: Image, idx: int) -> void:
	var gold: Color = Color(0.92, 0.72, 0.30)
	for x in range(16):
		for y in range(16):
			var d: float = Vector2(x - 7.5, y - 7.5).length()
			if d < 5.5 and d > 1.5:
				_set_pixel(img, idx, x, y, gold.lightened(0.1 if (x % 2 == 0) else -0.1))

static func _draw_sambusa(img: Image, idx: int) -> void:
	var crust: Color = Color(0.88, 0.65, 0.28)
	for y in range(4, 13):
		var half_w: int = (y - 3) / 2
		_fill_rect(img, idx, 8 - half_w, y, half_w * 2 + 1, 1, crust)

static func _draw_oshi_palov(img: Image, idx: int) -> void:
	# Tajik blue bowl + saffron rice + carrot strips + meat
	_fill_rect(img, idx, 3, 9, 10, 4, Color(0.15, 0.42, 0.78))
	_fill_rect(img, idx, 4, 6, 8, 4, Color(0.95, 0.80, 0.30)) # Rice mound
	_set_pixel(img, idx, 6, 7, Color(0.95, 0.42, 0.10)) # Carrot
	_set_pixel(img, idx, 9, 6, Color(0.95, 0.42, 0.10))
	_fill_rect(img, idx, 7, 5, 2, 2, Color(0.52, 0.25, 0.12)) # Meat

static func _draw_qurutob(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 2, 8, 12, 5, Color(0.55, 0.32, 0.15)) # Wooden tabaq bowl
	_fill_rect(img, idx, 3, 6, 10, 3, Color(0.95, 0.95, 0.92)) # Yogurt sauce
	_set_pixel(img, idx, 5, 6, Color(0.2, 0.7, 0.2)) # Herbs
	_set_pixel(img, idx, 10, 7, Color(0.85, 0.2, 0.2)) # Tomato/onion

static func _draw_qurut_balls(img: Image, idx: int) -> void:
	var white: Color = Color(0.95, 0.95, 0.92)
	_fill_rect(img, idx, 4, 5, 3, 3, white)
	_fill_rect(img, idx, 9, 4, 3, 3, white)
	_fill_rect(img, idx, 6, 9, 3, 3, white)

static func _draw_apricots(img: Image, idx: int) -> void:
	var orange: Color = Color(0.95, 0.52, 0.12)
	_fill_rect(img, idx, 4, 5, 4, 4, orange)
	_fill_rect(img, idx, 8, 7, 4, 4, orange.darkened(0.1))

static func _draw_walnuts(img: Image, idx: int) -> void:
	var shell: Color = Color(0.58, 0.40, 0.22)
	_fill_rect(img, idx, 5, 5, 6, 6, shell)
	_fill_rect(img, idx, 7, 5, 2, 6, shell.darkened(0.2))

static func _draw_grapes(img: Image, idx: int) -> void:
	var grape: Color = Color(0.45, 0.78, 0.25)
	_fill_rect(img, idx, 5, 4, 6, 4, grape)
	_fill_rect(img, idx, 6, 8, 4, 3, grape)
	_fill_rect(img, idx, 7, 11, 2, 2, grape)

static func _draw_melon_slice(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 3, 10, 10, 2, Color(0.35, 0.65, 0.22)) # Rind
	_fill_rect(img, idx, 4, 7, 8, 3, Color(0.95, 0.85, 0.45)) # Sweet flesh

static func _draw_meat(img: Image, idx: int, col: Color) -> void:
	_fill_rect(img, idx, 4, 5, 8, 6, col)
	_fill_rect(img, idx, 5, 6, 3, 2, Color(0.95, 0.90, 0.88)) # Fat marbling

static func _draw_bowl(img: Image, idx: int, fill_col: Color) -> void:
	_fill_rect(img, idx, 3, 8, 10, 4, Color(0.55, 0.35, 0.18))
	_fill_rect(img, idx, 4, 7, 8, 2, fill_col)

static func _draw_piyala_tea(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 4, 7, 8, 5, Color(0.95, 0.98, 1.0))
	_fill_rect(img, idx, 4, 8, 8, 1, Color(0.15, 0.40, 0.80)) # Paxta pattern
	_fill_rect(img, idx, 5, 6, 6, 1, Color(0.45, 0.75, 0.30)) # Green tea

static func _draw_toki_cap(img: Image, idx: int) -> void:
	# Iconic black and white Tajik embroidered skullcap
	_fill_rect(img, idx, 3, 6, 10, 6, Color(0.10, 0.10, 0.12))
	_fill_rect(img, idx, 5, 4, 6, 2, Color(0.10, 0.10, 0.12))
	_set_pixel(img, idx, 6, 8, Color(0.95, 0.95, 0.95))
	_set_pixel(img, idx, 9, 8, Color(0.95, 0.95, 0.95))
	_set_pixel(img, idx, 7, 7, Color(0.95, 0.95, 0.95))

static func _draw_chapan_coat(img: Image, idx: int) -> void:
	# Striped traditional quilted Chapan robe
	for x in range(3, 13):
		var col = Color(0.18, 0.38, 0.65) if x % 2 == 0 else Color(0.85, 0.25, 0.25)
		_fill_rect(img, idx, x, 3, 1, 10, col)
	_fill_rect(img, idx, 7, 3, 2, 10, Color(0.9, 0.78, 0.25)) # Gold trim

static func _draw_jurab_socks(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 5, 3, 4, 9, Color(0.85, 0.22, 0.25))
	_fill_rect(img, idx, 5, 9, 7, 3, Color(0.95, 0.95, 0.95))
	_set_pixel(img, idx, 7, 6, Color(0.95, 0.82, 0.20))

static func _draw_dutar(img: Image, idx: int) -> void:
	var wood: Color = Color(0.65, 0.42, 0.20)
	_fill_rect(img, idx, 3, 9, 5, 5, wood) # Pear body
	for i in range(6, 14):
		_set_pixel(img, idx, i, 15 - i, wood.lightened(0.1)) # Long neck

static func _draw_rubab(img: Image, idx: int) -> void:
	var wood: Color = Color(0.50, 0.30, 0.15)
	_fill_rect(img, idx, 3, 8, 6, 6, wood)
	_fill_rect(img, idx, 4, 9, 4, 4, Color(0.90, 0.84, 0.72)) # Skin membrane
	for i in range(7, 14):
		_set_pixel(img, idx, i, 15 - i, wood)

static func _draw_chaynik(img: Image, idx: int) -> void:
	var ceramic: Color = Color(0.95, 0.96, 1.0)
	var cobalt: Color = Color(0.12, 0.35, 0.80)
	_fill_rect(img, idx, 5, 6, 6, 7, ceramic)
	_fill_rect(img, idx, 6, 8, 4, 3, cobalt) # Paxta Gul motif
	_fill_rect(img, idx, 3, 7, 2, 2, ceramic) # Spout
	_fill_rect(img, idx, 11, 7, 2, 4, ceramic) # Handle

static func _draw_fishing_rod(img: Image, idx: int) -> void:
	_draw_stick(img, idx)
	for y in range(3, 12):
		_set_pixel(img, idx, 13, y, Color(0.85, 0.92, 0.98))

static func _draw_fish(img: Image, idx: int, col: Color) -> void:
	_fill_rect(img, idx, 4, 6, 7, 4, col)
	_fill_rect(img, idx, 11, 5, 2, 6, col.darkened(0.2))
	_set_pixel(img, idx, 5, 7, Color(0.9, 0.2, 0.2)) # Trout spots

static func _draw_egg(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 6, 5, 4, 6, Color(0.96, 0.92, 0.85))
	_fill_rect(img, idx, 5, 7, 6, 3, Color(0.96, 0.92, 0.85))

static func _draw_apple_item(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 5, 5, 6, 6, Color(0.90, 0.15, 0.15))
	_set_pixel(img, idx, 8, 4, Color(0.3, 0.6, 0.2))

static func _draw_mulberry_item(img: Image, idx: int) -> void:
	_fill_rect(img, idx, 5, 4, 5, 7, Color(0.45, 0.12, 0.42))
	_fill_rect(img, idx, 8, 6, 4, 6, Color(0.92, 0.90, 0.85))

# --- ANIMAL COAT TEXTURES ---

static func _draw_animal_coat(img: Image, idx: int, base: Color, accent: Color, rng: RandomNumberGenerator, shaggy: bool) -> void:
	for x in range(16):
		for y in range(16):
			var col = accent if (shaggy and (x + y * 2) % 3 == 0) else base
			_set_pixel(img, idx, x, y, col.lightened(rng.randf_range(-0.08, 0.08)))

static func _draw_snow_leopard_pelt(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var fur: Color = Color(0.88, 0.88, 0.90)
	var rosette: Color = Color(0.28, 0.28, 0.32)
	for x in range(16):
		for y in range(16):
			var is_spot: bool = ((x % 5 == 2 or x % 5 == 3) and (y % 5 == 2 or y % 5 == 3))
			_set_pixel(img, idx, x, y, rosette if is_spot else fur.darkened(rng.randf_range(-0.05, 0.05)))

static func _draw_cow_spotted(img: Image, idx: int, rng: RandomNumberGenerator) -> void:
	var white: Color = Color(0.95, 0.95, 0.92)
	var spot: Color = Color(0.22, 0.18, 0.15)
	for x in range(16):
		for y in range(16):
			var is_patch: bool = (x < 7 and y < 7) or (x > 9 and y > 8)
			_set_pixel(img, idx, x, y, spot if is_patch else white.darkened(rng.randf_range(-0.03, 0.03)))

static func _draw_horn_ridged(img: Image, idx: int, _rng: RandomNumberGenerator) -> void:
	var horn: Color = Color(0.75, 0.68, 0.55)
	for x in range(16):
		for y in range(16):
			var ridge: float = -0.2 if x % 3 == 0 else 0.05
			_set_pixel(img, idx, x, y, horn.lightened(ridge))

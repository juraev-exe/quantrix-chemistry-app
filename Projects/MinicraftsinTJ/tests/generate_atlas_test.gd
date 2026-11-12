extends SceneTree

const TextureGenerator = preload("res://scripts/core/texture_generator.gd")

func _init() -> void:
	print("--- Running Texture Generator Test ---")
	var img: Image = TextureGenerator.create_atlas_image()
	print("Atlas generated with dimensions: ", img.get_width(), "x", img.get_height())
	var save_path: String = "res://assets/textures/block_atlas.png"
	var global_path: String = ProjectSettings.globalize_path(save_path)
	var err = img.save_png(global_path)
	if err == OK:
		print("Successfully saved block atlas to: ", global_path)
	else:
		printerr("Failed to save atlas, error code: ", err)
	quit()

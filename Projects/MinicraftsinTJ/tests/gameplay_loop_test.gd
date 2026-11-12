extends SceneTree

var frame_count: int = 0
var world_scene: Node = null

func _init() -> void:
	print("--- Testing Live Gameplay Loop & World Streaming ---")

func _process(delta: float) -> bool:
	frame_count += 1
	if frame_count == 1:
		var scene_res = load("res://scenes/world/world.tscn")
		world_scene = scene_res.instantiate()
		root.add_child(world_scene)
		print("World scene instantiated.")

	if frame_count >= 60:
		var world = GameManager.world_node
		var player = GameManager.player_node
		print("Evaluating world state at frame 60:")
		print("  Loaded Chunks: ", world.chunks.size())
		print("  Player Position: ", player.global_position)
		print("  Player Health: ", player.survival_stats.health)
		print("  Player Core Temp: ", player.survival_stats.body_temperature)
		print("  World Time: ", GameManager.world_time_hours)
		print("  Active Hotbar Item: ", player.inventory.get_active_item())
		
		if world.chunks.size() > 0 and player.survival_stats.health > 0:
			print("[SUCCESS] Live gameplay loop and procedural streaming verified!")
			quit(0)
		else:
			printerr("[FAILURE] Expected loaded chunks and healthy player.")
			quit(1)
	return false

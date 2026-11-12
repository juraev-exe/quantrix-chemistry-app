class_name GameplayTestRunner
extends Node

var frame_count: int = 0
var world_scene: Node = null

func _ready() -> void:
	print("--- Instantiating World Scene for Live Loop Test ---")
	var scene_res = load("res://scenes/world/world.tscn")
	world_scene = scene_res.instantiate()
	add_child(world_scene)

func _process(_delta: float) -> void:
	frame_count += 1
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
			print("\n[SUCCESS] Live gameplay loop and procedural streaming verified!")
			get_tree().quit(0)
		else:
			printerr("\n[FAILURE] Expected loaded chunks and healthy player.")
			get_tree().quit(1)


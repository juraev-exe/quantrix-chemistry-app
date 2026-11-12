class_name AudioManager
extends Node

# Procedural sound synthesis and music playback for TajikCraft

var sfx_player: AudioStreamPlayer
var ambient_player: AudioStreamPlayer
var music_player: AudioStreamPlayer

var sample_rate: float = 22050.0

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	sfx_player = AudioStreamPlayer.new()
	ambient_player = AudioStreamPlayer.new()
	music_player = AudioStreamPlayer.new()
	add_child(sfx_player)
	add_child(ambient_player)
	add_child(music_player)

	# Connect game manager signals
	GameManager.weather_changed.connect(_on_weather_changed)

func play_block_break(block_id: int) -> void:
	var freq: float = 180.0
	var dur: float = 0.12
	if block_id == BlockRegistry.BlockID.STONE or block_id == BlockRegistry.BlockID.PAMIR_GRANITE:
		freq = 140.0
	elif block_id == BlockRegistry.BlockID.SNOW:
		freq = 320.0
		dur = 0.08
	_play_noise_burst(freq, dur, 0.4)

func play_block_place(_block_id: int) -> void:
	_play_tone(160.0, 0.08, 0.35)

func play_footstep(surface_id: int) -> void:
	var freq: float = 120.0
	if surface_id == BlockRegistry.BlockID.SNOW:
		freq = 280.0
	elif surface_id == BlockRegistry.BlockID.WATER:
		freq = 200.0
	_play_noise_burst(freq, 0.05, 0.2)

func play_traditional_dutar_strum() -> void:
	# Plays an authentic acoustic Dutar note (Maqom scale: D, G, A, C)
	var notes = [293.66, 392.00, 440.00, 523.25, 587.33]
	var n = notes[randi() % notes.size()]
	_play_plucked_string(n, 0.65, 0.5)

# --- Procedural Waveform Synthesizers ---

func _play_tone(freq: float, duration: float, volume: float) -> void:
	var num_samples: int = int(sample_rate * duration)
	var stream: AudioStreamWAV = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = int(sample_rate)

	var data: PackedByteArray = PackedByteArray()
	data.resize(num_samples)

	for i in range(num_samples):
		var t: float = float(i) / sample_rate
		var envelope: float = 1.0 - (float(i) / float(num_samples))
		var wave: float = sin(t * freq * TAU) * envelope * volume
		var val: int = int(clamp((wave * 0.5 + 0.5) * 255.0, 0, 255))
		data[i] = val

	stream.data = data
	sfx_player.stream = stream
	sfx_player.play()

func _play_noise_burst(base_freq: float, duration: float, volume: float) -> void:
	var num_samples: int = int(sample_rate * duration)
	var stream: AudioStreamWAV = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = int(sample_rate)

	var data: PackedByteArray = PackedByteArray()
	data.resize(num_samples)

	for i in range(num_samples):
		var t: float = float(i) / sample_rate
		var envelope: float = exp(-float(i) / (num_samples * 0.3))
		var noise: float = (randf() * 2.0 - 1.0) * 0.7 + sin(t * base_freq * TAU) * 0.3
		var wave: float = noise * envelope * volume
		var val: int = int(clamp((wave * 0.5 + 0.5) * 255.0, 0, 255))
		data[i] = val

	stream.data = data
	sfx_player.stream = stream
	sfx_player.play()

func _play_plucked_string(freq: float, duration: float, volume: float) -> void:
	# Karplus-Strong / physical modeling string pluck
	var num_samples: int = int(sample_rate * duration)
	var stream: AudioStreamWAV = AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_8_BITS
	stream.mix_rate = int(sample_rate)

	var data: PackedByteArray = PackedByteArray()
	data.resize(num_samples)

	for i in range(num_samples):
		var t: float = float(i) / sample_rate
		var env: float = exp(-t * 4.5)
		# Fundamental + 2nd and 3rd harmonics typical of Central Asian lutes
		var harmonic1 = sin(t * freq * TAU) * 0.6
		var harmonic2 = sin(t * freq * 2.0 * TAU) * 0.3
		var harmonic3 = sin(t * freq * 3.0 * TAU) * 0.1
		var wave: float = (harmonic1 + harmonic2 + harmonic3) * env * volume
		var val: int = int(clamp((wave * 0.5 + 0.5) * 255.0, 0, 255))
		data[i] = val

	stream.data = data
	music_player.stream = stream
	music_player.play()

func _on_weather_changed(weather_name: String) -> void:
	print("[Audio] Weather changed to: ", weather_name)


class_name Loc
extends RefCounted

static var translations: Dictionary = {}
static var current_lang: String = "en"

static func _static_init() -> void:
	load_all()

static func load_all() -> void:
	translations["en"] = _load_json("res://localization/strings_en.json")
	translations["tg"] = _load_json("res://localization/strings_tg.json")
	translations["ru"] = _load_json("res://localization/strings_ru.json")

static func _load_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var f = FileAccess.open(path, FileAccess.READ)
	if f:
		var text = f.get_as_text()
		f.close()
		var json = JSON.new()
		if json.parse(text) == OK and json.data is Dictionary:
			return json.data
	return {}

static func t(key: String) -> String:
	if translations.is_empty():
		load_all()
	var lang_dict: Dictionary = translations.get(GameManager.language, translations.get("en", {}))
	return lang_dict.get(key, key)


# TAJIKCRAFT: LAND OF MOUNTAINS
### (ТоҷикКрафт: Сарзамини Кӯҳҳо)

A complete, playable 3D voxel sandbox survival game built in **Godot 4.3 Engine** with Tajikistan as its geographical, cultural, and environmental foundation.

---

## 🏔️ 1. Project Overview & Vision

**TajikCraft: Land of Mountains** is an open-world procedural survival game set in the dramatic landscapes of Tajikistan. From the towering glaciated peaks of the Pamir Mountains (the "Roof of the World") and turquoise alpine waters of the Fann Mountains to the fertile apricot orchards of the Zeravshan Valley and the ancient brick gates of the Hisor Fortress, TajikCraft celebrates the rich natural heritage and history of Tajikistan.

All textures, voxel models, game systems, and audio synthesizers in this project are original creations designed specifically for this title.

---

## 🎮 2. Quick Start & Execution

### Option A: Play in Your Web Browser (Instant Play)
1. Double-click **[`run_web.bat`](file:///c:/Users/JA/Documents/Projects_2026/Student_Projects/Projects/MinicraftsinTJ/run_web.bat)**, or navigate directly to:
   👉 **[http://localhost:8000](http://localhost:8000)**
2. Click **EXPLORE TAJIKISTAN (ОҒОЗ КАРДАН)** to capture pointer lock and play directly in full 3D inside your browser!

### Option B: Play Native Desktop Game (Godot 4.3)
1. Double-click **[`run_game.bat`](file:///c:/Users/JA/Documents/Projects_2026/Student_Projects/Projects/MinicraftsinTJ/run_game.bat)**
2. Or run via command line:
   ```powershell
   & "C:\Users\JA\godot\godot.exe" --path .
   ```

### Option C: Run Automated Verification Tests
Double-click **[`run_tests.bat`](file:///c:/Users/JA/Documents/Projects_2026/Student_Projects/Projects/MinicraftsinTJ/run_tests.bat)** (all 32 tests verified).

---

## ⌨️ 3. Controls & Gameplay

| Action | Key / Input | Description |
|---|---|---|
| **Move** | `W`, `A`, `S`, `D` / Arrows | Walk in 4 directions |
| **Look** | Mouse Motion | 360° first-person or third-person camera rotation |
| **Jump** | `Space` | Jump (consumes 12 stamina) |
| **Sprint** | `Shift` (Hold) | Sprint at 7.5 m/s (drains stamina and hunger) |
| **Crouch** | `Ctrl` / `C` | Crouch, lowers height and movement speed |
| **Swim** | `Space` in water | Surface swim / tread water |
| **Mine / Break** | `Left Click` (Hold) | Mine targeted block with tool/hand |
| **Place / Use** | `Right Click` | Place held block / eat food / interact |
| **Perspective** | `F5` | Toggle between 1st Person & 3rd Person camera |
| **Inventory & Craft** | `Tab` / `I` | Open 36-slot backpack and artisan crafting table |
| **Hotbar Slots** | `1` - `9` | Select active item/block from hotbar |
| **Pause Menu** | `Escape` | Pause game, access save game, settings, language |

---

## 🗺️ 4. The 8 Biomes of Tajikistan

TajikCraft procedurally generates 8 authentic biomes driven by layered `FastNoiseLite` simulation:

1. **Pamir Mountains (Помир)**:
   - *Elevation*: Extreme altitude ($Y = 55 - 90$).
   - *Terrain*: Permafrost, glaciated ice, slate layers, and pink Pamir granite.
   - *Wildlife*: Marco Polo sheep (*Arxar*), Pamir Yak, Snow Leopard (*Bars*), Golden Eagle.
   - *Survival*: Extreme sub-zero cold requires warm clothing (Quilted Chapan coat, Jurab wool socks) or campfire/tandoor heat to prevent hypothermia.
   - *Landmarks*: Traditional Pamiri *Chorxona* dwellings with the sacred 5 pillars and Rushan skylight roofs.

2. **Fann Mountains (Кӯҳҳои Фон)**:
   - *Elevation*: High alpine crags ($Y = 45 - 75$).
   - *Terrain*: Dramatic limestone needles, turquoise alpine glacial lakes (such as *Iskanderkul*), juniper (*archa*) forests.
   - *Wildlife*: Siberian ibex (*Naxchir*), Himalayan brown bear, mountain marmots.

3. **Zeravshan Valley (Водии Зарафшон)**:
   - *Elevation*: Mid-elevation river valley ($Y = 28 - 42$).
   - *Terrain*: Rich loamy soil, terraced stone walls, walnut and apricot fruit orchards.
   - *Resources*: Zeravshan river gold deposits, clay, timber.
   - *Landmarks*: Traditional village homesteads, ruins inspired by Ancient Panjakent.

4. **Hissar Valley (Водии Ҳисор)**:
   - *Elevation*: Green fertile agricultural basin ($Y = 24 - 36$).
   - *Terrain*: Rolling green pastures, wheat fields, poplar (*safeddor*) tree groves.
   - *Landmarks*: The iconic **Hisor Fortress** (*Ark-i Hisor*) with twin brick cylindrical bastions and arched gatehouse.

5. **Khatlon Lowlands (Хатлон)**:
   - *Elevation*: Warm lowland plains ($Y = 20 - 30$).
   - *Terrain*: Loess soil, red sandstone bluffs, cotton fields (*paxta*).
   - *Survival*: Warm daytime temperatures ($>32^\circ\text{C}$).

6. **Vakhsh River Valley (Водии Вахш)**:
   - *Elevation*: River canyon floor ($Y = 22 - 38$).
   - *Terrain*: Broad turquoise glacial river channels, river cobblestones, gravel floodplains.

7. **Semi-arid Mountain Foothills (Домани кӯҳҳо)**:
   - *Elevation*: Weathered lower slopes ($Y = 30 - 50$).
   - *Terrain*: Dusty red sandstone, rocky ravines, aromatic *Artemisia* (*Darmona*) shrub carpets.

8. **Alpine Meadows (Яйлоқ)**:
   - *Elevation*: High summer pasture plateaus ($Y = 45 - 65$).
   - *Terrain*: High-altitude grazing meadows carpeted with wild mountain tulips (*Lola*), purple blossoms, and clear mountain streams.
   - *Landmarks*: Shepherd mountain stone camps with tandoor ovens and animal pens.

---

## 🏛️ 5. Tajik Culture, Architecture & Items

- **Traditional Pamiri House (Chorxona)**: Modeled with 5 sacred wooden pillars (*Sutun*) representing the elemental foundations, multi-tiered concentric square timber roof (*Chorkhona*), and central skylight window.
- **Hisor Fortress Gate**: Generated with twin towers, adobe/fired clay bricks, crenelated battlements, and wooden portal.
- **Tandoor Oven**: Functional clay oven for baking traditional *Non* flatbread, flaky *Fatir*, and *Sambusa*.
- **Traditional Tajik Cuisine**:
  - *Oshi Palov*: National rice dish cooked with meat, spices, and carrots; provides 60 hunger restore and 20 core warmth.
  - *Qurutob*: Shredded fatir bread soaked in savory *qurut* yogurt sauce, herbs, and melted butter.
  - *Qurut*: Concentrated dried yogurt balls, durable mountain trail food.
  - *Fresh Non Bread*, *Sambusa*, *Uryuk* (dried apricots), *Walnuts*, *Melon slices*.
- **Craftable Cultural Artifacts**:
  - *Dutar & Rubab*: Hand-carved traditional wooden string instruments with procedural acoustic plucking playback when swung!
  - *Toki Cap*: Embroidered traditional skullcap providing sun and cold protection.
  - *Chapan Coat*: Warm quilted wool/cotton outerwear providing +25°C cold resistance.
  - *Suzani Carpet Block*: Intricate embroidered medallion carpet block for interior decoration.
  - *Pamir Kord*: Traditional steel dagger crafted from Pamir ruby and forged iron.

---

## ⚙️ 6. Technical Architecture

```
res://
  ├── data/
  │   ├── block_registry.gd       # 56 block definitions (hardness, drops, textures)
  │   ├── item_registry.gd        # Tools, food, armor, materials, instruments
  │   ├── recipe_registry.gd      # Crafting recipes database
  │   ├── biome_registry.gd       # 8 Tajikistan biomes & generation parameters
  │   └── landmark_registry.gd    # Voxel blueprints (Fortress, Chorxona, Camp)
  ├── scripts/
  │   ├── core/
  │   │   ├── game_manager.gd     # Global singleton: time, weather, seed, pause
  │   │   ├── audio_manager.gd    # Procedural sound synthesizer (SFX + Dutar)
  │   │   └── texture_generator.gd# Procedural 256x256 pixel-art texture atlas
  │   ├── world/
  │   │   ├── chunk.gd            # VoxelChunk: 16x16x96, ArrayMesh hidden-face culling
  │   │   ├── terrain_generator.gd# Layered FastNoiseLite (continental, ridged, river, caves)
  │   │   ├── voxel_world.gd      # Chunk streaming, meshing queue, delta persistence
  │   │   └── day_night_cycle.gd  # Dynamic sun/moon rotation, ambient color grading
  │   ├── player/
  │   │   ├── player_controller.gd# 1st/3rd person camera, physics, raycast interaction
  │   │   └── survival_stats.gd   # Health, hunger, stamina, altitude temperature
  │   ├── inventory/
  │   │   ├── inventory_manager.gd# 36 slots, equipment, serialization
  │   │   └── crafting_system.gd  # Crafting engine & ingredient validation
  │   ├── animals/
  │   │   └── animal_ai.gd        # Procedural 3D voxel animals (sheep, ibex, yak, leopard)
  │   └── ui/
  │       ├── hud.gd              # Survival bars, hotbar, compass, coordinates, target
  │       ├── inventory_ui.gd     # Backpack grid & crafting station interface
  │       ├── pause_menu.gd       # Resume, save, language toggle, main menu
  │       └── main_menu.gd        # 3D animated Pamir mountain panorama background
  ├── scenes/
  │   ├── world/world.tscn        # Main gameplay world scene
  │   └── ui/main_menu.tscn       # Main menu scene
  └── tests/
      ├── test_runner.gd          # 32 automated unit tests across all systems
      └── gameplay_test_runner.gd # Live 60-frame world streaming verification
```

---

## 🧪 7. Automated Test Suite

TajikCraft includes an automated headless verification test suite (`scenes/tests/test_scene.tscn`):
- **Block Registry**: Checks all 56 block properties, hardness values, and drop mappings.
- **Item & Recipe Registry**: Validates tool tiers, food nourishment, and crafting recipes.
- **Terrain & Biomes**: Verifies multi-octave noise, 8 biomes, and Pamir elevation gradients.
- **Chunk Meshing**: Validates direct `ArrayMesh` face culling and trimesh physics collision.
- **Player & Survival**: Tests health, hunger depletion, sprint stamina, and altitude temperature lapse.
- **Inventory & Crafting**: Asserts item stacking, slot swapping, recipe execution, and serialization.
- **World Persistence**: Tests placing blocks, saving delta to disk, and roundtrip deserialization.
- **Wildlife AI**: Verifies procedural 3D model construction and behavioral state machines.

**Test Results: 32 Passed, 0 Failed (100% Pass Rate).**

---

## 🌐 8. Localization Support

TajikCraft features built-in trilingual localization:
- **English** (`en`)
- **Тоҷикӣ / Tajik** (`tg`)
- **Русский / Russian** (`ru`)

Can be dynamically toggled at any time in the Settings or Pause menu.

---

## 🚀 9. Future Roadmap & Multiplayer Design

The codebase is decoupled into data-driven registries and independent systems to support future expansion:
- **Multiplayer**: `VoxelWorld` block delta events (`block_modified`) and `InventoryManager` serialize to compact JSON/binary packets, ready for Godot's High-Level Multiplayer (`ENetMultiplayerPeer`).
- **Additional Wildlife**: Bearded vulture soaring behaviors, snow partridge coveys.
- **Expanded Landmarks**: Silk Road Caravanserais and historical Khujand fortress gates.


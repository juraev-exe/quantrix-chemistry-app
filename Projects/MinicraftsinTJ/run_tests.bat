@echo off
title TajikCraft: Automated Tests
echo Running TajikCraft Verification Suite...
if exist "C:\Users\JA\godot\godot_console.exe" (
    "C:\Users\JA\godot\godot_console.exe" --path "%~dp0." --headless scenes/tests/test_scene.tscn
) else (
    godot_console.exe --path "%~dp0." --headless scenes/tests/test_scene.tscn
)
pause


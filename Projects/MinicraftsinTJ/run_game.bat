@echo off
title TajikCraft: Land of Mountains
echo Starting TajikCraft: Land of Mountains...
if exist "C:\Users\JA\godot\godot.exe" (
    "C:\Users\JA\godot\godot.exe" --path "%~dp0."
) else (
    godot.exe --path "%~dp0."
)


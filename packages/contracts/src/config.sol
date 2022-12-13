// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

// --- SPAWN
int32 constant WORLD_HEIGHT = 50;
int32 constant WORLD_WIDTH = 50;
uint32 constant INITIAL_RESOURCE = 0;
uint32 constant INITIAL_ENERGY = 100;
uint32 constant SPAWN_RESOURCE_PER_POSITION = 100;
// --- ENERGY
uint32 constant RESOURCE_TO_ENERGY_CONVERSION_RATE = 5;
// --- FIRE
uint32 constant MINIMUM_FIRE_SIZE = 500;
uint32 constant FIRE_BURNTIME_MULTIPLIER = 10;
uint32 constant COST_TO_MAKE_FIRE = 50;
// --- MOVE
int32 constant MAX_DISTANCE = 5;
// --- PLAY
uint32 constant PLAYING_DURATION = 20;

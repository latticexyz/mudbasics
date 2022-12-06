// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

int32 constant WORLD_HEIGHT = 50;
int32 constant WORLD_WIDTH = 50;
int32 constant INITIAL_RESOURCE = 80;
int32 constant INITIAL_ENERGY = 100;

enum entityType {
  Player,
  Terrain,
  Fire,
  Corpse
}

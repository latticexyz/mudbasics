// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

enum EntityType {
  Player,
  Terrain,
  Fire,
  Corpse,
  Ghost
}

//  | 8 | 1 | 2 |
//  | 7 | X | 3 |
//  | 6 | 5 | 4 |

enum Direction {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest
}

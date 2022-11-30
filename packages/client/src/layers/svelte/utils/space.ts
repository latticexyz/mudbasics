import { Coord } from "@latticexyz/recs";

export enum TerrainType {
  Dust,
  Debris,
  Ruins,
}

export enum Directions {
  Random,
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
}

export enum EntityType {
  Player,
  Terrain,
  Fire,
  Corpse,
}

export function positionsToTransformation(from: Coord, to: Coord) {
  return { x: to.x - from.x, y: to.y - from.y } as Coord;
}

export function transformationToDirection(t: Coord) {
  if (t.x == 1 && t.y == 0) return Directions.East;
  if (t.x == 1 && t.y == 1) return Directions.SouthEast;
  if (t.x == 0 && t.y == 1) return Directions.South;
  if (t.x == -1 && t.y == 1) return Directions.SouthWest;
  if (t.x == -1 && t.y == 0) return Directions.West;
  if (t.x == -1 && t.y == -1) return Directions.NorthWest;
  if (t.x == 0 && t.y == -1) return Directions.North;
  if (t.x == 1 && t.y == -1) return Directions.NorthEast;
  return Directions.Random;
}

export function directionToString(direction: Directions) {
  if (direction === Directions.Random) return "";
  if (direction === Directions.North) return "north";
  if (direction === Directions.NorthEast) return "north-east";
  if (direction === Directions.East) return "east";
  if (direction === Directions.SouthEast) return "south-east";
  if (direction === Directions.South) return "south";
  if (direction === Directions.SouthWest) return "south-west";
  if (direction === Directions.West) return "west";
  if (direction === Directions.NorthWest) return "north-west";
  return "";
}

export function getDirection(from: Coord, to: Coord) {
  if (!from || !to) return "";
  return directionToString(transformationToDirection(positionsToTransformation(from, to)));
}

export function directionalPathfind(from: Coord, to: Coord) {
  const path: Coord[] = [];
  const directionX = from.x < to.x ? 1 : -1;
  const directionY = from.y < to.y ? 1 : -1;

  for (let x = from.x + directionX; directionX * x <= directionX * to.x; x = x + directionX) {
    path.push({ x, y: from.y });
  }

  for (let y = from.y + directionY; directionY * y <= directionY * to.y; y = y + directionY) {
    path.push({ x: to.x, y });
  }

  return path;
}

/**
 * @param a Coordinate A
 * @param b Coordinate B
 * @returns Manhattan distance from A to B (https://xlinux.nist.gov/dads/HTML/manhattanDistance.html)
 */
export function manhattan(a: Coord, b: Coord) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

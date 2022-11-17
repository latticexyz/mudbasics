interface Coord {
  x: number;
  y: number;
}

export enum EntityType {
  Player,
  Terrain,
  Fire,
}

export function getDirection(previousPosition, currentPosition) {
  if (!previousPosition || !currentPosition) {
    return "";
  }

  if (currentPosition.x > previousPosition.x) {
    return "east";
  }

  if (currentPosition.x < previousPosition.x) {
    return "west";
  }

  if (currentPosition.y > previousPosition.y) {
    return "south";
  }

  if (currentPosition.y < previousPosition.y) {
    return "north";
  }
}

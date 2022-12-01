import { Coord } from "@latticexyz/recs";
import { get } from "svelte/store";
import { player } from "../../stores/player";
import { entities, EntityType } from "../../stores/entities";

function checkForType(gridPosition: Coord, type: EntityType) {
  const entity = Object.values(get(entities)).find(
    (e) => (e.position?.x || 0) == gridPosition.x && (e.position?.y || 0) == gridPosition.y && e.entityType == type
  );
  return entity;
}

export function drained() {
  const terrainInLocation = checkForType(get(player).position, EntityType.Terrain);
  if (!terrainInLocation) return true;
  if ((terrainInLocation.resource || 0) > 0) return true;
  return false;
}

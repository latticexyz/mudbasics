import { Coord } from "@latticexyz/recs";
import { get } from "svelte/store";
import { player } from "../../stores/player";
import { entities, EntityType } from "../../stores/entities";
import { directToLog } from "../../stores/narrative";

function checkForType(gridPosition: Coord, type: EntityType) {
  const entity = Object.values(get(entities)).find(
    (e) => (e.position?.x || 0) == gridPosition.x && (e.position?.y || 0) == gridPosition.y && e.entityType == type
  );
  return entity;
}

export function byTheFire() {
  const fireInLocation = checkForType(get(player).position, EntityType.Fire);
  if (fireInLocation) {
    directToLog("You arrived at a fire.");
    return true;
  } else {
    directToLog("No fire in sight.");
    return false;
  }
}

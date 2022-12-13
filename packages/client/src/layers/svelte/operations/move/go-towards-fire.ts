import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { fires } from "../../stores/entities";
import { directToLog, LogEntryType } from "../../stores/narrative";
import { transformationToDirection, positionsToTransformation, directionalPathfind } from "../../utils/space";

export function goTowardsFire() {
  if (get(fires).length > 0 && (get(player).energy || 0) >= 10) {
    const paths = [];
    for (let i = 0; i < get(fires).length; i++) {
      // Get path between player and fire
      const path = directionalPathfind(get(player).position, get(fires)[i].position);
      paths.push({ path: path, distance: path.length });
    }
    paths.sort((a, b) => a.distance - b.distance);

    // At fire
    if (paths[0].path.length < 1) return false;

    // Take the first step towards the closest fire
    const t = positionsToTransformation(get(player).position, paths[0].path[0]);
    get(network).api?.move(10, transformationToDirection(t));

    return true;
  } else {
    directToLog("You do not have enough energy to do this", LogEntryType.Failure);
    return false;
  }
}

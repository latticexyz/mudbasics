import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { Directions } from "../../utils/space";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function southEast() {
  if ((get(player).energy || 0) >= 10) {
    get(network).api?.move(10, Directions.SouthEast);
    return true;
  } else {
    directToLog("You do not have enough energy to do this", LogEntryType.Failure);
    return false;
  }
}

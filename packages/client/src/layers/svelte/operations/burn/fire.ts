import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function fire() {
  if ((get(player).energy || 0) < 50) {
    directToLog("You do not have enough energy for this.", LogEntryType.Failure);
    return false;
  }
  if ((get(player).resource || 0) >= 1000) {
    directToLog("You pour your sludge in a puddle and set it on fire...");
    get(network).api?.burn(1000);
    return true;
  } else {
    directToLog("You do not have enough sludge to start a fire.", LogEntryType.Failure);
    console.log("Fire: not enough resource");
    return false;
  }
}

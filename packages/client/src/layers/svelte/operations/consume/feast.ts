import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function feast() {
  if ((get(player).resource || 0) >= 50) {
    get(network).api?.consume(50);
    return true;
  } else {
    directToLog("You do not have enough sludge to do this", LogEntryType.Failure);
    console.log("Feast: not enough resource");
    return false;
  }
}

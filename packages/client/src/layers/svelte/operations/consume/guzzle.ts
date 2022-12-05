import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function guzzle() {
  if ((get(player).resource || 0) >= 50) {
    get(network).api?.consume(50);
    return true;
  } else {
    directToLog("You do not have enough to do this", LogEntryType.Failure);
    console.log("Guzzle: not enough resource");
    return false;
  }
}

import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function lick() {
  if ((get(player).resource || 0) >= 10) {
    get(network).api?.consume(10);
    return true;
  } else {
    directToLog("You do not have enough to do this", LogEntryType.Failure);
    console.log("Lick: not enough resource");
    return false;
  }
}

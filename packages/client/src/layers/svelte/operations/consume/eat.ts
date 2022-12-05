import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function eat() {
  if ((get(player).resource || 0) >= 25) {
    get(network).api?.consume(25);
    return true;
  } else {
    directToLog("You do not have enough sludge to do this", LogEntryType.Failure);
    console.log("Eat: not enough resource");
    return false;
  }
}

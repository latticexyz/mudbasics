import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, getOperationTale } from "../../stores/narrative";

export function feast() {
  if ((get(player).resource || 0) >= 50) {
    get(network).api?.consume(50);
    directToLog(getOperationTale("feast", "lore"));
    return true;
  } else {
    // directToLog(getOperationTale('feast', 'failure'), LogEntryType.Failure);
    console.log("Feast: not enough resource");
    return false;
  }
}

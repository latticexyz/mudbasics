import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";

export function dig() {
  if ((get(player).energy || 0) >= 100) {
    get(network).api?.gather(100);
    directToLog(getOperationTale("dig", "lore"));
    return true;
  } else {
    directToLog("You do not have enough energy to do this", LogEntryType.Failure);

    console.log("not enough energy");
    return false;
  }
}

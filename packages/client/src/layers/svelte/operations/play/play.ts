import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";

export function play() {
  if ((get(player).energy || 0) >= 100) {
    get(network).api?.play(100);
    directToLog(getOperationTale("serenade", "lore"), LogEntryType.Banter);
    return true;
  } else {
    directToLog("You do not have enough energy to waste on this...", LogEntryType.Failure);
    return false;
  }
}

import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";

export function crawl() {
  if ((get(player).energy || 0) >= 10) {
    get(network).api?.move(10, 0);
    directToLog(getOperationTale("crawl", "lore"), LogEntryType.Banter);
    return true;
  } else {
    directToLog("You do not have enough energy to do this", LogEntryType.Failure);
    console.log("not enough energy");
    return false;
  }
}

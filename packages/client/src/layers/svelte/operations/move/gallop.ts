import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";
import { getRandomInt } from "../../utils/ui";

export function gallop() {
  if ((get(player).energy || 0) >= 50) {
    get(network).api?.move(50, getRandomInt(1, 8));
    directToLog(getOperationTale("gallop", "lore"), LogEntryType.Banter);
    return true;
  } else {
    directToLog("You do not have enough energy to do this", LogEntryType.Failure);
    return false;
  }
}

import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";

export function eat() {
  if ((get(player).resource || 0) >= 25) {
    get(network).api?.consume(25);
    directToLog(getOperationTale("eat", "lore"), LogEntryType.Banter);
    return true;
  } else {
    return false;
  }
}

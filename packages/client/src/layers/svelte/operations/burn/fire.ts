import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";

export function fire() {
  if ((get(player).energy || 0) < 50) {
    directToLog(getOperationTale("fire", "insufficient_energy"), LogEntryType.Failure);
    return false;
  }
  if ((get(player).resource || 0) >= 500) {
    get(network).api?.burn(500);
    directToLog(getOperationTale("fire", "lore"), LogEntryType.Banter);
    return true;
  } else {
    directToLog(getOperationTale("fire", "insufficient_sludge"), LogEntryType.Failure);
    return false;
  }
}

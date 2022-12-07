import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, LogEntryType, getOperationTale } from "../../stores/narrative";

export function fire() {
  if ((get(player).energy || 0) < 50) {
    directToLog(getOperationTale("fire", "insufficient_energy"), LogEntryType.Failure);
    return false;
  }
  if ((get(player).resource || 0) >= 1000) {
    get(network).api?.burn(1000);
    directToLog(getOperationTale("fire", "lore"));
    return true;
  } else {
    directToLog(getOperationTale("fire", "insufficient_sludge"), LogEntryType.Failure);
    console.log("Fire: not enough resource");
    return false;
  }
}

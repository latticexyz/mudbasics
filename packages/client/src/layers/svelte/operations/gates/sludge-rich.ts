import { get } from "svelte/store";
import { player } from "../../stores/player";
import { directToLog, LogEntryType } from "../../stores/narrative";

export function sludgeRich() {
  directToLog("You open the vessel you use to store the sludge...");
  if ((get(player).resource || 0) > 200) {
    directToLog("It is almost full", LogEntryType.Success);
    return true;
  } else {
    directToLog("Not much there.", LogEntryType.Failure);
    return false;
  }
}

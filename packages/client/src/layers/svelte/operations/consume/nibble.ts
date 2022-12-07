import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog, getOperationTale } from "../../stores/narrative";

export function nibble() {
  if ((get(player).resource || 0) >= 10) {
    get(network).api?.consume(10);
    directToLog(getOperationTale("nibble", "lore"));

    return true;
  } else {
    console.log("Nibble: not enough resource");
    return false;
  }
}

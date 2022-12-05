import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog } from "../../stores/narrative";

export function bonfire() {
  if ((get(player).resource || 0) >= 500) {
    directToLog("You emptied sludge in a puddle and set it on fire...");
    get(network).api?.burn(500);
    return true;
  } else {
    console.log("Fire: not enough resource");
    return false;
  }
}

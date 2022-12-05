import { get } from "svelte/store";
import { player } from "../../stores/player";
import { directToLog } from "../../stores/narrative";

export function hungry() {
  directToLog("You ask yourself if you are hungry...");
  if ((get(player).energy || 0) < 100) {
    directToLog("– You are.");
    return true;
  } else {
    directToLog("– You are not.");
    return false;
  }
}

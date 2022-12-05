import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { directToLog } from "../../stores/narrative";

export function play() {
  if ((get(player).energy || 0) >= 100) {
    directToLog("You play a song for the living and the dead and the in-between.");
    get(network).api?.play(100);
    return true;
  } else {
    directToLog("You do not have enough energy to waste on this...");
    console.log("Play: not enough energy");
    return false;
  }
}

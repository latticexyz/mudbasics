import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export function play() {
  if ((get(player).energy || 0) >= 100) {
    get(network).api?.play(100);
    return true;
  } else {
    console.log("Play: not enough energy");
    return false;
  }
}

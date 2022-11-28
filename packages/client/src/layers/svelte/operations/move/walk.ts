import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export function walk() {
  if ((get(player).energy || 0) >= 30) {
    get(network).api?.move(30, 0);
    return true;
  } else {
    console.log("Walk: not enough energy");
    return false;
  }
}

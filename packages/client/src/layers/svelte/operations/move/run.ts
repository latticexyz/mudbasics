import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function run() {
  if ((get(player).energy || 0) >= 50) {
    get(network).api?.move(50, 0);
    return true;
  } else {
    console.log("Run: not enough energy");
    return false;
  }
}

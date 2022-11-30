import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function hoard() {
  if ((get(player).energy || 0) >= 100) {
    get(network).api?.gather(100);
    return true;
  } else {
    console.log("Hoard: not enough energy");
    return false;
  }
}

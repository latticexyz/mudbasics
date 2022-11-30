import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function gather() {
  if ((get(player).energy || 0) >= 50) {
    get(network).api?.gather(50);
    return true;
  } else {
    console.log("Gather: not enough energy");
    return false;
  }
}

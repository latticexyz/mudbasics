import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function glean() {
  if ((get(player).energy || 0) >= 50) {
    get(network).api?.gather(50);
    return true;
  } else {
    console.log("not enough energy");
    return false;
  }
}

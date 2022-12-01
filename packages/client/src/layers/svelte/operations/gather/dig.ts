import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function dig() {
  if ((get(player).energy || 0) >= 100) {
    get(network).api?.gather(100);
    return true;
  } else {
    console.log("not enough energy");
    return false;
  }
}

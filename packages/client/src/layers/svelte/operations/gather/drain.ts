import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function drain() {
  if ((get(player).energy || 0) >= 200) {
    get(network).api?.gather(200);
    return true;
  } else {
    console.log("not enough energy");
    return false;
  }
}

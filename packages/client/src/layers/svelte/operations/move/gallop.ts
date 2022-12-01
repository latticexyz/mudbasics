import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function gallop() {
  if ((get(player).energy || 0) >= 50) {
    get(network).api?.move(50, 0);
    return true;
  } else {
    console.log("not enough energy");
    return false;
  }
}

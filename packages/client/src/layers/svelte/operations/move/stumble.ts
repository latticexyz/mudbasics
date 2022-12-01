import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function stumble() {
  if ((get(player).energy || 0) >= 30) {
    get(network).api?.move(30, 0);
    return true;
  } else {
    console.log("not enough energy");
    return false;
  }
}

import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function drink() {
  if ((get(player).resource || 0) >= 25) {
    get(network).api?.consume(25);
    return true;
  } else {
    console.log("Drink: not enough resource");
    return false;
  }
}

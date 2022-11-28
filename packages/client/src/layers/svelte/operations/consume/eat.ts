import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export function eat() {
  if ((get(player).resource || 0) >= 10) {
    get(network).api?.consume(10);
    return true;
  } else {
    console.log("Eat: not enough resource");
    return false;
  }
}

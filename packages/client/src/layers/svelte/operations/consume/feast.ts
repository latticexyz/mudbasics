import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export function feast() {
  if ((get(player).resource || 0) >= 20) {
    get(network).api?.consume(20);
    return true;
  } else {
    console.log("Feast: not enough resource");
    return false;
  }
}

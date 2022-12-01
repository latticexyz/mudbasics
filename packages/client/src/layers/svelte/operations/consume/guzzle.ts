import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function guzzle() {
  if ((get(player).resource || 0) >= 20) {
    get(network).api?.consume(20);
    return true;
  } else {
    console.log("Guzzle: not enough resource");
    return false;
  }
}

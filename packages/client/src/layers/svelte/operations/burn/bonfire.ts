import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export function bonfire() {
  if ((get(player).resource || 0) >= 500) {
    get(network).api?.burn(500);
    return true;
  } else {
    return false;
  }
}

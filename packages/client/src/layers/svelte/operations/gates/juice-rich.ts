import { get } from "svelte/store";
import { player } from "../../stores/player";

export function juiceRich() {
  if ((get(player).resource || 0) >= 100) {
    return true;
  } else {
    return false;
  }
}

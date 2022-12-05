import { get } from "svelte/store";
import { player } from "../../stores/player";

export function sludgeRich() {
  if ((get(player).resource || 0) > 200) {
    return true;
  } else {
    return false;
  }
}

import { get } from "svelte/store";
import { player } from "../../stores/player";

export function hungry() {
  if ((get(player).energy || 0) < 900) {
    return true;
  } else {
    return false;
  }
}

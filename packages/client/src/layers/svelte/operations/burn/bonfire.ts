import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["resource"],
  values: [500],
};

export function bonfire() {
  if ((get(player).resource || 0) >= 500) {
    get(network).api?.burn(500);
    return true;
  } else {
    console.log("Fire: not enough resource");
    return false;
  }
}

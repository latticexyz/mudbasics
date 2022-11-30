import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";
import { Directions } from "../../utils/space";

export function southWest() {
  if ((get(player).energy || 0) >= 10) {
    get(network).api?.move(10, Directions.SouthWest);
    return true;
  } else {
    console.log("Walk: not enough energy");
    return false;
  }
}

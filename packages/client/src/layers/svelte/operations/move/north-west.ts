import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";
import { Directions } from "../../utils/space";

export function northWest() {
  if (get(entities)[get(playerAddress)].energy >= 10) {
    get(network).api?.move(10, Directions.NorthWest);
    return true;
  } else {
    console.log("Walk: not enough energy");
    return false;
  }
}

import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";
import { Directions } from "../../utils/space";

export function south() {
  if (get(entities)[get(playerAddress)].energy >= 30) {
    get(network).api?.move(30, Directions.South);
    return true;
  } else {
    console.log("Walk: not enough energy");
    return false;
  }
}

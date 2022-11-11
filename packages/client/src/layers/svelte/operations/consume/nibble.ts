import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function nibble() {
  if (get(entities)[get(playerAddress)].resource >= 5) {
    get(network).api?.consume(5);
    return true;
  } else {
    console.log("Nibble: not enough resource");
    return false;
  }
}

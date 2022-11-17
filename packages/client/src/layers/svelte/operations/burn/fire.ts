import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function fire() {
  if (get(entities)[get(playerAddress)].resource >= 100) {
    get(network).api?.burn(100);
    return true;
  } else {
    console.log("Fire: not enough resource");
    return false;
  }
}

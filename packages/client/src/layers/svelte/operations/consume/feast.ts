import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function feast() {
  if (get(entities)[get(playerAddress)].resource >= 20) {
    get(network).api?.consume(20);
    return true;
  } else {
    console.log("Feast: not enough resource");
    return false;
  }
}

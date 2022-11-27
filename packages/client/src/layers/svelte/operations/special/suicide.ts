import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function suicide() {
  // Spend all available energy moving in a random direction
  get(network).api?.move(get(entities)[get(playerAddress)].energy || 0, 0);
  return true;
}

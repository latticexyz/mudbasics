import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export function suicide() {
  // Spend all available energy moving in a random direction
  get(network).api?.move(get(player).energy || 0, 0);
  return true;
}

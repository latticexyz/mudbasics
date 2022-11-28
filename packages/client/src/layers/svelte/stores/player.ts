import { derived } from "svelte/store";
import { network } from "./network";
import { entities } from "./entities";

export const playerAddress = derived(network, ($network) => $network.network?.connectedAddress.get() || "0x0");
export const player = derived([entities, playerAddress], ([$entities, $playerAddress]) => $entities[$playerAddress]);

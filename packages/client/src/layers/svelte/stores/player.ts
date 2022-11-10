import { derived } from "svelte/store";
import { network } from "./network";
import { entitites } from "./entities";

export const playerAddress = derived(network, ($network) => $network.network?.connectedAddress.get());

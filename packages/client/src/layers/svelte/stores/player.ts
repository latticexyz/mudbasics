import { derived } from "svelte/store";
import { network } from "./network";

export const playerAddress = derived(network, ($network) => $network.network?.connectedAddress.get() || "0x0");

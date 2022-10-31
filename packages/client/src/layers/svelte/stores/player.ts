import { derived } from "svelte/store";
import { layers } from "./layers";

export const playerAddress = derived(layers, ($layers) => $layers.network?.network.connectedAddress.get());

import { derived } from "svelte/store";
import { layers } from "./layers";
import { entities } from "./entities";

export const playerAddress = derived(layers, ($layers) => $layers.network?.network.connectedAddress.get());

// export const isSpawned = derived([entities, playerAddress], ([$entities, $playerAddress]) => {
//     console.log('entitites', $entities);
//     console.log('playerAddress', $playerAddress);
//     return $entities[$playerAddress]
// });

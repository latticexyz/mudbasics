<script lang="ts">
  import { onMount } from "svelte";
  import { bootGame } from "./boot";
  import UIContainer from "./lib/UIContainer.svelte";
  import {
    createPositionSystem,
    createEnergySystem,
    createResourceSystem,
    createCoolDownSystem,
    createSeedSystem,
    createEntityTypeSystem,
    createCreatorSystem,
    createStatsSystem,
    createBirthSystem,
    createCannibalSystem,
  } from "./systems";
  import { network as networkStore, blockNumber } from "./stores/network";

  onMount(async () => {
    console.log("Mounting app...");

    const layers = await bootGame();

    console.log(layers);

    // ---- Systems
    createPositionSystem(layers.network);
    createEnergySystem(layers.network);
    createResourceSystem(layers.network);
    createCoolDownSystem(layers.network);
    createSeedSystem(layers.network);
    createEntityTypeSystem(layers.network);
    createCreatorSystem(layers.network);
    createStatsSystem(layers.network);
    createBirthSystem(layers.network);
    createCannibalSystem(layers.network);

    networkStore.set(layers.network);

    layers.network.network.blockNumber$.subscribe((x) => {
      blockNumber.set(x);
    });
  });
</script>

<main>
  <UIContainer />
</main>

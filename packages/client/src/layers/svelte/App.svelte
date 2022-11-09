<script lang="ts">
  import { onMount } from "svelte";
  import { bootGame } from "./boot";
  import UIContainer from "./lib/UIContainer.svelte";
  import { createPositionSystem, createEnergySystem, createResourceSystem, createNameSystem } from "./systems";
  import { network as networkStore, blockNumber } from "./stores/network";
  import { createCoolDownSystem } from "./systems/createCoolDownSystem";

  onMount(async () => {
    console.log("Mounting app...");

    const layers = await bootGame();

    console.log(layers);

    // ---- Systems
    createPositionSystem(layers.network);
    createEnergySystem(layers.network);
    createResourceSystem(layers.network);
    createNameSystem(layers.network);
    createCoolDownSystem(layers.network);

    networkStore.set(layers.network);

    layers.network.network.blockNumber$.subscribe((x) => {
      blockNumber.set(x);
    });
  });
</script>

<main>
  <UIContainer />
</main>

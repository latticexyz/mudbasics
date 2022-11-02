<script lang="ts">
  import { onMount } from "svelte";
  import { bootGame } from "./boot";
  import UIContainer from "./lib/UIContainer.svelte";
  import { createPositionSystem, createEnergySystem, createResourceSystem } from "./systems";
  import { layers as layersStore } from "./stores/layers";

  onMount(async () => {
    console.log("Mounting app...");

    const layers = await bootGame();

    console.log(layers);

    // ---- Systems
    createPositionSystem(layers.network);
    createEnergySystem(layers.network);
    createResourceSystem(layers.network);

    layersStore.set(layers);
  });
</script>

<main>
  <UIContainer />
</main>

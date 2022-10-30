<script lang="ts">
  import { onMount } from "svelte";
  import { bootGame } from "./boot";
  import UIContainer from "./lib/UIContainer.svelte";
  import { createPositionSystem } from "./systems";
  import { layers as layersStore } from "./stores/layers";

  onMount(async () => {
    console.log("Mounting app...");

    const layers = await bootGame();

    console.log(layers);

    createPositionSystem(layers.network);

    layersStore.set(layers);
  });
</script>

<main>
  <UIContainer />
</main>

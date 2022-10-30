<script lang="ts">
  import { onMount } from "svelte";
  import { bootGame } from "./boot";
  import UIContainer from "./lib/UIContainer.svelte";

  onMount(async () => {
    console.log("Mounting app...");
    const layers = await bootGame();
    console.log(layers);
  });
</script>

<main>
  <UIContainer />
</main>

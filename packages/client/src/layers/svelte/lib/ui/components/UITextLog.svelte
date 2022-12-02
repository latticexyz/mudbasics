<script lang="ts">
  import { onMount } from "svelte";
  import { narrative, logReady, directToLog } from "../../../stores/narrative";
  import { playerAddress } from "../../../stores/player";
  import { speed } from "../../../stores/ui";
  import { fade } from "svelte/transition";

  onMount(async () => {
    setTimeout(() => {
      logReady.set(true);
      directToLog("It is night.");
      directToLog("You hear something in the darkness...");
    }, 2000);
  });
</script>

<div class="ui-memory">
  <div class="inner-log">
    {#each $narrative as logEntry, i (logEntry.id)}
      <div transition:fade={{ duration: $speed }} class:player={logEntry.address == $playerAddress}>
        <span class="block-number">({logEntry.blockNumber})</span>
        {logEntry.message}
      </div>
    {/each}
  </div>
</div>

<style>
  .block-number {
    font-size: 9px;
  }

  .player {
    color: var(--blue);
  }

  .inner-log {
    overflow-y: auto;
  }
</style>

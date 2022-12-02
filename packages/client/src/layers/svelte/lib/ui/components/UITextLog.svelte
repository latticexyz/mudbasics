<script lang="ts">
  import { narrative } from "../../../stores/narrative";
  import { playerAddress } from "../../../stores/player";
  import { speed } from "../../../stores/ui";
  import { fade } from "svelte/transition";
</script>

<div class="ui-text-log">
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

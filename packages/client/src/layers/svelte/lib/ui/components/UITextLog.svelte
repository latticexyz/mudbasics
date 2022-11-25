<script lang="ts">
  import { narrative } from "../../../stores/narrative";
  import { entities } from "../../../stores/entities";
  import { playerAddress } from "../../../stores/player";
  import { seedToName } from "../../../utils/name";
  import { speed, fragSpeed } from "../../../stores/ui"
  import { fade } from "svelte/transition"
</script>

<div class="ui-text-log">
  <div class="inner-log">
    {#each $narrative as logEntry, i}
      {#if seedToName($entities[logEntry.address]?.seed)}
        <div transition:fade={{ duration: $speed + $fragSpeed * i }} class:player={logEntry.address == $playerAddress}>
          <strong>{seedToName($entities[logEntry.address]?.seed)}</strong>
          {logEntry.message}
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
  .ui-text-log {
    height: 340px;
  }

  .player {
    color: var(--blue);
  }

  .inner-log {
    height: 155px;
    overflow-y: auto;
  }
</style>

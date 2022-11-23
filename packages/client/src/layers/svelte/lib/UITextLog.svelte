<script lang="ts">
  import { narrative } from "../stores/narrative";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { seedToName } from "../utils/name";
</script>

<div class="ui-text-log">
  <div class="inner-log">
    {#each $narrative as logEntry}
      {#if seedToName($entities[logEntry.address]?.seed)}
        <div class:player={logEntry.address == $playerAddress}>
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
    color: blue;
  }

  .inner-log {
    height: 155px;
    overflow-y: auto;
  }
</style>

<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { seedToName } from "../utils/name";
</script>

<div class="ui-debug-log">
  {#each Object.entries($entities) as [address, value]}
    {#if value.energy}
      <div class:player={address === $playerAddress}>
        <strong>{seedToName($entities[address].seed)}</strong>
        => x:{value.position?.x}
        / y: {value.position?.y}
        / e: {value.energy}
        / r: {value.resource}
      </div>
    {/if}
  {/each}
</div>

<style>
  .player {
    color: blue;
  }
</style>

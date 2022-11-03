<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { shortenAddress } from "../utils/ui";
</script>

<div class="ui-text-log">
  {#each Object.entries($entities) as [address, value]}
    {#if value.energy}
      <div class:player={address === $playerAddress}>
        <strong>{shortenAddress(address)}</strong>
        is at: x => {value.position?.x}
        y => {value.position?.y}
        / energy => {value.energy}
      </div>
    {/if}
  {/each}
</div>

<style>
  .player {
    color: blue;
  }
</style>

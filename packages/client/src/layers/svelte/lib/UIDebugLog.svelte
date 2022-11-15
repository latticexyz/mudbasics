<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { seedToName } from "../utils/name";
  import { shortenAddress } from "../utils/ui";
  import { blockNumber } from "../stores/network";
</script>

<div class="ui-debug-log">
  <div>Blocknumber: <strong>{$blockNumber}</strong></div>
  <hr />
  <div><strong>{shortenAddress($playerAddress)}</strong></div>
  {#if $entities[$playerAddress]}
    <div><strong>{seedToName($entities[$playerAddress].seed)}</strong> ({$entities[$playerAddress].seed})</div>
    <div>Cooldown block: {$entities[$playerAddress].coolDownBlock}</div>
    <hr />
  {/if}
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

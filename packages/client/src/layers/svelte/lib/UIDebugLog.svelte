<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { seedToName } from "../utils/name";
  import { EntityType } from "../utils/space";
  import { shortenAddress } from "../utils/ui";
  import { blockNumber } from "../stores/network";
</script>

<div class="ui-debug-log">
  <div>Blocknumber: <strong>{$blockNumber}</strong></div>
  <div>Cooldown block: {$entities[$playerAddress].coolDownBlock}</div>
  <hr />
  {#each Object.entries($entities) as [address, value]}
    <div class:player={address === $playerAddress}>
      {#if value.entityType == EntityType.Player}
        <strong>👺 {seedToName($entities[address].seed)}</strong>
      {/if}
      {#if value.entityType == EntityType.Terrain}
        <strong>🗺️ {shortenAddress(address)}</strong>
      {/if}
      {#if value.entityType == EntityType.Fire}
        <strong>🔥 {shortenAddress(address)}</strong>
      {/if}
      / x:{value.position?.x}
      / y: {value.position?.y}
      {#if value.entityType == EntityType.Player}
        / e: {value.energy}
      {/if}
      / r: {value.resource}
      {#if value.entityType == EntityType.Fire}
        / => {seedToName($entities[value.creator].seed)}
      {/if}
    </div>
  {/each}
</div>

<style>
  .player {
    color: blue;
  }
</style>

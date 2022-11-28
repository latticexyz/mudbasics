<script lang="ts">
  import { fires } from "../../../stores/entities";
  import { player, playerAddress } from "../../../stores/player";
  import { EntityType } from "../../../utils/space";
  import { shortenAddress } from "../../../utils/ui";
  import { blockNumber } from "../../../stores/network";
  import { speed, fragSpeed } from "../../../stores/ui"
  import { fade } from "svelte/transition"

  const SECONDS_IN_DAY = 86400;

  let clockTime: number;
  $: clockTime = Math.floor((($blockNumber % 3600) / 3600) * SECONDS_IN_DAY);
</script>

<div class="ui-debug-log">
  <div>Blocknumber: <strong>{$blockNumber}</strong></div>
  <div>Cooldown block: {$player.coolDownBlock}</div>
  <hr />
  {#each Object.entries($fires) as [address, value], i (address)}
    <div transition:fade={{ duration: $speed + $fragSpeed * i }} class:player={address === $playerAddress}>
      {#if value.entityType == EntityType.Fire}
        <strong>🔥 {shortenAddress(address)}</strong>
      {/if}
      / x:{value.position?.x}
      / y: {value.position?.y}
      {#if value.entityType == EntityType.Player}
        / e: {value.energy}
      {/if}
      {#if value.coolDownBlock}
        / cdb: {value.coolDownBlock}
      {/if}
      {#if value.resource}
        / r: {value.resource}
      {/if}
      {#if value.creator}
        / c: {shortenAddress(value.creator[0])}
      {/if}
    </div>
  {/each}
</div>

<style>
  .player {
    color: var(--blue);
  }
</style>

<script lang="ts">
  import { fires } from "../../../stores/entities";
  import { player, playerAddress } from "../../../stores/player";
  import { EntityType } from "../../../utils/space";
  import { shortenAddress } from "../../../utils/ui";
  import { seedToName } from "../../../utils/name";
  import { blockNumber } from "../../../stores/network";
  import { speed, fragSpeed } from "../../../stores/ui"
  import { fade } from "svelte/transition"

  const SECONDS_IN_DAY = 86400;

  let clockTime: number;
  $: clockTime = Math.floor((($blockNumber % 3600) / 3600) * SECONDS_IN_DAY);
</script>

<div class="ui-debug-log">
  <!-- The fire cooldown time minus current block number -->

  <!-- <div>Blocknumber: <strong>{$blockNumber}</strong></div> -->
  <!-- <div>Cooldown block: {$player.coolDownBlock}</div> -->
  <hr />
  {#each Object.entries($fires) as [address, value], i (address)}
    <div transition:fade={{ duration: $speed + $fragSpeed * i }} class:player={address === $playerAddress}>
      <!-- {#if value.entityType == EntityType.Fire}
        <strong>🔥 {shortenAddress(address)}</strong>
      {/if} -->
      <!-- / x:{value.position?.x}
      / y: {value.position?.y}
      {#if value.entityType == EntityType.Player}
        / e: {value.energy}
      {/if} -->
      🔥
      {#if value.coolDownBlock}
        / cdb: {value.coolDownBlock - $blockNumber}
      {/if}
      {#if value.resource}
        / r: {value.resource}
      {/if}
      {#if value.creator}
        <!-- {value.creator} -->
        / c: {seedToName(value.creator[0])}
      {/if}
    </div>
  {/each}
</div>

<style>
  .player {
    color: var(--blue);
  }
</style>

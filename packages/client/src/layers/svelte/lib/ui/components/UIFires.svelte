<script lang="ts">
  import { fires } from "../../../stores/entities";
  import { playerAddress } from "../../../stores/player";
  import { uiState } from "../../../stores/ui"
  import { seedToName } from "../../../utils/name";
  import { blockNumber } from "../../../stores/network";
  import { speed, fragSpeed } from "../../../stores/ui"
  import { fade } from "svelte/transition"

  const SECONDS_IN_DAY = 86400;

  let clockTime: number;
  $: clockTime = Math.floor((($blockNumber % 3600) / 3600) * SECONDS_IN_DAY);

  function arson () {
    uiState.alter("operations-planner", "active", true);
    uiState.alter("operations-planner", "grid", {
      col: [1, 4],
      row: [1, 10],
    });
    uiState.setOption("operations-planner", "layer", 10);
  }
</script>

<div class="ui-fires">
  <!-- The fire cooldown time minus current block number -->
  {#if Object.entries($fires)?.length < 1}
    This soil looks fairly unscathed... <span class="link" on:click={arson}>Commit arson</span>
  {/if}

  <!-- <div>Blocknumber: <strong>{$blockNumber}</strong></div> -->
  <!-- <div>Cooldown block: {$player.coolDownBlock}</div> -->
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
      {#if Math.max(value.coolDownBlock - $blockNumber, 0) > 0}
        🔥
      {:else}
        🕳
      {/if}
      {#if value.coolDownBlock}
        / cdb: {Math.max(value.coolDownBlock - $blockNumber, 0)}
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

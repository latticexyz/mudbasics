<script lang="ts">
  import { entities } from "../../../stores/entities";
  import { player, playerAddress, playerList } from "../../../stores/player";
  import { seedToName } from "../../../utils/name";
  import { shortenAddress } from "../../../utils/ui";
  import { blockNumber } from "../../../stores/network";
  import { speed, fragSpeed } from "../../../stores/ui";
  import { EntityType } from "../../../stores/entities";
  import { fade } from "svelte/transition";

  const SECONDS_IN_DAY = 86400;

  let clockTime: number;
  $: clockTime = Math.floor((($blockNumber % 3600) / 3600) * SECONDS_IN_DAY);

  function isNight(date: Date) {
    return date.getHours() > 17 || date.getHours() < 9;
  }

  function formatTime(seconds: number) {
    let currentTime = new Date(seconds * 1000);
    return (isNight(currentTime) ? "🌙 " : "🌞 ") + currentTime.toISOString().substr(11, 8);
  }
</script>

<div class="ui-debug-log">
  <div>Blocknumber: <strong>{$blockNumber}</strong></div>
  <div class="clock-time">World time: {formatTime(clockTime)}</div>
  <div>Cooldown block: {$player.coolDownBlock}</div>
  <hr />
  {#each Object.entries($entities) as [address, value], i}
    <div transition:fade={{ duration: $speed + $fragSpeed * i }} class:player={address === $playerAddress}>
      {#if value.entityType == EntityType.Player}
        <strong>👺 {seedToName($entities[address].seed)}</strong>
      {/if}
      {#if value.entityType == EntityType.Terrain}
        <strong>🗺️ {shortenAddress(address)}</strong>
      {/if}
      {#if value.entityType == EntityType.Fire}
        <strong>🔥 {shortenAddress(address)}</strong>
      {/if}
      {#if value.entityType == EntityType.Corpse}
        <strong>💀 {seedToName($entities[address].seed)}</strong>
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
      {#if value.entityType == EntityType.Fire}
        / => {playerList(value.creator)}
      {/if}
    </div>
  {/each}
</div>

<style>
  .player {
    color: var(--blue);
  }
</style>

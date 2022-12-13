<script lang="ts">
  import { Entity } from "../../../../stores/entities";
  import { blockNumber } from "../../../../stores/network";
  import { playerList } from "../../../../stores/player";
  import { seedToFireName } from "../../../../utils/name";
  import { fade } from "svelte/transition";
  export let address: string;
  export let value: Entity;
  export let index: number;
</script>

<div class="fire-item" transition:fade={{ duration: 200 }}>
  <div class="fire-icon">
    <div>
      {#if Math.max((value.coolDownBlock || 0) - $blockNumber, 0) > 0}🔥{:else}🕳{/if}
    </div>
  </div>
  <div class="fire-info">
    <div class="fire-name">#{index + 1} {seedToFireName(value.seed || 0)}</div>
    <div class="fire-resource">sludge burnt: <strong>{value.resource}</strong></div>
    <div class="fire-resource">
      remaining burntime: <strong>{Math.max((value.coolDownBlock || 0) - $blockNumber, 0)}</strong> seconds
    </div>
    <div class="fire-creators">arsonists: <strong>{playerList(value.creator || [])}</strong></div>
  </div>
</div>

<style>
  .fire-item {
    border-bottom: 1px solid white;
    display: flex;
    padding-bottom: 10px;
    padding-top: 10px;
  }

  .fire-item:first-child {
    padding-top: 0;
  }

  .fire-icon {
    width: 50px;
    height: 60px;
    font-size: 32px;
    line-height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fire-info {
    width: calc(100% - 50px);
    min-height: 50px;
    padding-left: 10px;
  }

  .fire-name {
    font-weight: bold;
  }
</style>

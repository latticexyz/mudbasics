<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";

  $: console.log($entities);
</script>

<div class="ui-map">
  <div class="map-container">
    {#each Object.entries($entities) as [address, value]}
      <div
        class="agent"
        class:player={address === $playerAddress}
        class:block={!value.energy}
        style={"left: " + (value.position?.x * 10 - 5) + "px; top: " + (value.position?.y * 10 - 5) + "px;"}
      />
    {/each}
  </div>
</div>

<style>
  .player {
    color: blue;
  }

  .map-container {
    width: 300px;
    height: 300px;
    position: relative;
    background: rgb(114, 167, 114);
    transform: scale(0.5);
  }

  .agent {
    position: absolute;
    width: 10px;
    height: 10px;
    background: yellow;
    z-index: 100;
  }

  .player {
    background: blue;
    z-index: 1000;
  }

  .block {
    position: absolute;
    width: 10px;
    height: 10px;
    background: black;
    z-index: 99;
  }
</style>

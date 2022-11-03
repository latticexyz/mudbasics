<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
</script>

<div class="ui-map">
  <div class="map-container">
    {#each Object.entries($entities) as [address, value]}
      <div
        class="agent"
        class:player={address === $playerAddress}
        style={"left: " + value.position?.x * 2 + "px; top: " + value.position?.y * 2 + "px;"}
      />
    {/each}
  </div>
</div>

<style>
  .player {
    color: blue;
  }

  .map-container {
    width: 200px;
    height: 200px;
    position: relative;
    background: rgb(114, 167, 114);
  }

  .agent {
    position: absolute;
    width: 2px;
    height: 2px;
    background: yellow;
  }

  .player {
    background: blue;
  }
</style>

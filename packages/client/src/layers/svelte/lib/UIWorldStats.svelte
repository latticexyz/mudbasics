<script lang="ts">
  import { entities } from "../stores/entities";
  import { layers } from "../stores/layers";
  import { playerAddress } from "../stores/player";
  import { shortenAddress } from "../utils/ui";
</script>

<div class="ui-world-stats">
  {#each Object.entries($entities) as [id, value]}
    <div class:player={$layers.network.world.entities[id] === $playerAddress}>
      <strong>{shortenAddress($layers.network.world.entities[id])}</strong>
      is at: x => {value.position.x}
      y => {value.position.y}
    </div>
  {/each}
</div>

<style>
  .player {
    color: blue;
  }
</style>

<script lang="ts">
  import { entities } from "../stores/entities";
  import { layers } from "../stores/layers";

  function shorten(s: string) {
    return s.slice(0, 4) + "..." + s.slice(-4);
  }
</script>

<div class="ui-world-stats">
  {#each Object.entries($entities) as [id, value]}
    <div>
      <strong>{shorten($layers.network.world.entities[id])}</strong>
      is at: x => {value.position.x}
      y => {value.position.y}
    </div>
  {/each}
</div>

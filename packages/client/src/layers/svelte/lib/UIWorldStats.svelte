<script lang="ts">
  import { entities } from "../stores/entities";
</script>

<div class="ui-world-stats">
  {#each Object.entries($entities) as [id, value]}
    <div>
      Entity <strong>{id}</strong> is at: x => {value.position.x} y => {value.position.y}
    </div>
  {/each}
</div>

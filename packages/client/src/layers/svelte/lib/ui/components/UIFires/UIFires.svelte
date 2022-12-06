<script lang="ts">
  import { firesV2, Entities } from "../../../../stores/entities";
  import Fire from "./Fire.svelte";

  // TODO:
  // * sort fires
  // – currently burning fires at top, burntout at bottom
  // – Within each of those groups, order by resources burnt
  // – so #1 will be the currently burning fire with the most resources burnt
</script>

<div class="ui-fires">
  {#if Object.entries($firesV2)?.length < 1}
    No fires in sight...
  {/if}

  {#each Object.entries($firesV2) as [address, value], i (address)}
    <Fire {address} {value} index={i} />
  {/each}
</div>

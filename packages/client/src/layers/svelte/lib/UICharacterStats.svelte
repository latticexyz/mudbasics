<script lang="ts">
  import { playerAddress } from "../stores/player";
  import { entities } from "../stores/entities";
  import { shortenAddress } from "../utils/ui";
</script>

<div class="ui-character-stats">
  <div><strong>{shortenAddress($playerAddress)}</strong></div>
  {#if $entities[$playerAddress]}
    <div>Cooldown block: {$entities[$playerAddress].coolDownBlock}</div>
    <div>x: {$entities[$playerAddress].position.x}</div>
    <div>y: {$entities[$playerAddress].position.y}</div>
    <div>energy: {$entities[$playerAddress].energy}</div>
    <div>resource: {$entities[$playerAddress].resource}</div>
  {/if}
</div>

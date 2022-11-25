<script lang="ts">
  import { blockNumber } from "../../../stores/network";
  import { playerAddress } from "../../../stores/player";
  import { entities } from "../../../stores/entities";
  import { shortenAddress } from "../../../utils/ui";
  import { seedToName } from "../../../utils/name";
</script>

<div class="ui-character-stats">
  <div>Blocknumber: <strong>{$blockNumber}</strong></div>
  <hr />
  <div><strong>{shortenAddress($playerAddress)}</strong></div>
  {#if $entities[$playerAddress]}
    <div><strong>{seedToName($entities[$playerAddress].seed)}</strong> ({$entities[$playerAddress].seed})</div>
    <hr />
    <div>Cooldown block: {$entities[$playerAddress].coolDownBlock}</div>
    <!-- <div>x: {$entities[$playerAddress].position.x}</div>
    <div>y: {$entities[$playerAddress].position.y}</div> -->
    <div>energy: {$entities[$playerAddress].energy}</div>
    <div>resource: {$entities[$playerAddress].resource}</div>
  {/if}
</div>

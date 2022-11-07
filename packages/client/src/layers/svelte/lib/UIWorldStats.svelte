<script lang="ts">
  import { entities } from "../stores/entities";
  import { blockNumber } from "../stores/network";

  const BLOCKTIME = 20;
  let timeToNextBlock: number;
  let clockInterval = {};

  function resetClock() {
    clearInterval(clockInterval);
    timeToNextBlock = BLOCKTIME;
    clockInterval = setInterval(() => {
      timeToNextBlock -= 1;
    }, 1000);
  }

  blockNumber.subscribe((newBlock) => {
    if (newBlock > 0) {
      console.log("NEW BLOCK ====>", newBlock);
      resetClock();
    }
  });
</script>

<div class="ui-world-stats">
  <div>Blocknumber: <strong>{$blockNumber}</strong></div>
  {#if $blockNumber > 0}
    <div>Update in: <strong>{timeToNextBlock}</strong> seconds</div>
    <progress value={BLOCKTIME - timeToNextBlock} max={BLOCKTIME} />
  {/if}
  <!-- <div>Entities: {Object.keys($entities).length}</div> -->
</div>

<style>
  progress {
    width: 100%;
    height: 20px;
  }
</style>

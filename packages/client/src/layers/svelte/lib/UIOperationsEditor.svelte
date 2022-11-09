<script lang="ts">
  import { network, blockNumber } from "../stores/network";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { blockNumber } from "../stores/network";

  const OPERATIONS = [
    {
      value: "pass",
      name: "-",
    },

    {
      value: "walk",
      name: "Walk",
    },
    {
      value: "gather",
      name: "Gather",
    },
    {
      value: "eat",
      name: "Eat",
    },
    {
      value: "wait",
      name: "Wait",
    },
  ];

  const SLOTS = ["slot-1", "slot-2", "slot-3", "slot-4", "slot-5"];

  const BLOCKTIME = 20;
  let timeToNextBlock = 0;
  let clockInterval = {};

  function walk() {
    $network.api?.move(3);
  }

  function crawl() {
    $network.api?.move(1);
  }

  function run() {
    $network.api?.move(5);
  }

  function resetClock() {
    clearInterval(clockInterval);
    timeToNextBlock = BLOCKTIME;
    clockInterval = setInterval(() => {
      timeToNextBlock -= 1;
    }, 1000);
  }

  let sequenceActive = false;
  let turnCounter = 0;
  let activeOperationIndex = 0;

  let userName = "";

  let sequence = [];
  let filteredSequence = [];

  blockNumber.subscribe((newBlock) => {
    if (sequenceActive) {
      turnCounter++;
      activeOperationIndex = turnCounter % filteredSequence.length;
      console.log("activeOperationIndex", activeOperationIndex);
      executeOperation(filteredSequence[activeOperationIndex]);
    }
    resetClock();
  });

  function executeOperation(operationName) {
    switch (operationName) {
      case "wait":
        break;
      case "walk":
        $network.api?.move();
        break;
      case "gather":
        $network.api?.gather();
        break;
      case "eat":
        $network.api?.eat();
        break;
    }
  }

  function submitSequence() {
    if (sequenceActive) {
      sequenceActive = false;
    } else {
      filteredSequence = sequence.filter((item) => item !== "pass");
      console.log(filteredSequence);
      sequenceActive = true;
      turnCounter = 0;
    }
  }

  function spawn() {
    $network.api?.spawn(userName);
  }
</script>

<div class="ui-operations-editor">
  {#if $entities[$playerAddress]}
    <div class="operation-grid">
      <button disabled={$entities[$playerAddress].coolDownBlock > $blockNumber} on:click={crawl}>Crawl</button>
      <button disabled={$entities[$playerAddress].coolDownBlock > $blockNumber} on:click={walk}>Walk</button>
      <button disabled={$entities[$playerAddress].coolDownBlock > $blockNumber} on:click={run}>Run</button>
      {#if $entities[$playerAddress].coolDownBlock > $blockNumber}
        In cooldown for <strong>{$entities[$playerAddress].coolDownBlock - $blockNumber}</strong> seconds (until block
        <strong>{$entities[$playerAddress].coolDownBlock}</strong>)
      {/if}
      <!-- {#each SLOTS as slot, i}
        <div class="slot-container">
          <div class="indicator" class:active={sequenceActive && activeOperationIndex == i} />
          <select disabled={sequenceActive} name={slot} bind:value={sequence[i]}>
            {#each OPERATIONS as operation}
              <option value={operation.value}>{operation.name}</option>
            {/each}
          </select>
        </div>
        {#if sequenceActive}
          <progress value={activeOperationIndex == i ? BLOCKTIME - timeToNextBlock : 0} max={BLOCKTIME} />
        {/if}
      {/each}
      <button class:running={sequenceActive} class="submit" on:click={submitSequence}>
        {sequenceActive ? "Stop" : "Start"}
      </button> -->
    </div>
  {:else}
    <div class="spawn">
      <input type="text" bind:value={userName} />
      <button on:click={spawn}>Spawn</button>
    </div>
  {/if}
</div>

<style>
  select {
    display: block;
    width: 100%;
    margin-bottom: 5px;
  }

  button {
    margin-bottom: 10px;
    background: #92ff7c;
    display: block;
  }

  .running {
    background: #ff7e7e;
  }

  .slot-container {
    display: flex;
  }

  .indicator {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: grey;
    margin-right: 10px;
  }

  .active {
    background: #92ff7c;
  }

  progress {
    width: 100%;
    display: block;
    margin-bottom: 10px;
  }
</style>

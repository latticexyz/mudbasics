<script lang="ts">
  import { layers } from "../stores/layers";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";

  const OPERATIONS = [
    {
      value: "pass",
      name: "-",
    },
    // {
    //   value: "crawl",
    //   name: "Crawl",
    // },
    {
      value: "walk",
      name: "Walk",
    },
    // {
    //   value: "run",
    //   name: "Run",
    // },
    // {
    //   value: "search",
    //   name: "Search",
    // },
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

  // let randomMovementActive = false;
  // let randomMovementInterval = {};

  // let energyTestActive = false;
  // let energyTestInterval = {};

  // let moveGatherActive = false;
  // let moveGatherInterval = {};

  let sequenceActive = false;
  let sequenceInterval = {};
  let turnCounter = 0;
  let activeOperationIndex = 0;

  let userName = "";

  let sequence = [];

  function executeOperation(operationName) {
    switch (operationName) {
      case "wait":
        break;
      // case "crawl":
      //   $layers.network?.api.move();
      //   break;
      case "walk":
        $layers.network?.api.move();
        break;
      // case "run":
      //   $layers.network?.api.move();
      //   break;
      case "gather":
        $layers.network?.api.gather();
        break;
      // case "eat":
      //   $layers.network?.api.eat();
      //   break;
      // case "search":
      //   // $layers.network?.api.gather();
      //   break;
    }
  }

  function submitSequence() {
    if (sequenceActive) {
      clearInterval(sequenceInterval);
      sequenceActive = false;
    } else {
      let filteredSequence = sequence.filter((item) => item !== "pass");
      console.log(filteredSequence);

      sequenceActive = true;
      turnCounter = 0;

      sequenceInterval = setInterval(() => {
        activeOperationIndex = turnCounter % filteredSequence.length;
        console.log("activeOperationIndex", activeOperationIndex);
        executeOperation(filteredSequence[activeOperationIndex]);
        turnCounter++;
      }, 1000);
    }
  }

  function spawn() {
    $layers.network?.api.spawn(userName);
  }
</script>

<div class="ui-operations-editor">
  {#if $entities[$playerAddress]}
    <div class="operation-grid">
      {#each SLOTS as slot, i}
        <div class="slot-container">
          <div class="indicator" class:active={sequenceActive && activeOperationIndex == i} />
          <select disabled={sequenceActive} name={slot} bind:value={sequence[i]}>
            {#each OPERATIONS as operation}
              <option value={operation.value}>{operation.name}</option>
            {/each}
          </select>
        </div>
      {/each}
      <button class:running={sequenceActive} class="submit" on:click={submitSequence}>
        {sequenceActive ? "Stop" : "Start"}
      </button>
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

  input[type="submit"] {
    margin-top: 10px;
    margin-bottom: 10px;
    background: #92ff7c;
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
</style>

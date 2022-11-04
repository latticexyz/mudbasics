<script lang="ts">
  import { layers } from "../stores/layers";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";

  let randomMovementActive = false;
  let randomMovementInterval = {};

  let energyTestActive = false;
  let energyTestInterval = {};

  let moveGatherActive = false;
  let moveGatherInterval = {};
  let turnCounter = 0;

  let userName = "";

  function spawn() {
    console.log("Spawn...", userName);
    $layers.network?.api.spawn(userName);
  }

  function singleMove() {
    $layers.network?.api.move();
  }

  function singleGather() {
    $layers.network?.api.gather();
  }

  function toggleRandomMovement() {
    if (randomMovementActive) {
      clearInterval(randomMovementInterval);
      randomMovementActive = false;
    } else {
      randomMovementInterval = setInterval(() => {
        console.log("move");
        $layers.network?.api.move();
      }, 1000);
      randomMovementActive = true;
    }
  }

  function toggleEnergyTest() {
    if (energyTestActive) {
      clearInterval(energyTestInterval);
      energyTestActive = false;
    } else {
      energyTestInterval = setInterval(() => {
        console.log("energy test");
        $layers.network?.api.incrementEnergy();
      }, 1000);
      energyTestActive = true;
    }
  }

  function toggleMoveGather() {
    if (moveGatherActive) {
      clearInterval(moveGatherInterval);
      moveGatherActive = false;
    } else {
      moveGatherInterval = setInterval(() => {
        if (turnCounter % 2 == 0) {
          console.log("move");
          $layers.network?.api.move();
        }
        if (turnCounter % 2 == 1) {
          console.log("gather");
          $layers.network?.api.gather();
        }
        turnCounter++;
      }, 1000);
      moveGatherActive = true;
    }
  }
</script>

<div class="ui-operations-editor">
  {#if $entities[$playerAddress]}
    <!-- <div class="operation-grid">
      <select name="slot-1">
        <option value="wait">-</option>
        <option value="move">Move</option>
        <option value="search">Search</option>
        <option value="gather">Gather</option>
      </select>
      <select name="slot-2">
        <option value="wait">-</option>
        <option value="move">Move</option>
        <option value="search">Search</option>
        <option value="gather">Gather</option>
      </select>
      <select name="slot-3">
        <option value="wait">-</option>
        <option value="move">Move</option>
        <option value="search">Search</option>
        <option value="gather">Gather</option>
      </select>
      <select name="slot-4">
        <option value="wait">-</option>
        <option value="move">Move</option>
        <option value="search">Search</option>
        <option value="gather">Gather</option>
      </select>
      <input type="submit" value="Submit" />
    </div> -->
    <div class="test-operations">
      <button on:click={singleMove}>Single move</button>
      <button on:click={singleGather}>Single gather</button>
      <button class:running={randomMovementActive} on:click={toggleRandomMovement}>
        {randomMovementActive ? "Stop" : "Start"} random movement
      </button>
      <button class:running={moveGatherActive} on:click={toggleMoveGather}>
        {moveGatherActive ? "Stop" : "Start"} move + gather
      </button>
      <button class:running={energyTestActive} on:click={toggleEnergyTest}>
        {energyTestActive ? "Stop" : "Start"} energy refill
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
</style>

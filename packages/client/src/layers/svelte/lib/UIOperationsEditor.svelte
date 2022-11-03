<script lang="ts">
  import { layers } from "../stores/layers";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";

  let randomMovementActive = false;
  let randomMovementInterval = {};

  let energyTestActive = false;
  let energyTestInterval = {};

  function spawn() {
    console.log("Spawn...");
    $layers.network?.api.spawn();
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
</script>

<div class="ui-operations-editor">
  {#if $entities[$playerAddress]}
    <div class="operation-grid">
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
    </div>
    <div class="test-operations">
      <button class:running={randomMovementActive} on:click={toggleRandomMovement}>
        {randomMovementActive ? "Stop" : "Start"} random movement
      </button>
      <button class:running={energyTestActive} on:click={toggleEnergyTest}>
        {energyTestActive ? "Stop" : "Start"} energy test
      </button>
    </div>
  {:else}
    <div class="spawn">
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
  }

  .running {
    background: #ff7e7e;
  }
</style>

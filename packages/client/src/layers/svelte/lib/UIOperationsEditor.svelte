<script lang="ts">
  import { layers } from "../stores/layers";
  import { getRandomInt } from "../utils/ui";

  console.log($layers);

  let randomMovementActive = false;
  let randomMovementInterval = {};

  let energyTestActive = false;
  let energyTestInterval = {};

  function toggleRandomMovement() {
    if (randomMovementActive) {
      clearInterval(randomMovementInterval);
      randomMovementActive = false;
    } else {
      randomMovementInterval = setInterval(() => {
        console.log("move");
        $layers.network?.api.move({ x: getRandomInt(0, 10), y: getRandomInt(0, 10) });
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

<div class="ui-text-log">
  <button class:running={randomMovementActive} on:click={toggleRandomMovement}>
    {randomMovementActive ? "Stop" : "Start"} random movement
  </button>
  <button class:running={energyTestActive} on:click={toggleEnergyTest}>
    {energyTestActive ? "Stop" : "Start"} energy test
  </button>
</div>

<style>
  button {
    margin-bottom: 10px;
    background: #92ff7c;
  }

  .running {
    background: #ff7e7e;
  }
</style>

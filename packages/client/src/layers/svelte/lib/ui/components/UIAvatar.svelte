<script lang="ts">
  import { tweened } from "svelte/motion";
  import { playerAddress } from "../../../stores/player";
  import { entities } from "../../../stores/entities";
  import { seedToName } from "../../../utils/name";
  import { blockNumber } from "../../../stores/network";

  const energy = tweened($entities[$playerAddress].energy);
  const resource = tweened($entities[$playerAddress].resource);
  const x = tweened($entities[$playerAddress].position?.x);
  const y = tweened($entities[$playerAddress].position?.y);

  entities.subscribe((value) => {
    let duration = ( [$playerAddress].coolDownBlock - $blockNumber) * 1000;
    duration = duration > 0 ? duration : 1000;

    console.log("$entities[$playerAddress].coolDownBlock", $entities[$playerAddress].coolDownBlock);
    console.log("$blockNumber", $blockNumber);
    console.log("duration", duration);

    let newEnergy = $entities[$playerAddress].energy;
    if (newEnergy !== $energy) {
      energy.set(newEnergy, { duration: duration });
    }

    let newResource = $entities[$playerAddress].resource;
    if (newResource !== $resource) {
      resource.set(newResource, { duration: duration });
    }

    let newX = $entities[$playerAddress].position?.x;
    if (newX !== $x) {
      x.set(newX, { duration: duration });
    }

    let newY = $entities[$playerAddress].position?.y;
    if (newY !== $y) {
      y.set(newY, { duration: duration });
    }
  });
</script>

<div class="ui-avatar">
  <img src="/images/avatar-placeholder.png" alt="Avatar" class="ui-avatar-background" />

  <div class="ui-avatar-header">
    <div class="name">{seedToName($entities[$playerAddress].seed)}</div>
  
    <div class="resources">
      <div class="large-indicator">
        <div class="label">Energy</div>
        <div class="value">{$energy.toFixed(2)}</div>
      </div>
      <div class="large-indicator">
        <div class="label">Resource</div>
        <div class="value">{$resource.toFixed(2)}</div>
      </div>
    </div>
    </div>
</div>

<style>
  .ui-avatar {
    position: relative;
    height: 100%;
  }
  .ui-avatar-background {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .ui-avatar-header {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
    /* align-items: start; */
    gap: 4px;
  }

  .name {
    font-size: var(--font-size-large);
    text-align: center;
    grid-column: 1 / 3;
    /* font-weight: bold; */
  }

  .resources {
    grid-column: 1 / 3;
    align-self: start;
  }

  .large-indicator {
    display: flex;
    width: 100%;
    border-width: 1px;
    text-align: center;
    /* height: 60px; */
    /* line-height: 60px; */
    margin-bottom: 10px;
    margin-top: 10px;
    border: var(--outer-border);
    overflow: hidden;
  }

  .label {
    width: 120px;
    flex-shrink: 0;
    background: rgba(var(--foreground-rgb), 0.3);
    color: var(--foreground);
    padding: 4px 12px;
    font-weight: bold;
  }

  .stats {
    padding-top: 1rem;
    align-self: start;
    display: flex;
    gap: var(--col-gap);
  }



  .value {
    width: 100%;
    align-self: center;
    font-weight: bold;
  }

  .up {
    background: #bfff5e;
  }

  .down {
    background: #d1656c;
  }
</style>

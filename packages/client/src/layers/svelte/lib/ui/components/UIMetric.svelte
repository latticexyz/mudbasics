<script>
  export let label
  export let key

  import { entities } from "../../../stores/entities";
  import { player } from "../../../stores/player"
  import { blockNumber } from "../../../stores/network";
  import { tweened } from "svelte/motion";
  
  const value = tweened($player[key]);
  let direction
  let timeout

  entities.subscribe((v) => {
    // clearTimeout(timeout)
    let duration = ($player.coolDownBlock - $blockNumber) * 1000;
    duration = duration > 0 ? duration : 1000;
    
    let newValue = $player[key]
    direction = Math.sign(newValue - $value)

    if (newValue !== $value) {
      clearTimeout(timeout)
      value.set(newValue, { duration });
      timeout = setTimeout(resetDirection, duration)
    }
  })

  function resetDirection () {
    direction = 0
  }
</script>

<div class="large-indicator">
  <div class="label">{label}</div>
  <div
    class="value"
    class:up={direction > 0}
    class:down={direction < 0}
  >
    <span>{$value}</span>
  </div>
</div>

<style>
  .large-indicator {
    display: flex;
    width: 100%;
    border-width: 1px;
    text-align: center;
    /* height: 60px; */
    /* line-height: 60px; */
    margin-top: calc(var(--row-gap) / 3);
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
    animation: 1s up linear forwards;
  }

  .down {
    animation: 1s down linear forwards;
  }

  @keyframes up {
    to { 
      color: var(--success);
    }
  }


  @keyframes down {
    to { 
      color: var(--failure);
    }
  }
</style>
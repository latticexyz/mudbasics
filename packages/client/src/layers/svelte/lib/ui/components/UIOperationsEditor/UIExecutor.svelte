<script lang="ts">
  import { blockNumber } from "../../../../stores/network";
  import { entities } from "../../../../stores/entities";
  import { playerAddress } from "../../../../stores/player";
  import {
    SEQUENCER_LENGTH,
    progress,
    sequencerActive,
    activeOperationIndex,
    operationDuration,
    sequence,
    startSequencer,
    stopSequencer,
    clearSequencer,
  } from "../../../../stores/sequence";

  const ID = "ui-executor";

  function start() {
    startSequencer();
  }

  function stop() {
    stopSequencer();
  }

  function clear() {
    clearSequencer();
  }

  $: console.log("$sequencerActive", $sequencerActive);
</script>

<div class="ui-executor">
  <!-- Shown if player is in cooldown -->
  {#if !$sequencerActive && ($entities[$playerAddress].coolDownBlock || 0) > $blockNumber}
    <div class="cooldown-overlay">
      <div>
        In cooldown for <strong>{($entities[$playerAddress].coolDownBlock || 0) - $blockNumber}</strong> seconds
      </div>
    </div>
  {/if}

  <div class="operation-grid">
    {#each $sequence as sequenceElement, index}
      <div class="slot-container" class:hidden={$sequencerActive && sequenceElement.operation.category == "empty"}>
        <div
          class="slot {sequenceElement.operation.category}"
          class:active={$sequencerActive && $activeOperationIndex === index}
        >
          <div class="operation-info">
            <div class="operation-name">
              {sequenceElement.operation.name}
            </div>
          </div>

          {#if $activeOperationIndex === index && sequenceElement.operation.category !== "empty"}
            <div class="operation-progress">
              {#if ($entities[$playerAddress].coolDownBlock || 0) - $blockNumber > 0 && $progress > 0}
                <div>
                  <progress value={$progress} max={$operationDuration} />
                </div>
                <div>
                  <strong>
                    {($entities[$playerAddress].coolDownBlock || 0) - $blockNumber} seconds
                  </strong>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="sequencer-controls">
    {#if $sequencerActive}
      <button on:click={stop}>Stop</button>
    {:else}
      <button on:click={start}>Start</button>
    {/if}
  </div>
</div>

<style>
  .ui-executor {
    color: black;
  }

  button {
    display: block;
    margin-right: 5px;
    user-select: none;
  }

  .running {
    background: #ff7e7e;
  }

  .slot-container {
    display: flex;
  }
  /* 
    .operation-name {
      color: var(--foreground);
    } */

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

  .move {
    background: #92ff7c;
  }

  .gather {
    background: #7ce5ff;
  }

  .consume {
    background: #d37cff;
  }

  .burn {
    background: orangered;
  }

  .play {
    background: #ebff7c;
  }

  .special {
    background: #ff7ce7;
  }

  .empty {
    background: lightgrey;
  }

  .inventory {
    padding: 10px 0px;
    margin-top: 10px;
    border-top: 1px solid black;
  }

  .inventory.disabled {
    pointer-events: none;
    opacity: 0.4;
    filter: grayscale(1);
  }

  .operation {
    padding: 10px 15px;
    display: inline-block;
    margin: 5px;
    cursor: pointer;
    user-select: none;
    opacity: var(--muted-opacity);
  }

  .operation:hover {
    opacity: 1;
  }

  .slot-container {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 30px;
  }

  .slot {
    width: 100px;
    height: 100px;
    display: flex;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    border: 2px solid transparent;
    position: relative;
  }

  .hidden {
    opacity: 0;
  }

  .operation-grid {
    margin-top: 10px;
    background: grey;
    padding: 10px;
    margin-bottom: 10px;
  }

  .sequencer-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
  }

  .failure {
    background: red;
  }

  .active {
    border: 2px solid darkgray;
  }

  .cooldown-overlay {
    position: absolute;
    width: 100%;
    background: rgba(127, 127, 127, 0.8);
    backdrop-filter: gray(1);
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    font-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .ui-operations-editor {
    position: relative;
  }

  .operation-info {
    text-align: center;
  }

  .operation-progress {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    text-align: center;
  }

  progress {
    width: 80px;
    height: 5px;
    border-radius: 0;
    margin-bottom: 5px;
  }

  progress::-webkit-progress-bar {
    background: lightgray;
    border-radius: 0;
  }

  progress::-webkit-progress-value {
    background: grey;
    border-radius: 0;
  }
</style>

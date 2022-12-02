<script lang="ts">
  import { tooltip } from "../UIToolTip/index.ts";
  import { blockNumber } from "../../../../stores/network";
  import { uiState } from "../../../../stores/ui";
  import { player } from "../../../../stores/player";
  import { playSound } from "../../../../../howler";
  import {
    progress,
    sequencerActive,
    activeOperationIndex,
    operationDuration,
    sequence,
    startSequencer,
    stopSequencer,
    clearSequencer,
  } from "../../../../stores/sequence";
  export const ID = "ui-executor";

  function start() {
    playSound("eventGood", "ui");
    startSequencer();
  }

  function stop() {
    playSound("selectThree", "ui");
    stopSequencer();
  }

  function clear() {
    playSound("error", "ui");
    clearSequencer();
  }

  function edit() {
    playSound("selectFour", "ui");
    // Show the planner component full screen
    uiState.alter("compulsions", "active", true);
    uiState.alter("compulsions", "grid", {
      col: [1, 4],
      row: [1, 10],
    });
    uiState.setOption("compulsions", "layer", 10);
  }
</script>

<div class="ui-executor">
  <!-- Shown if player is in cooldown -->
  {#if !$sequencerActive && ($player.coolDownBlock || 0) > $blockNumber}
    <div class="cooldown-overlay">
      <div>
        In cooldown for <strong>{($player.coolDownBlock || 0) - $blockNumber}</strong> seconds
      </div>
    </div>
  {/if}

  <!-- GRID -->
  {#if $sequence.length > 0}
    <div class="operation-grid">
      {#each $sequence as sequenceElement, index}
        <div
          use:tooltip
          title={sequenceElement.operation.description}
          data-description={sequenceElement.operation?.cost}
          class="slot {sequenceElement.operation.category}"
          class:active={$sequencerActive && $activeOperationIndex === index}
          class:failure={!$sequence[index].success}
        >
          <div class="operation-name">
            {sequenceElement.operation.name}
          </div>

          {#if $activeOperationIndex === index && sequenceElement.operation.category !== "empty"}
            <div class="operation-progress">
              {#if ($player.coolDownBlock || 0) - $blockNumber > 0 && $progress > 0}
                <div class="progress-bar">
                  <progress value={$progress} max={$operationDuration} />
                </div>
                <div class="progress-number">
                  ({($player.coolDownBlock || 0) - $blockNumber})
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- CONTROLS -->
  <div class="sequencer-controls">
    {#if $sequencerActive}
      <button class="action failure" on:click={stop}>Stop</button>
    {/if}
    {#if !$sequencerActive}
      {#if $sequence.length > 0}
        <button class="action failure" on:click={clear}>Clear</button>
        <button class="action success" on:click={start}>Start</button>
      {/if}
    {/if}
    <button class="action warning" class:big={$sequence.length === 0} on:click={edit}>Edit</button>
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

  .slot-container {
    display: flex;
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

  .gate {
    background: #4336ff;
  }

  .empty {
    background: lightgrey;
  }

  .slot-container {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 30px;
  }

  .slot {
    width: 100%;
    height: auto;
    display: flex;
    font-size: 12px;
    border: 2px solid transparent;
    position: relative;
    justify-content: space-between;
    padding: 5px 10px;
  }

  .hidden {
    opacity: 0;
  }

  .operation-grid {
    margin-top: 10px;
    background: grey;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
  }

  .sequencer-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
  }

  .failure {
    background-color: red;
  }

  .active {
    border: 2px solid blue;
  }

  .big {
    width: 100%;
    text-align: center;
    padding: 12px 24px;
    transition: none;
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
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  .ui-operations-editor {
    position: relative;
  }

  .operation-progress {
    font-size: 9px;
    text-align: center;
    display: flex;
    align-items: center;
  }

  .progress-number {
    font-weight: bold;
    margin-left: 5px;
    min-width: 6ch;
    display: inline-block;
  }

  progress {
    width: 80px;
    height: 10px;
    border-radius: 0;
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

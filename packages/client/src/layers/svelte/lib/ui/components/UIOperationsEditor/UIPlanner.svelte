<script lang="ts">
  import { blockNumber } from "../../../../stores/network";
  import { entities } from "../../../../stores/entities";
  import { playerAddress } from "../../../../stores/player";
  import { operations, Operation } from "../../../../operations/";
  import { uiState } from "../../../../stores/ui"
  import {
    SequenceElement,
    emptySequenceElement,
    SEQUENCER_LENGTH,
    submitSequence,
    stopSequencer,
    sequencerActive,
  } from "../../../../stores/sequence";

  let localSequence: SequenceElement[] = Array(SEQUENCER_LENGTH);
  localSequence.fill(emptySequenceElement);

  function clear() {
    localSequence = Array(SEQUENCER_LENGTH);
    localSequence.fill(emptySequenceElement);
  }

  function submit() {
    // Remove empty sequence elements before submitting
    submitSequence(localSequence.filter((item) => item.operation.name !== "+"));
    uiState.alter('operations-planner', 'active', false)
  }

  function stop() {
    stopSequencer();
  }

  function add(operation: Operation) {
    for (let i = 0; i < SEQUENCER_LENGTH; i++) {
      // Add operation to first free slot
      if (localSequence[i].operation.name == "+") {
        localSequence[i] = { operation: operation, success: true };
        break;
      }
    }
  }
</script>

<div class="ui-operations-editor">
  <!-- Shown if player is in cooldown -->
  {#if !$sequencerActive && ($entities[$playerAddress].coolDownBlock || 0) > $blockNumber}
    <div class="cooldown-overlay">
      <div>
        In cooldown for <strong>{($entities[$playerAddress].coolDownBlock || 0) - $blockNumber}</strong> seconds
      </div>
    </div>
  {/if}

  <!-- GRID -->
  <div class="operation-grid">
    {#each localSequence as sequenceElement}
      <div class="slot-container">
        <div class="slot {sequenceElement.operation.category}">
          <div class="operation-info">
            <div class="operation-name">
              {sequenceElement.operation.name}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- CONTROLS -->
  <div class="sequencer-controls">
    {#if localSequence.filter((item) => item.operation.name !== "+").length == 0}
      <div>Click <strong>operations</strong> below to add to sequencer.</div>
    {:else}
      <button on:click={clear}>Clear sequence</button>
      {#if !$sequencerActive}
        <button on:click={submit}>Submit sequence</button>
      {:else}
        <button on:click={stop}>Stop current sequence</button>
      {/if}
    {/if}
  </div>

  <!-- INVENTORY -->
  <div class="inventory">
    {#each operations as operation}
      <div
        class="operation {operation.category}"
        on:click={() => {
          add(operation);
        }}
      >
        {operation.name}
      </div>
    {/each}
  </div>
</div>

<style>
  .ui-operations-editor {
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
    font-size: 12px;
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
</style>

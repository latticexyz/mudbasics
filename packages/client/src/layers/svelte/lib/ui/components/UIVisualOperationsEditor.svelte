<script lang="ts">
  import { blockNumber } from "../../../stores/network";
  import { entities } from "../../../stores/entities";
  import { playerAddress } from "../../../stores/player";
  import { operations, Operation } from "../../../operations/";
  import { tweened } from "svelte/motion";
  import { playSound } from "../../../../howler";
  import { uiState } from "../../../stores/ui"

  let id = 'visual-operations-editor'

  const progress = tweened(0);

  let sequencerActive = false;
  let turnCounter = 0;
  let activeOperationIndex = 0;
  let filteredSequence: Operation[];
  let oldCoolDownBlock = 0;
  let operationDuration = 0;

  const emptyOperation: Operation = {
    name: "+",
    category: "empty",
    f: () => false,
  };

  let sequenceSuccess = [true, true, true, true];

  let sequence: Operation[] = [emptyOperation, emptyOperation, emptyOperation, emptyOperation];

  function executeOperation(operation: Operation) {
    if (operation) {
      if (!$uiState[id].muted) {
        playSound("bell");
      }
      console.log("====> executing operation:", operation.name);
      return operation.f();
    } else {
      stopSequencer();
    }
  }

  function addToSequencer(operation: Operation) {
    for (let i = 0; i < 4; i++) {
      if (sequence[i].name == "+") {
        sequence[i] = operation;
        break;
      }
    }
  }

  function clearSequencer() {
    for (let i = 0; i < 4; i++) {
      sequence[i] = emptyOperation;
    }
  }

  function startSequencer() {
    filteredSequence = sequence.filter((item) => item.name !== "+");
    turnCounter = 0;
    sequencerActive = true;
  }

  function stopSequencer() {
    sequencerActive = false;
    sequenceSuccess = [true, true, true, true];
  }

  blockNumber.subscribe((newBlock) => {
    if ($entities[$playerAddress].coolDownBlock !== oldCoolDownBlock) {
      operationDuration = $entities[$playerAddress].coolDownBlock - newBlock + 1;
      // Tween value down from operationDuration to 0 over operationDuration seconds
      progress.set(operationDuration, { duration: 0 });
      progress.set(0, { duration: operationDuration * 1000 });

      oldCoolDownBlock = $entities[$playerAddress].coolDownBlock;
    }

    // Execute the next operation if
    // – Sequencer is activated
    // - Cooldown period is over
    // – The blocknumber is odd (HACK)
    if (sequencerActive && newBlock + 1 > $entities[$playerAddress].coolDownBlock && newBlock % 2) {
      console.log("!!!!!!", newBlock, $entities[$playerAddress]?.coolDownBlock);
      activeOperationIndex = turnCounter % filteredSequence.length;
      sequenceSuccess[activeOperationIndex] = executeOperation(filteredSequence[activeOperationIndex]);
      turnCounter++;
    }
  });
</script>

<div class="ui-operations-editor">
  {#if !sequencerActive && $entities[$playerAddress].coolDownBlock > $blockNumber}
    <div class="cooldown-overlay">
      <div>In cooldown for <strong>{$entities[$playerAddress].coolDownBlock - $blockNumber}</strong> seconds</div>
    </div>
  {/if}
  <div class="operation-grid">
    {#each sequence as operation, index}
      <div class="slot-container" class:hidden={sequencerActive && operation.category == "empty"}>
        <div
          class="slot {operation.category}"
          class:failure={!sequenceSuccess[index]}
          class:active={sequencerActive && activeOperationIndex == index}
        >
          <div class="operation-info">
            <div class="operation-name">
              {operation.name}
            </div>
          </div>

          {#if activeOperationIndex == index && operation.category !== "empty"}
            <div class="operation-progress">
              {#if $entities[$playerAddress].coolDownBlock - $blockNumber > 0 && $progress > 0}
                <div>
                  <progress value={$progress} max={operationDuration} />
                </div>
                <div>
                  <strong>
                    {$entities[$playerAddress].coolDownBlock - $blockNumber} seconds
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
    {#if !sequencerActive}
      {#if sequence.filter((item) => item.name !== "+").length == 0}
        <div>Click <strong>operations</strong> below to add to sequencer.</div>
      {:else}
        <button on:click={clearSequencer}>Clear sequencer</button>
        <button on:click={startSequencer}>Start sequencer</button>
      {/if}
    {/if}
    {#if sequencerActive}
      <button on:click={stopSequencer}>Stop sequencer</button>
    {/if}
  </div>

  <div class="inventory" class:disabled={sequencerActive}>
    {#each operations as operation}
      <div
        class="operation {operation.category}"
        on:click={() => {
          addToSequencer(operation);
        }}
      >
        {operation.name}
      </div>
    {/each}
  </div>
</div>

<style>
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

  .operation-name {
    color: var(--foreground);
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

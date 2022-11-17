<script lang="ts">
  import { blockNumber } from "../stores/network";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { operations, Operation } from "../operations/";
  import { tweened } from "svelte/motion";

  const progress = tweened(0);

  let sequencerActive = false;
  let turnCounter = 0;
  let activeOperationIndex = 0;
  let filteredSequence: Operation[];

  const emptyOperation: Operation = {
    name: "+",
    category: "empty",
    f: () => false,
  };

  let sequenceSuccess = [true, true, true, true];

  let sequence: Operation[] = [emptyOperation, emptyOperation, emptyOperation, emptyOperation];

  function executeOperation(operation: Operation) {
    if (operation) {
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
  <div class="operation-grid">
    {#each sequence as operation, index}
      <div class="slot-container" class:hidden={sequencerActive && operation.category == "empty"}>
        <div
          class="slot {operation.category}"
          class:failure={!sequenceSuccess[index]}
          class:active={sequencerActive && activeOperationIndex == index}
        >
          <div>
            {operation.name}
            {#if sequencerActive && activeOperationIndex == index}
              <strong>
                {#if $entities[$playerAddress].coolDownBlock - $blockNumber >= 0}
                  {$entities[$playerAddress].coolDownBlock - $blockNumber}
                {/if}
              </strong>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="sequencer-controls">
    {#if !sequencerActive && sequence.filter((item) => item.name !== "+").length > 0}
      <button on:click={clearSequencer}>Clear sequencer</button>
      <button on:click={startSequencer}>Start sequencer</button>
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
    margin-bottom: 10px;
    display: block;
    margin-right: 5px;
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
    opacity: 0.7;
  }

  .operation:hover {
    opacity: 1;
  }

  .slot-container {
    display: inline-block;
    width: 100px;
    margin-right: 30px;
  }

  .slot {
    width: 100px;
    height: 100px;
    display: inline-block;
    text-align: center;
    line-height: 100px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid transparent;
  }

  .hidden {
    opacity: 0;
  }

  .slot-progress {
    font-size: 9px;
    text-align: center;
    margin-top: 5px;
  }

  .operation-grid {
    margin-top: 10px;
    background: grey;
    padding: 10px;
    margin-bottom: 10px;
  }

  .sequencer-controls {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    height: 40px;
  }

  .failure {
    background: red;
  }

  .active {
    border: 2px solid black;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte"
  import { playSound } from "../../../../../howler";
  import { tooltip } from "../UIToolTip/index";
  import { operations, Operation } from "../../../../operations/";
  import { uiState } from "../../../../stores/ui";
  import {
    sequence,
    SequenceElement,
    emptySequenceElement,
    SEQUENCER_LENGTH,
    submitSequence,
    stopSequencer,
    sequencerActive,
  } from "../../../../stores/sequence";

  const categories = [...new Set(operations.map((op) => op.category))];

  let localSequence: SequenceElement[] = Array(SEQUENCER_LENGTH);
  localSequence.fill(emptySequenceElement);

  function clear() {
    playSound("error", "ui");
    localSequence = Array(SEQUENCER_LENGTH);
    localSequence.fill(emptySequenceElement);
  }

  function submit() {
    playSound("selectTwo", "ui");
    // Remove empty sequence elements before submitting
    submitSequence(localSequence.filter((item) => item.operation.name !== "+"));
    uiState.alter("compulsions", "active", false);
  }

  function stop() {
    stopSequencer();
  }

  function add(operation: Operation) {
    playSound("item", "ui");
    for (let i = 0; i < SEQUENCER_LENGTH; i++) {
      // Add operation to first free slot
      if (localSequence[i].operation.name == "+") {
        localSequence[i] = { operation: operation, success: true };
        break;
      }
    }
  }

  onMount(() => {
    if ($sequence) {
      $sequence.forEach(s => {
        add(s.operation)
      })
    }
  })
</script>

<div class="ui-operations-editor">
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
      <div class="information">Click <strong>operations</strong> below to add to sequencer.</div>
    {:else}
      <button class="action warning" on:click={clear}>Clear sequence</button>
      {#if !$sequencerActive}
        <button class="action success" on:click={submit}>Submit sequence</button>
      {:else}
        <button class="action failure" on:click={stop}>Stop current sequence</button>
      {/if}
    {/if}
  </div>

  <!-- INVENTORY -->
  <div
    class="inventory"
    class:disabled={localSequence.filter((item) => item.operation.name !== "+").length >= SEQUENCER_LENGTH}
  >
    {#each categories as category}
      <div class="category">
        <span class="operation blank">
          {category}
        </span>
        {#each operations.filter((o) => o.category === category) as operation}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            title={operation.description}
            data-description={operation.cost}
            use:tooltip
            on:mouseenter={() => {
              playSound("cursor", "ui");
            }}
            class="operation {operation.category} action-filled"
            on:click={() => {
              add(operation);
            }}
          >
            {operation.name}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .ui-operations-editor {
    color: black;
  }

  .information {
    color: white;
  }

  button {
    display: block;
    margin-right: 5px;
    user-select: none;
  }

  .blank {
    color: var(--foreground);
    opacity: 1 !important;
    text-align: center;
    width: 80px;
    border: var(--outer-border);
  }
  .move {
    background: var(--move);
  }

  .gather {
    background: var(--gather);
  }

  .consume {
    background: var(--consume);
  }

  .burn {
    background: var(--burn);
  }

  .play {
    background: var(--play);
  }

  .special {
    background: var(--special);
  }

  .gate {
    background: var(--gate);
  }

  .empty {
    background: var(--empty);
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

  .operation-grid {
    margin-top: 10px;
    background: grey;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    gap: var(--row-gap);
    flex-flow: row wrap;
  }

  .sequencer-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
  }

  .ui-operations-editor {
    position: relative;
  }

  .operation-info {
    text-align: center;
  }

  .category {
    display: inline-block;
  }
</style>

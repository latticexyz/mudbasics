<script lang="ts">
  import { onMount } from "svelte";
  import { narrative, logReady, directToLog, LogEntryType, banter, tale } from "../../../stores/narrative";
  import { playerAddress, player } from "../../../stores/player";
  import { speed } from "../../../stores/ui";
  import { fade } from "svelte/transition";

  function logEntryTypeToClass(messageType: LogEntryType) {
    if (messageType == LogEntryType.Failure) return "failure";
    if (messageType == LogEntryType.Success) return "success";
    if (messageType == LogEntryType.Banter) return "banter";
    return "";
  }

  onMount(async () => {
    setTimeout(() => {
      logReady.set(true);
      directToLog("It is night.");
      directToLog("You hear something in the darkness...")
    }, 2000);
  });
</script>

<div class="ui-memory">
  <div class="inner-log">
    {#each $narrative as logEntry, i (logEntry.id)}
      <div transition:fade={{ duration: $speed }} class:player={logEntry.address == $playerAddress}>
        <span class="block-number">({logEntry.blockNumber})</span>
        <span class={logEntryTypeToClass(logEntry.messageType)}>{logEntry.message}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .block-number {
    font-size: 9px;
  }

  .player {
    color: var(--blue);
  }

  .inner-log {
    overflow-y: auto;
  }

  .failure {
    color: var(--failure);
  }

  .success {
    color: var(--success);
  }

  .banter {
    opacity: 0.5;
  }
</style>

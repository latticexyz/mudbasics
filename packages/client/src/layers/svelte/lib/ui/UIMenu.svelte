<script>
  import { playSound } from "../../../howler";
  import { player } from "../../stores/player";
  import { menuVisible, uiState } from "../../stores/ui";
  import { fade } from "svelte/transition";
  import { speed, fragSpeed } from "../../stores/ui";

  const ids = ['text-log', 'leaderboard', 'fires', 'grid-map']

  const toggle = () => {
    playSound("cursor", "ui");
    $menuVisible = !$menuVisible;
  };

  const handleShortcuts = ({ code }) => {
    if (code === 'Escape') {
      if ($menuVisible) {
        toggle()
      }
    }
    if (code === 'KeyM') {
      uiState.toggle('text-log', 'active')
    }
    if (code === 'KeyL') {
      uiState.toggle('leaderboard', 'active')
    }
    if (code === 'KeyF') {
      uiState.toggle('fires', 'active')
    }
    if (code === 'KeyS') {
      uiState.toggle('grid-map', 'active')
    }
  }

  function shortcut (item) {
    if (ids.includes(item.id)) {
      return `(${item.title[0].toLowerCase()})`
    }
    return ''
  }
</script>

<svelte:window on:keydown={handleShortcuts}></svelte:window>

{#if $player}
  <div class="ui-menu-container" class:open={$menuVisible}>
    <button class="ui-button" on:click={toggle}>Senses</button>

    {#if $menuVisible}
      <ul class="ui-menu">
        {#each Object.values($uiState) as item, i (item.id)}
          {#if !item.options.persistent && !item.options.hidden}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
              in:fade={{ duration: $speed + $fragSpeed * i }}
              class="ui-menu-item"
              on:click={() => {
                uiState.toggle(item.id, "active");
              }}
            >
              [{item.active ? "x" : "/"}] {item.title} {shortcut(item)}
            </li>
          {/if}
        {/each}
      </ul>
    {/if}
  </div>
{/if}

<style>
  .ui-menu-container {
    position: fixed;
    top: var(--row-gap);
    left: var(--row-gap);
    border: var(--outer-border);
    z-index: 9;
    transition: all 0.2s ease-out;
    height: var(--taskbar-height);
    width: 70px;
    /* background-color: rgba(var(--background-rgb), var(--muted-opacity)); */
    backdrop-filter: var(--backdrop);
    user-select: none;
  }
  .ui-menu-container.open {
    width: 200px;
    height: 140px;
    /* position: fixed; */
  }

  .ui-button {
    all: unset;
    box-sizing: border-box;
    padding: var(--padding-button);
    /* height: auto; */
    cursor: pointer;
    font-weight: bold;
  }

  .ui-menu {
    all: unset;
    display: block;
    cursor: pointer;
    list-style-type: none;
    z-index: 999;
    padding: var(--padding-button);
    font-weight: bold;
    overflow-x: hidden;
  }

  .ui-menu-item {
    white-space: nowrap;
  }
</style>

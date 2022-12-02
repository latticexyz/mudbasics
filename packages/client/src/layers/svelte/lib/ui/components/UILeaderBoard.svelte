<script lang="ts">
  import { flip } from "svelte/animate";
  import { derived } from "svelte/store";
  import { cubicInOut as easing } from "svelte/easing";
  import { players } from "../../../stores/entities";
  import { category } from "../../../stores/ui";
  import { seedToName } from "../../../utils/name";

  export let autoplay = 2500;
  // let interval;
  let i = 0;

  const mappings = {
    gluttony: "eaten",
    arson: "burnt",
    exploration: "traveled",
    hoarding: "gathered",
  };

  const rankedPlayers = derived([players, category], ([$players, $category]) => {
    const arr = [...$players];
    if (arr.every((p) => p?.stats)) {
      arr.sort((a, b) => b.stats[mappings[$category]] - a.stats[mappings[$category]]);
    }
    return arr;
  });

  // if (autoplay) {
  //   play()
  // }

  // function play () {
  //   interval = setInterval(next, 3000)
  // }

  // function pause () {
  //   if (autoplay) {
  //     clearInterval(interval)
  //     setTimeout(play, 5000)
  //   }
  // }

  // function next() {
  //   const entries = Object.entries(mappings);
  //   const index = i++ % entries.length;
  //   $category = entries[index][0];
  // }

  function pick(cat: string) {
    // pause()
    i = Object.keys(mappings).indexOf(cat);
    $category = cat;
  }
</script>

<div class="ui-categories">
  {#each Object.keys(mappings) as cat}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span on:click={() => pick(cat)} class="link" class:active={cat === $category}>
      {cat}
    </span>
  {/each}
</div>

<div class="ui-stats">
  <div class="ranks">
    {#each $rankedPlayers as player, i (player.seed + i)}
      <div class="ui-stat-row">
        <span class="ui-stat-rank">{++i}</span>
      </div>
    {/each}
  </div>
  <div class="players">
    {#each $rankedPlayers as player, i (player.seed + i)}
      <div animate:flip={{ duration: 400, easing }} class="ui-stat-row">
        <span class="ui-stat-player">{seedToName(player.seed)}</span>
      </div>
    {/each}
  </div>
  <div class="scores">
    {#each $rankedPlayers as player, i (player.seed + i)}
      <div class="ui-stat-row">
        <span>{player.stats ? player.stats[mappings[$category]] : ""}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .ui-stats {
    display: flex;
    gap: 8px;
    padding-bottom: var(--row-gap);
  }
  .ui-categories {
    position: sticky;
    width: 100%;
    left: 0;
    top: 0;
    padding-bottom: 6px;
    backdrop-filter: var(--backdrop);
    display: flex;
    justify-content: space-between;
  }
  .ui-category {
    opacity: var(--muted-opacity);
    cursor: pointer;
    text-align: center;
  }
  .ui-stat-row {
    height: var(--font-size-large);
  }

  .ui-stat-rank {
    /* text-align: right; */
    opacity: var(--muted-opacity);
  }

  .ui-stat-player {
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
  }

  .ui-stat-rank {
    width: 20px;
    display: inline-block;
  }
</style>

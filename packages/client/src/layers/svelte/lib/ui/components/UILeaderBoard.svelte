<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import { cubicInOut as easing } from "svelte/easing";
  import { entities } from "../../../stores/entities";
  import { playerAddress } from "../../../stores/player";
  import { seedToName } from "../../../utils/name";

  let interval;
  let picked = "gluttony";

  class Minion {
    constructor(n) {
      this.name = n;
      this.traveled = 0;
      this.gathered = 0;
      this.burnt = 0;
      this.eaten = 0;
    }
  }

  function butcher() {
    const copy = [...minions.map((m) => ({ ...m }))];
    const randy = (direction) => direction * Math.floor(Math.random() * 100);

    minions = minions.map((player) => {
      player.traveled += randy(Math.floor(Math.random() * 3) - 1);
      player.gathered += randy(Math.floor(Math.random() * 3) - 1);
      player.burnt += randy(Math.floor(Math.random() * 3) - 1);
      player.eaten += randy(Math.floor(Math.random() * 3) - 1);

      return player;
    });

    minions = [...rank(minions, picked)];
    history = copy;
  }

  const mappings = {
    gluttony: "eaten",
    arson: "burnt",
    exploration: "traveled",
    hoarding: "gathered",
  };

  // $: {console.log($entities.map($entity => $entity.stats))}
  // $: console.log($entities[$playerAddress].stats)

  const dummy = (name: string) => new Minion(name);

  let minions = [
    // {...dummy('One')},
    // {...dummy('Flew')},
    // {...dummy('Over')},
    // {...dummy('The Cuckoo Has A Long Name')},
    // {...dummy('sNest')},
    // {...dummy('All')},
    // {...dummy('Work')},
    // {...dummy('AndNo')},
    // {...dummy('Play')},
    // {...dummy('Make')},
    // {...dummy('Timmy')},
    // {...dummy('AHappy')},
    // {...dummy('Camper')},
    // {...dummy('121The Cuckoo Has A Long Name')},
    // {...dummy('sN232est')},
    // {...dummy('Al4l')},
    // {...dummy('Wo5rk')},
    // {...dummy('An6dNo')},
    // {...dummy('Pl7ay')},
    // {...dummy('Ma8ke')},
    // {...dummy('Ti9mmy')},
    // {...dummy('AH0appy')},
    // {...dummy('Cam000per')}
  ];
  let history = [...minions];

  function pick(cat) {
    picked = cat;
    butcher();
  }

  function getDevelopment(i) {
    const player = minions[i];
    return player[mappings[picked]] - history.find((m) => m.name === player.name)[mappings[picked]];
  }

  const rank = (arr, category) => {
    const key = mappings[category];
    const result = [...arr].sort((a, b) => {
      return b[key] - a[key];
    });
    return result;
  };

  // onMount(() => {
  //   interval = setInterval(butcher, 2500);
  // });

  // onDestroy(() => clearInterval(interval));
</script>

<div class="ui-categories">
  {#each Object.keys(mappings) as category}
    <span on:click={() => pick(category)} class="ui-category" class:active={category === picked}>
      {category}
    </span>
  {/each}
</div>

<!-- {#each Object.entries($entities) as [address, entity], i (seedToName(address))}
  {address}
  {entity}
{/each} -->

<div class="ui-stats">
  <div class="ranks">
    {#each Object.entries($entities) as [address, entity], i (address)}
      <div class="ui-stat-row">
        <span class="ui-stat-rank">{++i}</span>
      </div>
    {/each}
  </div>
  <div class="players">
    {#each Object.entries($entities) as [address, entity], i (address)}
      <div animate:flip={{ duration: 400, easing }} class="ui-stat-row">
        <span class="ui-stat-player">{seedToName(entity.seed)}</span>
      </div>
    {/each}
  </div>
  <div class="scores">
    {#each Object.entries($entities) as [address, entity], i (address)}
      <div class="ui-stat-row">
        <span>{entity.stats ? entity.stats[mappings[picked]] : ""}</span>
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
    padding: 6px 0;
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
  .ui-category.active {
    opacity: 1;
  }

  .ui-stat-rank {
    text-align: right;
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

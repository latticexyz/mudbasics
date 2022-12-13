<script lang="ts">
  import { startEnvironmentSoundSystem, startMelodySoundSystem, startHarmonySoundSystem } from "../howler";
  import { onMount } from "svelte";
  import { bootGame } from "./boot";
  import UIContainer from "./lib/ui/UIContainer.svelte";
  import UIMenu from "./lib/ui/UIMenu.svelte";
  import {
    createPositionSystem,
    createEnergySystem,
    createResourceSystem,
    createCoolDownSystem,
    createSeedSystem,
    createEntityTypeSystem,
    createCreatorSystem,
    createStatsSystem,
    createBirthSystem,
    createCannibalSystem,
    createLoadingStateSystem,
    createPlayingSystem,
    createDeathSystem,
  } from "./systems";
  import { network as networkStore, blockNumber, startBlock } from "./stores/network";

  onMount(async () => {
    const layers = await bootGame();

    // ---- Systems
    createPositionSystem(layers.network);
    createEnergySystem(layers.network);
    createResourceSystem(layers.network);
    createCoolDownSystem(layers.network);
    createSeedSystem(layers.network);
    createEntityTypeSystem(layers.network);
    createCreatorSystem(layers.network);
    createStatsSystem(layers.network);
    createBirthSystem(layers.network);
    createCannibalSystem(layers.network);
    createLoadingStateSystem(layers.network);
    createPlayingSystem(layers.network);
    createDeathSystem(layers.network);

    networkStore.set(layers.network);

    layers.network.txReduced$.subscribe((x) => {
      console.log("TX", x);
    });

    startEnvironmentSoundSystem();
    // startMelodySoundSystem();
    startHarmonySoundSystem();

    layers.network.network.blockNumber$.subscribe((x) => {
      blockNumber.set(x);
      if ($startBlock == 0) {
        startBlock.set(x);
      }
    });
  });
</script>

<UIMenu />

<main>
  <UIContainer />
</main>

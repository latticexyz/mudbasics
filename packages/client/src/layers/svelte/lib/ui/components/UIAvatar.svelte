<script lang="ts">
  import { playSound } from "../../../../howler";
  import UIMetric from "./UIMetric.svelte";
  import { Activities, activityToVerb, player, playerActivity } from "../../../stores/player";
  import { seedToName, seedToMask } from "../../../utils/name";
  import { EntityType } from "../../../stores/entities";

  let activitySound = {};

  playerActivity.subscribe((activity) => {
    if (activitySound.volume && activitySound.playing()) {
      activitySound.stop();
    }

    if (activity === Activities.Moving) {
      activitySound = playSound("walking", "activity", true);
    }
    if (activity === Activities.Eating) {
      activitySound = playSound("eating", "activity", true);
    }
    if (activity === Activities.Gathering) {
      activitySound = playSound("digging", "activity", true);
    }
    if (activity === Activities.Burning) {
      activitySound = playSound("fire", "environment", true);
    }
    if (activity === Activities.Idle) {
      activitySound = playSound("idle", "activity", true);
    }
    if (activity === Activities.Playing) {
      activitySound = playSound(String(seedToMask($player.seed || 0)), "play", true);
    }
    if (activity === Activities.Dead) {
      activitySound = playSound("death", "ui");
    }
  });
</script>

<div class="ui-avatar">
  <div
    class="ui-avatar-header"
    class:overlay={$player.entityType == EntityType.Corpse}
    class:corpse={$player.entityType == EntityType.Corpse}
  >
    <div class="name">
      {seedToName($player.seed)}
    </div>
    <div class="activity">
      {#if $player.entityType == EntityType.Corpse}
        (dead)
      {:else}
        ({activityToVerb($playerActivity)})
      {/if}
    </div>
  </div>

  <div class="resources">
    <UIMetric label="Energy" key="energy" />
    <UIMetric label="Sludge" key="resource" />
  </div>

  <div class="ui-avatar-video">
    <!-- CHARACTER -->
    {#if $player.entityType == EntityType.Corpse}
      <video src={"/animations/" + seedToMask($player.seed) + "/Die.mp4"} autoplay muted />
    {:else if $playerActivity === Activities.Moving}
      <video src={"/animations/" + seedToMask($player.seed) + "/Walk.mp4"} autoplay muted loop />
    {:else if $playerActivity === Activities.Eating}
      <video src={"/animations/" + seedToMask($player.seed) + "/Eat.mp4"} autoplay muted loop />
    {:else if $playerActivity === Activities.Gathering}
      <video src={"/animations/" + seedToMask($player.seed) + "/Gather.mp4"} autoplay muted loop />
    {:else if $playerActivity === Activities.Burning}
      <video src={"/animations/" + seedToMask($player.seed) + "/Fire.mp4"} autoplay muted loop />
    {:else if $playerActivity === Activities.Playing}
      <video src={"/animations/" + seedToMask($player.seed) + "/Play.mp4"} autoplay muted loop />
    {:else if $playerActivity === Activities.Dead}
      <video src={"/animations/" + seedToMask($player.seed) + "/Die.mp4"} autoplay muted />
    {:else}
      <video src={"/animations/" + seedToMask($player.seed) + "/Idle.mp4"} autoplay muted loop />
    {/if}
  </div>
</div>

<style>
  .activity {
    text-align: center;
    width: 100%;
    grid-column: 1 / 3;
  }

  .ui-avatar {
    position: relative;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: stretch;
  }

  .ui-avatar-video {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .ui-avatar-header {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
    gap: 4px;
    position: relative;
  }

  .ui-avatar-header:after {
    background-size: contain !important;
    background-repeat: no-repeat;
  }

  .name {
    /* font-size: var(--font-size-large); */
    text-align: center;
    grid-column: 1 / 3;
    /* font-weight: bold; */
  }
</style>

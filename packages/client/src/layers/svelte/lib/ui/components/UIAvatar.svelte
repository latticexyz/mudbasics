<script lang="ts">
  import UIMetric from "./UIMetric.svelte";
  import { Activities, activityToVerb, player, playerActivity } from "../../../stores/player";
  import { seedToName, seedToMask } from "../../../utils/name";
  import { EntityType } from "../../../utils/space";
</script>

<div class="ui-avatar">
  <div class="ui-avatar-header">
    <div class="name">
      {#if $player.entityType == EntityType.Corpse}💀 {/if}{seedToName($player.seed)}
    </div>
    <div class="activity">
      {#if $player.entityType == EntityType.Corpse}
        (dead)
      {:else}
        ({activityToVerb($playerActivity)})
      {/if}
    </div>
    <div class="resources">
      <UIMetric label="Energy" key="energy" />
      <UIMetric label="Resource" key="resource" />
    </div>
  </div>

  <!-- CHARACTER -->
  {#if $playerActivity === Activities.Moving}
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
    <video src={"/animations/" + seedToMask($player.seed) + "/Die.mp4"} autoplay muted loop />
  {:else}
    <video src={"/animations/" + seedToMask($player.seed) + "/Idle.mp4"} autoplay muted loop />
  {/if}
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
  }

  .ui-avatar-background {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  video {
    /* height: 100%;
    width: 100%;
    object-fit: cover; */
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .ui-avatar-header {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
    /* align-items: start; */
    gap: 4px;
  }

  .name {
    /* font-size: var(--font-size-large); */
    text-align: center;
    grid-column: 1 / 3;
    /* font-weight: bold; */
  }

  .resources {
    grid-column: 1 / 3;
    align-self: start;
  }
</style>

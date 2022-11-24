<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { seedToName } from "../utils/name";
  import { EntityType } from "../utils/space";
  import { shortenAddress } from "../utils/ui";
  import { blockNumber } from "../stores/network";
  import { uniq } from "lodash";

  const SECONDS_IN_DAY = 86400;

  let clockTime: number;
  $: clockTime = Math.floor((($blockNumber % 3600) / 3600) * SECONDS_IN_DAY);

  function isNight(date: Date) {
    return date.getHours() > 17 || date.getHours() < 9;
  }

  function formatTime(seconds: number) {
    let currentTime = new Date(seconds * 1000);
    return (isNight(currentTime) ? "🌙 " : "🌞 ") + currentTime.toISOString().substr(11, 8);
  }
</script>

<div class="ui-debug-log">
  <div class="clock-time">World time: {formatTime(clockTime)}</div>
</div>

<style>
  .player {
    color: var(--blue);
  }
</style>

<script lang="ts">
  import { blockNumber } from "../../stores/network";

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

<div class="ui-clock">
  <div class="clock-time">{formatTime(clockTime)} ({$blockNumber})</div>
</div>

<style>
  .ui-clock {
    border: 1px solid white;
    padding: 5px;
  }
</style>

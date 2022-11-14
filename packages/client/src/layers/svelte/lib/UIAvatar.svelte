<script lang="ts">
  import { playerAddress } from "../stores/player";
  import { entities } from "../stores/entities";
  import { seedToName } from "../utils/name";
</script>

<div class="ui-avatar">
  <img src="/img/avatar-placeholder.jpg" alt="Avatar" />
  <div><strong>{seedToName($entities[$playerAddress].seed)}</strong></div>
  <div class="large-indicator">
    <div class="label">Energy</div>
    <div class="value">{$entities[$playerAddress].energy}</div>
  </div>
  <div class="large-indicator">
    <div class="label">Resource</div>
    <div class="value">{$entities[$playerAddress].resource}</div>
  </div>
</div>

<style>
  .ui-avatar {
    /* height: 400px; */
  }

  img {
    max-width: 100%;
  }

  .large-indicator {
    display: flex;
    width: 100%;
    border: 1px solid black;
    text-align: center;
    height: 60px;
    line-height: 60px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .label {
    background: black;
    color: white;
    width: 30%;
  }

  .value {
    font-size: 2em;
    width: 70%;
  }
</style>

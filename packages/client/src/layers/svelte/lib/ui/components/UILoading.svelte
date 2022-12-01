<script lang="ts">
  import { loadingMessage } from "../../../stores/network";
</script>

<div class="ui-loading">
  <div class="introduction-text">This is not earth<br />...this is another world</div>
  <div class="loading-message">{$loadingMessage}</div>
</div>

<style>
  .ui-loading {
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .loading-message {
    margin-top: 1em;
    opacity: 0.5;
  }
</style>

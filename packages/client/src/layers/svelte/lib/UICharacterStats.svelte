<script lang="ts">
  import { playerAddress } from "../stores/player";
  import { shortenAddress } from "../utils/ui";
</script>

<div class="ui-character-stats">
  <div>{shortenAddress($playerAddress)}</div>
</div>

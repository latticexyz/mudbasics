<script lang="ts">
  import { playerAddress } from "../stores/player";
  import { entities } from "../stores/entities";
  import { seedToName } from "../utils/name";
</script>

<div class="ui-avatar">
  <img src="/img/avatar-placeholder.jpg" alt="Avatar" />
  <div><strong>{seedToName($entities[$playerAddress].seed)}</strong></div>
</div>

<style>
  .ui-avatar {
    /* height: 400px; */
  }

  img {
    max-width: 100%;
  }
</style>

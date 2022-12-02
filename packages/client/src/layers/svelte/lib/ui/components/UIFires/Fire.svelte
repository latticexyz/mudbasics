<script>
  import { fireString } from "./index"
  import { blockNumber } from "../../../../stores/network";
  export let address
  export let value

  const f = fireString(value)
</script>

{$f}
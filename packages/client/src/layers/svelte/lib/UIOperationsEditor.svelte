<script lang="ts">
    import {layers} from '../stores/layers'

    console.log($layers)

    let randomMovementActive =  false
    let randomMovementInterval = {}

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function toggleRandomMovement() {
        if(randomMovementActive) {
            clearInterval(randomMovementInterval);
            randomMovementActive = false
        } else {
            randomMovementInterval = setInterval(() => {
                console.log("move");
                $layers.network.api.move({ x: getRandomInt(0, 10), y: getRandomInt(0, 10) });
            }, 1000);
            randomMovementActive = true
        }
    }

</script>

<div class="ui-text-log">
    <button on:click={toggleRandomMovement}>{randomMovementActive ? 'Stop' : 'Start'} random movement</button>
</div>
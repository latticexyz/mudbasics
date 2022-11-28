import { writable, get } from "svelte/store";
import { tweened } from "svelte/motion";
import { Operation } from "../operations/";
import { blockNumber } from "./network";
import { player } from "./player";

export interface SequenceElement {
  operation: Operation;
  success: boolean;
}

export const emptySequenceElement: SequenceElement = {
  operation: {
    name: "+",
    category: "empty",
    description: "",
    f: () => false,
  },
  success: true,
};

export const SEQUENCER_LENGTH = 5;

export const sequence = writable([] as SequenceElement[]);

export const sequencerActive = writable(false);
export const activeOperationIndex = writable(0);
export const progress = tweened(0);
export const operationDuration = writable(0);

let oldCoolDownBlock = 0;
let turnCounter = 0;
let blockDelay = 0;

export function submitSequence(newSequence: SequenceElement[]) {
  sequence.set(newSequence);
}

export function startSequencer() {
  turnCounter = 0;
  sequencerActive.set(true);
}

export function stopSequencer() {
  sequencerActive.set(false);
  sequence.update((s) => {
    for (let i = 0; i < s.length; i++) {
      s[i].success = true;
    }
    return s;
  });
}

export function clearSequencer() {
  sequence.set([]);
}

function executeOperation(sequenceElement: SequenceElement) {
  if (sequenceElement) {
    console.log("====> executing operation:", sequenceElement.operation.name);
    return sequenceElement.operation.f();
  } else {
    stopSequencer();
    return false;
  }
}

blockNumber.subscribe((newBlock) => {
  if (get(player)) {
    // If cooldown block changed
    if (get(player).coolDownBlock !== oldCoolDownBlock) {
      // Block to cooldown is (current block + 1) - cooldown block
      operationDuration.set((get(player).coolDownBlock || 0) - newBlock + 1);
      // Tween value down from operationDuration ...
      progress.set(get(operationDuration), { duration: 0 });
      // ... to 0 over operationDuration seconds
      progress.set(0, { duration: get(operationDuration) * 1000 });
      // Store cooldown block for future reference
      oldCoolDownBlock = get(player).coolDownBlock || 0;
    }

    // Execute the next operation if
    // – Sequencer is active
    // - Cooldown period is over
    // - Arbitrary block delay
    if (get(sequencerActive) && newBlock > (get(player).coolDownBlock || 0) && blockDelay % 4 == 0) {
      activeOperationIndex.set(turnCounter % get(sequence).length);

      const outcome = executeOperation(get(sequence)[get(activeOperationIndex)]);

      if (get(sequence)[get(activeOperationIndex)].operation.category === "gate") {
        // If current operation is a gate
        // – proceed if returning true
        // – start from beginning if return false
        turnCounter = outcome ? turnCounter + 1 : 0;
      } else {
        turnCounter++;
      }

      sequence.update((s) => {
        if (s[get(activeOperationIndex)].operation.category !== "gate") {
          s[get(activeOperationIndex)].success = outcome;
        }
        return s;
      });
    }

    blockDelay++;
  }
});

import { initialState } from "./config";
import { writable } from "svelte/store";

// Utilities
const makeDelay = () => 500 + Math.floor(Math.random() * 2000);

// UI
export const menuVisible = writable(false);

// Transition speeds
export const speed = writable(100);
export const fragSpeed = writable(140);
export const category = writable("gluttony");

// Create custom store with simpler update methods
function createComponentState() {
  const { subscribe, set, update } = writable(initialState());

  // Update function
  const alter = (id, key, value) =>
    update((obj) => {
      const exists = !!obj?.[id];
      if (exists) {
        obj[id][key] = value;
      }
      return obj;
    });

  // Update function
  const toggle = (id, key) =>
    update((obj) => {
      const exists = !!obj?.[id];
      if (exists) {
        obj[id][key] = !obj[id][key];
      }
      return obj;
    });

  return {
    subscribe,
    set,
    // Store function
    alter,
    toggle,
    close: (id: string) => {
      alter(id, "active", false);
    },
    open: (id: string) => {
      alter(id, "active", true);
    },
    toggleMute: (id: string) => {
      toggle(id, "muted");
    },
  };
}

export const uiState = createComponentState();

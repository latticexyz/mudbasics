import { writable } from "svelte/store";

// Components
import UITextLog from "../lib/ui/components/UITextLog.svelte";
import UIAvatar from "../lib/ui/components/UIAvatar.svelte";
import UIMap from "../lib/ui/components/UIMap.svelte";
import UIGridMap from "../lib/ui/components/UIGridMap.svelte";
import UIView from "../lib/ui/components/UIView.svelte";
import UIDebugLog from "../lib/ui/components/UIDebugLog.svelte";
import UILeaderBoard from "../lib/ui/components/UILeaderBoard.svelte";
// --- Operations Editors
import UIPlanner from "../lib/ui/components/UIOperationsEditor/UIPlanner.svelte";
import UIExecutor from "../lib/ui/components/UIOperationsEditor/UIExecutor.svelte";

// Utilities
const makeDelay = () => 500 + Math.floor(Math.random() * 2000);

// UI
export const menuVisible = writable(false);

// Transition speeds
export const speed = writable(100);
export const fragSpeed = writable(140);

const initialState = () => ({
  avatar: {
    id: "avatar",
    title: "Avatar",
    component: UIAvatar,
    active: true,
    delay: 0,
    fluid: true,
    bare: true,
    persistent: true,
    colStart: 2,
    colEnd: 3,
    rowStart: 1,
    rowEnd: 10,
    layer: 0,
  },
  "operations-planner": {
    id: "operations-planner",
    muted: true,
    title: "Operations Planner",
    component: UIPlanner,
    active: true,
    delay: makeDelay(),
    colStart: 1,
    colEnd: 3,
    rowStart: 6,
    rowEnd: 10,
    fluid: true,
  },
  "text-log": {
    id: "text-log",
    active: true,
    delay: makeDelay(),
    muted: false,
    title: "Text Log",
    component: UITextLog,
    fluid: true,
    rowStart: 1,
    rowEnd: 6,
  },
  map: {
    id: "map",
    title: "Map",
    component: UIMap,
    active: false,
    delay: 0,
  },
  "grid-map": {
    id: "grid-map",
    title: "Grid Map",
    component: UIGridMap,
    active: false,
    fluid: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 5,
    rowEnd: 10,
    delay: makeDelay(),
  },
  "debug-log": {
    id: "debug-log",
    title: "Debug Log",
    component: UIDebugLog,
    active: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 5,
    rowEnd: 10,
    // colStart: 3,
    // colEnd: 4,
    // rowStart: 1,
    // rowEnd: 4,
    fluid: true,
    layer: 2,
    delay: 0,
  },
  // leaderboard: {
  //   id: "leaderboard",
  //   title: "Leaderboard",
  //   component: UILeaderBoard,
  //   active: true,
  //   fluid: true,
  //   colStart: 3,
  //   colEnd: 4,
  //   rowStart: 1,
  //   rowEnd: 5,
  //   delay: makeDelay(),
  // },
  "operations-executor": {
    id: "operations-executor",
    title: "Operations Executor",
    component: UIExecutor,
    active: true,
    persistent: true,
    fluid: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 1,
    rowEnd: 5,
    delay: makeDelay(),
  },
  view: {
    id: "view",
    title: "View",
    component: UIView,
    active: false,
    fluid: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 1,
    rowEnd: 5,
    delay: makeDelay(),
  },
});

// Create custom store with simpler update methods
function createComponentState() {
  const { subscribe, set, update } = writable(initialState());

  // Update function
  const alter = (id, key, value) =>
    update((obj) => {
      obj[id][key] = value;
      return obj;
    });

  // Update function
  const toggle = (id, key) =>
    update((obj) => {
      obj[id][key] = !obj[id][key];
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

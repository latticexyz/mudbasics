// Components
import UITextLog from "../lib/ui/components/UITextLog.svelte";
import UIAvatar from "../lib/ui/components/UIAvatar.svelte";
import UIMap from "../lib/ui/components/UIMap.svelte";
import UIGridMap from "../lib/ui/components/UIGridMap.svelte";
import UIView from "../lib/ui/components/UIView.svelte";
import UIDebugLog from "../lib/ui/components/UIDebugLog.svelte";
import UILeaderBoard from "../lib/ui/components/UILeaderBoard.svelte";
import UIFires from "../lib/ui/components/UIFires/UIFires.svelte";
// --- Operations Editors
import UIPlanner from "../lib/ui/components/UIOperationsEditor/UIPlanner.svelte";
import UIExecutor from "../lib/ui/components/UIOperationsEditor/UIExecutor.svelte";

// Utilities
const makeDelay = () => Math.floor(Math.random() * 200);
// const makeDelay = () => 300;

export interface UIComponentOptions {
  delay?: number;
  fluid?: boolean;
  bare?: boolean;
  hidden?: boolean;
  persistent?: boolean;
  muted?: boolean;
  layer?: number;
  noscroll?: boolean;
  span?: boolean;
}

export interface UIComponentPlacement {
  row?: [number, number]; // row start
  col?: [number, number]; // row end
}

export interface UIComponentDefinition {
  active: boolean;
  id: string;
  title: string;
  component: any;
  options?: UIComponentOptions;
  grid?: UIComponentPlacement;
}

// Start
export const initialise = (def: UIComponentDefinition) => {
  return {
    id: def.id,
    active: def.active,
    title: def.title,
    component: def.component,
    options: def?.options,
    grid: def?.grid,
  };
};

export const initialState = () => ({
  // AVATAR
  avatar: initialise({
    id: "avatar",
    title: "Avatar",
    component: UIAvatar,
    grid: {
      col: [2, 3],
      row: [1, 10],
    },
    options: {
      bare: true,
      persistent: true,
      layer: 0,
      fluid: true,
      noscroll: true,
    },
    active: true,
  }),
  // OPS PLANNER
  compulsions: initialise({
    id: "compulsions",
    title: "Compulsions",
    component: UIPlanner,
    active: false,
    options: {
      fluid: true,
      layer: 10,
    },
    grid: {
      col: [1, 4],
      row: [1, 10],
    },
  }),
  // TEXT LOG
  memory: initialise({
    id: "memory",
    title: "Memory",
    component: UITextLog,
    active: true,
    options: {
      fluid: true,
      delay: makeDelay(),
      muted: false,
    },
    grid: {
      row: [1, 6],
      col: [1, 2],
    },
  }),
  // GRID MAP
  "grid-map": initialise({
    id: "grid-map",
    title: "Soil",
    component: UIGridMap,
    active: true,
    options: {
      fluid: true,
      delay: makeDelay(),
      noscroll: true,
    },
    grid: {
      col: [3, 4],
      row: [5, 10],
    },
  }),
  // FIRES
  fires: initialise({
    id: "fires",
    title: "Fires",
    component: UIFires,
    active: false,
    options: {
      fluid: true,
      layer: 5,
    },
    grid: {
      col: [2, 3],
      row: [6, 10],
    },
  }),
  // MAP
  map: initialise({
    id: "map",
    title: "Map",
    component: UIMap,
    active: false,
    options: {
      delay: 0,
      hidden: true,
    },
    grid: {
      col: [1, 2],
      row: [7, 10],
    },
  }),
  "debug-log": initialise({
    id: "debug-log",
    title: "Debug Log",
    component: UIDebugLog,
    active: false,
    options: {
      fluid: true,
      layer: 2,
      delay: 0,
      hidden: true,
    },
    grid: {
      col: [3, 4],
      row: [5, 10],
    },
  }),
  // LEADERBOARD
  leaderboard: initialise({
    id: "leaderboard",
    title: "Leaderboard",
    component: UILeaderBoard,
    active: true,
    options: {
      fluid: true,
      delay: makeDelay(),
      layer: 2,
    },
    grid: {
      col: [1, 2],
      row: [6, 10],
    },
  }),
  //
  executor: initialise({
    id: "executor",
    title: "Compulsions",
    component: UIExecutor,
    active: true,
    options: {
      muted: false,
      persistent: true,
      fluid: true,
      delay: makeDelay(),
    },
    grid: {
      col: [3, 4],
      row: [1, 5],
    },
  }),
  //
  view: initialise({
    id: "view",
    title: "View",
    component: UIView,
    active: false,
    options: {
      fluid: true,
      delay: makeDelay(),
      hidden: true,
    },
    grid: {
      col: [3, 4],
      row: [1, 5],
    },
  }),
});

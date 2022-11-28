// Utilities
const makeDelay = () => 500 + Math.floor(Math.random() * 2000);

// Components
import UITextLog from "../lib/ui/components/UITextLog.svelte";
import UIAvatar from "../lib/ui/components/UIAvatar.svelte";
import UIVisualOperationsEditor from "../lib/ui/components/UIVisualOperationsEditor.svelte";
import UIMap from "../lib/ui/components/UIMap.svelte";
import UIGridMap from "../lib/ui/components/UIGridMap.svelte";
import UIView from "../lib/ui/components/UIView.svelte";
import UIDebugLog from "../lib/ui/components/UIDebugLog.svelte";
import UILeaderBoard from "../lib/ui/components/UILeaderBoard.svelte";

export const initialState = () => ({
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
  "visual-operations-editor": {
    id: "visual-operations-editor",
    muted: true,
    title: "Visual Operations Editor",
    component: UIVisualOperationsEditor,
    active: true,
    delay: makeDelay(),
    colStart: 1,
    colEnd: 3,
    rowStart: 6,
    rowEnd: 10,
    fluid: true,
    // large: true,
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
  },
  leaderboard: {
    id: "leaderboard",
    title: "Leaderboard",
    component: UILeaderBoard,
    active: true,
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

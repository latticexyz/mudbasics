import { registerComponentBrowser } from "./ComponentBrowser";
import { registerActionQueue } from "./ActionQueue";
import { registerLoadingState } from "./LoadingState";

export function registerUIComponents() {
  registerComponentBrowser();
  registerActionQueue();
  registerLoadingState();
}

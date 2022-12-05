import { ComponentUpdate } from "@latticexyz/recs";

export function cannibalism(update: ComponentUpdate, isSelf: boolean) {
  console.log("cannibalsm", update);
  return "A cannibalism occured...";
}

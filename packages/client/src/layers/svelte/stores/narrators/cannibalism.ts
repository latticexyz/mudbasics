import { ComponentUpdate } from "@latticexyz/recs";

export function cannibalism(update: ComponentUpdate, isSelf: boolean) {
  console.log("cannibalsm", update);
  const victim = update.value[0]?.value || [];
  console.log("victim", victim);
  if (victim.length > 0) {
    return "A cannibalism occured...";
  }
  return "";
}

import { defineComponent, Type, World } from "@latticexyz/recs";

export function defineStatsComponent(world: World) {
  return defineComponent(
    world,
    {
      traveled: Type.Number,
      gathered: Type.Number,
      burnt: Type.Number,
      eaten: Type.Number,
    },
    {
      id: "Stats",
      metadata: {
        contractId: "component.Stats",
      },
    }
  );
}

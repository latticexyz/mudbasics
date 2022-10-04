import React from "react";
import { Browser } from "@latticexyz/ecs-browser";
import { registerUIComponent } from "../engine";
import { of } from "rxjs";
export function registerComponentBrowser() {
  registerUIComponent(
    "ComponentBrowser",
    {
      colStart: 10,
      colEnd: 13,
      rowStart: 1,
      rowEnd: 13,
    },
    (layers) => of({ layers }),
    ({ layers }) => {
      const {
        network: { world, dev },
      } = layers;
      return (
        <Browser
          world={world}
          entities={world.entities}
          layers={layers}
          devHighlightComponent={dev.DevHighlightComponent}
          hoverHighlightComponent={dev.HoverHighlightComponent}
          setContractComponentValue={dev.setContractComponentValue}
        />
      );
    }
  );
}

import React from "react";
import { LayerContext, EngineContext } from "./context";
import { EngineStore } from "./store";
import { BootScreen, MainWindow, DesktopWindow, ComponentRenderer } from "./components";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useState } from "react";
import { Layers } from "../../../types";
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserView, MobileView } from 'react-device-detect';

export const Engine: React.FC<{
  setLayers: { current: (layers: Layers) => void };
  mountReact: { current: (mount: boolean) => void };
  customBootScreen?: React.ReactElement;
}> = observer(({ mountReact, setLayers, customBootScreen }) => {
  const [mounted, setMounted] = useState(true);
  const [layers, _setLayers] = useState<Layers | undefined>();

  useEffect(() => {
    mountReact.current = (mounted: boolean) => setMounted(mounted);
    setLayers.current = (layers: Layers) => _setLayers(layers);
  }, []);

  if (!mounted || !layers) return customBootScreen || <BootScreen />;
  
  console.log("🚀 ~ file: Engine.tsx ~ line 26 ~ layers", layers)

  return (
    <>
          <LayerContext.Provider value={layers}>
            <EngineContext.Provider value={EngineStore}>

            {/* <ComponentRenderer /> */}

            <BrowserView>
              <DesktopWindow />
            </BrowserView>
            
              <MobileView>
                <ChakraProvider>
                  <MainWindow />
                </ChakraProvider>
              </MobileView>

            </EngineContext.Provider>
          </LayerContext.Provider>
    </>
  );
});
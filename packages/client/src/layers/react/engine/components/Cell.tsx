import React, { useEffect } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { useLayers } from "../hooks";
import { filter, fromEvent } from "rxjs";

const WINDOW_CLASSNAME = "react-ui-window";

export const Cell: React.FC<{ style: React.CSSProperties }> = observer(({ children, style }) => {

  return (
    <Container
      style={style}
      className={WINDOW_CLASSNAME}
    >
      {children}
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #fff;
`;

import React from "react";
import { observer } from "mobx-react-lite";
import styles from './styles.module.css'

export const DesktopWindow: React.FC = observer(() => {

return (
    <div className={styles.desktop}>
      <img src="/img/eruwhite.png" />
      <h1>Please use Mobile</h1>
    </div>
  )
});

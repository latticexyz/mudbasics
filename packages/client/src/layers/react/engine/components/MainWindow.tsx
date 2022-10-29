import React from "react";
import { observer } from "mobx-react-lite";
import { ComponentRenderer } from "./ComponentRenderer";
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/web'
import styles from './styles.module.css'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'

export const MainWindow: React.FC = observer(() => {
  // return <ComponentRenderer />;
  
  const [style, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))
  const bind = useDrag(({ active, movement: [x, y] }) => {
    api.start({
      x: active ? x : 0,
      y: active ? y : 0,
      scale: active ? 1.2 : 1
    })
  })

  const InnerTrack = () => {
    return (          
    <div className={styles.innerTrack}>
        <p className={styles.digitalNumbers}>
          00:00
        </p>
        <p className={styles.trackName}>
          Soundtrack
        </p>
        <div>
        <ArrowRightIcon color="white" w={5} h={5} className={styles.playstop} />
        </div>
    </div>
    )
  }

  const RotaryElement = ({styleprop}) => {
    return (          
    <div className={styleprop}>
      <a.div tabIndex={-1} {...bind()} className={styles.drag} style={style} />
      <div>
        <p className={styles.trackName}>
          Effect
        </p>
      </div>
    </div>
    )
  }

  const MainButton = () => {
    return (          
    <div >
        <img src="/img/mainBtn.png" className={styles.BottomCenter} />
    </div>
    )
  }


  return (
    <div className={styles.wrapper}>
      <div  className="flex fullscreen" style={{flexDirection: 'column'}}>
        <div className={styles.topWrapper}>         
          <div style={{height: "50vh"}}>
            <ArrowLeftIcon color="white" className={styles.arrowLeft} />
            <div className={styles.circle}>
              <CircularProgress value={100} size='80vw' thickness='2px' color='#C527DF' trackColor='#C527DF' />
            </div>
            <div className={styles.circle}>
              <CircularProgress value={59} size='73vw' thickness='3px' trackColor="transparent" color="#6F6F6F">
                <InnerTrack />
              </CircularProgress>
            </div>
            <ArrowRightIcon color="white" className={styles.arrowRight} />
          </div>
        </div>

        <div className={styles.bottomWrapper}>
            <div style={{height: "50vh"}}>

            <RotaryElement  styleprop={styles.TopLeft} />
            <RotaryElement styleprop={styles.BottomLeft} />
            <RotaryElement styleprop={styles.TopRight}/>
            <RotaryElement styleprop={styles.BottomRight} />
            
            <MainButton />


          </div>
        </div>
      </div>
    </div>
  )
});

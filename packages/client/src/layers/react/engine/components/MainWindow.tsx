import React, {useState} from "react";
import { observer } from "mobx-react-lite";
import { ComponentRenderer } from "./ComponentRenderer";
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/web'
import styles from './styles.module.css'
import { CircularProgress, CircularProgressLabel, CloseButton } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { Web3Modal } from '@web3modal/react'

const config = {
  projectId: "1dbb5ef68df75ff636a45402f1a56657",
  theme: "dark",
  accentColor: "default",
  ethereum: {
    appName: 'web3Modal',
    autoConnect: true
  }
};

export const MainWindow: React.FC = observer(() => {
  // Hooks
  // return <ComponentRenderer />;
  const [mainPressed, setmainPressed] = useState(false)
  const [padPressed, setpadPressed] = useState(false)

  const [style, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))
  const bind = useDrag(({ active, movement: [x, y] }) => {
    api.start({
      x: active ? x : 0,
      y: active ? y : 0,
      scale: active ? 1.2 : 1
    })
  })

  // 
  const _mint = () => {
    
    return;
  }

  const _setBeat = () => {
    
    return;
  }



  // Components
  const InnerTrack = () => {
    return (       
      <CircularProgressLabel>
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
      </CircularProgressLabel>   
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

  const PadComponent = () => {
    return (      
      <div style={{alignContent: 'center'}}>        
        <div className={styles.padBg}>
          <a.div tabIndex={-1} {...bind()} className={styles.dragPad} style={style} />
          <div>
          </div>
        </div>
      </div>    
    )
  }

  const MainButton = () => {
    return (          
    <div>
        {mainPressed ? 
        <>
          <img onClick={_setBeat} src="/img/check.png" className={styles.BottomCenter} />
        </>
        :
        <img onClick={() => setmainPressed(true)} src="/img/mainBtn.png" className={styles.BottomCenter} />
      }
    </div>
    )
  }

  const PadButton = () => {
    return (          
    <div>
      <PlusSquareIcon onClick={() => setpadPressed(e => !e)} color={padPressed ? '#3DF69D' : '#7B7B7B'} className={styles.padButton}/>
    </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div  className="flex fullscreen" style={{flexDirection: 'column'}}>

          <div className={styles.topWrapper}>    
            <div style={{height: "40vh"}}>
            <Web3Modal config={config} />
          </div>     
          </div>     
          
          <div className={styles.topWrapper}>         
            <div style={{height: "40vh"}}>
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
              <div style={{height: "40vh"}}>

                {!padPressed ? <>
                  <RotaryElement  styleprop={styles.TopLeft} />
                  <RotaryElement styleprop={styles.BottomLeft} />
                  <RotaryElement styleprop={styles.TopRight}/>
                  <RotaryElement styleprop={styles.BottomRight} />
                  <MainButton />
                </>
                  :
                  <PadComponent />
                }
              </div>
          </div>
                {mainPressed ?
            <div className={styles.bottomWrapper}>
              <div style={{height: "10vh"}}>
                <CloseButton onClick={() => setmainPressed(false)} color="#3DF69D"/> 
                </div>
              </div>
            :
            <>
            <div className={styles.bottomWrapper}>
              <div style={{height: "10vh"}}>
                <PadButton />
              </div>
            </div>

            <div className={styles.bottomWrapper}>
              <div>
                <img onClick={_mint} src="/img/mintBtn.png" className={styles.mintBtn} />
              </div>
            </div>
          </>
          }
      </div>
    </div>
  )
});

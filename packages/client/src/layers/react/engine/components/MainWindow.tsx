import React, {useState} from "react";
import { observer } from "mobx-react-lite";
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/web'
import styles from './styles.module.css'
import { Box, Text, CircularProgress, CircularProgressLabel, CloseButton } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { Web3Button, useAccount } from '@web3modal/react'
import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'
import { defineQuery, HasValue } from "@latticexyz/recs";
import { map } from "rxjs";

const midi = new Midi()

const shortenAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

const player = new Tone.Player({
  url: "https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3",
  autostart: false,
});
const filter = new Tone.Filter(400, 'lowpass').toDestination();
const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();

// connect the player to the feedback delay and filter in parallel
player.connect(filter);
player.connect(feedbackDelay);

export const MainWindow: React.FC = observer(({layers}) => {
  // Hooks
  const [mainPressed, setmainPressed] = useState(false)
  const [padPressed, setpadPressed] = useState(false)
  const { account } = useAccount()

  const {
    network: {
      world,
      components: { SoundUri },
      network: { connectedAddress },
    },
  } = layers;

  // console.log('======>>>>', layers)
  // layers.network.api.move(0, {x: 10, y: 10})
  // layers.network.api.uploadSound(0, 'ipfs://bafybeiaymn6d3rq55wazujua7dxzirunawa6xff4knct76m6shsnmhjgva/076 Chilled Beat 1 Stick.mid');
  const query = defineQuery([HasValue(SoundUri, { value: "0x06ac366fc06fa398cb0d2d88711c7bb4c80c61b0" })]);

  const responsesss =  query.update$.pipe(map(() => ({ matching: query.matching, world })));
  console.log("🚀 ~ file: MainWindow.tsx ~ line 54 ~ constMainWindow:React.FC=observer ~ responsesss", responsesss)

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
    player.start()
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
        <p className={styles.effectName}>
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
 
          <div style={{height: "10vh"}}>
            {account?.isConnected ? <Box
              bg='rgba(30, 27, 27, 0.8);'
              textAlign='center'
              width="auto"
            >
          {account?.ens && (
            <Text style={{color: 'white'}} fontSize='xs'>{account?.ens}</Text>
            )}
          <Text fontSize='xs' title={account.address} style={{color: 'white'}}>{shortenAddress(account.address)}</Text>
        </Box> : <Web3Button />}
          </div>     
          
          <div className={styles.topWrapper}>         
            <div style={{height: "35vh"}}>
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
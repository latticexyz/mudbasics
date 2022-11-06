import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useDrag } from '@use-gesture/react'
import { a, useSpring } from '@react-spring/web'
import styles from './styles.module.css'
import { Box, Text, CircularProgress, CircularProgressLabel, CloseButton } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon, PlusSquareIcon } from '@chakra-ui/icons'
import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'
import { NFTStorage } from 'nft.storage/dist/bundle.esm.min.js'

const shortenAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

const NFT_API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdlNjM4Q0YwNzJBYjBDNzBCODJkZjFlMTRiNjMwRjQxRWY1M0IwMDQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NzA3MTkyNTk5OSwibmFtZSI6IkV0aExpc2JvbiJ9.3ZOyJgNKgrP_NdRYbFr-9W6dHCe7EqhR72kiKq7497Q';
const client = new NFTStorage({ token: NFT_API_TOKEN })


const player = new Tone.Player({
  url: "https://tonejs.github.io/audio/drum-samples/loops/ominous.mp3",
  autostart: false,
});
const filter = new Tone.Filter(400, 'lowpass').toDestination();
const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();

// connect the player to the feedback delay and filter in parallel
player.connect(filter);
player.connect(feedbackDelay);

export const MainWindow: React.FC = observer(({ layers }) => {
  // Hooks
  const [mainPressed, setmainPressed] = useState(false)
  const [padPressed, setpadPressed] = useState(false)
  const [sound, setSound] = useState(null)

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


  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const entitiedId = [
        '0x96659B31A39b418c3AAf6E3D9E8440c0707a0B28',
        '0xDA66b5A426372642B317c9D6C61604B04Aa1E61a',
        '0x2916a669d75A2b949D1eC635396dFD4922d43Fb5',
        '0xa62AE22c61A4AD04f61c9dD3359a754c393c8Ab2'
      ];

      const entitieObjects = entitiedId.map((ent): string => layers.network.world.components[ent].update$.subscribe(({ entity, value }) => {
        console.log('This updates')
        console.log(entity)
        console.log(value)
        return {
          entity,
          value
        }
      }));
      const instrumentStatus = await client.status(entitieObjects[0])
      console.log("🚀 ~instrumentStatus", instrumentStatus)
      const jsonMidi = await midiToJson(instrumentStatus.metadata)
      console.log("🚀 ~ file: MainWindow.tsx ~ line 79 ~ fetchData ~ jsonMidi", jsonMidi)

    }

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [])



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

  const RotaryElement = ({ styleprop, effect }) => {
    return (
      <div className={styleprop}>
        <a.div tabIndex={-1} {...bind()} className={styles.drag} style={style} />
        <div>
          <p className={styles.effectName}>
            {effect}
          </p>
        </div>
      </div>
    )
  }

  const PadComponent = () => {
    return (
      <div style={{ alignContent: 'center' }}>
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
        <PlusSquareIcon onClick={() => setpadPressed(e => !e)} color={padPressed ? '#3DF69D' : '#7B7B7B'} className={styles.padButton} />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className="flex fullscreen" style={{ flexDirection: 'column' }}>

        <div className={styles.topWrapper}>
          <div style={{ height: "45vh" }}>
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
          <div style={{ height: "40vh" }}>

            {!padPressed ? <>
              <RotaryElement styleprop={styles.TopLeft} effect="Reverb" />
              <RotaryElement styleprop={styles.BottomLeft} effect="Volume" />
              <RotaryElement styleprop={styles.TopRight} effect="Phaser" />
              <RotaryElement styleprop={styles.BottomRight} effect="Vibrato" />
              <MainButton />
            </>
              :
              <PadComponent />
            }
          </div>
        </div>
        {mainPressed ?
          <div className={styles.bottomWrapper}>
            <div style={{ height: "10vh" }}>
              <CloseButton onClick={() => setmainPressed(false)} color="#3DF69D" />
            </div>
          </div>
          :
          <>
            <div className={styles.bottomWrapper}>
              <div style={{ height: "10vh" }}>
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


const midiToJson = async (midiUrl: string | undefined) => {
  // load a midi file in the browser
  const midi = await Midi.fromUrl(midiUrl)
  //the file name decoded from the first track
  const name = midi.name
  //get the tracks
  midi.tracks.forEach(track => {
    //tracks have notes and controlChanges

    //notes are an array
    const notes = track.notes
    notes.forEach(note => {
      //note.midi, note.time, note.duration, note.name
    })

    //the control changes are an object
    //the keys are the CC number
    track.controlChanges[64]
    //they are also aliased to the CC number's common name (if it has one)
    track.controlChanges.sustain.forEach(cc => {
      // cc.ticks, cc.value, cc.time
    })

    //the track also has a channel and instrument
    //track.instrument.name
  })
  return midi;
}
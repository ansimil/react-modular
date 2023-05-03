import {useContext} from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import { lengthMap } from '../SeqLength/SeqLength'
import * as Tone from 'tone'
import PlayBlackIcon from '../../assets/icons/play-black-icon.png'
import PlayWhiteIcon from '../../assets/icons/play-white-icon.png'
import PauseBlackIcon from '../../assets/icons/pause-black-icon.png'
import PauseWhiteIcon from '../../assets/icons/pause-white-icon.png'
import StopBlackIcon from '../../assets/icons/stop-black-icon.png'
import StopWhiteIcon from '../../assets/icons/stop-white-icon.png'
import ArrowBlackIcon from '../../assets/icons/arrow-black-icon.png'
import ArrowWhiteIcon from '../../assets/icons/arrow-white-icon.png'
import './PlayerControls.css'
import { TransportContext } from '../../contexts/TransportContext'

const PlayerControls = () => {
    const { stateHook, sequencerRef, seqSlidersRef } = useContext(ModularBusContext)
    const { transportState, setTransportState } = useContext(TransportContext)
    const [appState, updateState] = stateHook

  return (
    <div className="sequencerControlsContainer">
        <div className='playBtnsContainer'>
          <button
          title="Start"
          className={transportState.player === 'started' ? "playerBtn endBtnLeft activeBtn" : "playerBtn endBtnLeft"} 
          onClick={
            ()=>{
              Tone.Transport.start()
              setTransportState({...transportState, "player": "started"})
              }
            }
          >
            <img 
            className="playerIcon"
            src={transportState.player === 'started' ? PlayWhiteIcon : PlayBlackIcon} 
            alt="play" />
          </button>
          <button
          title="Pause" 
          className={transportState.player === 'paused' ? "playerBtn middleBtn activeBtn" : "playerBtn middleBtn"}
          onClick={
            ()=>{
              Tone.Transport.pause()
              setTransportState({...transportState, "player": "paused"})
              }
            }
            >
            <img 
            className="playerIcon"
            src={transportState.player === 'paused' ? PauseWhiteIcon : PauseBlackIcon} 
            alt="pause" />
          </button>

          <button
          title="Stop" 
          className={transportState.player === 'stopped' ? "playerBtn endBtnRight activeBtn" : "playerBtn endBtnRight" }
          onClick={
            ()=>{
              sequencerRef.current.forEach(track => {
                track.stepper.value = lengthMap[appState.sequencerSettings.length].up.max
                track.next()
                track.stepper.value = lengthMap[appState.sequencerSettings.length].up.max
              })
              const stepIndicatorArr = [...document.getElementsByClassName("sequencer-step-indicators")]
              stepIndicatorArr[0].childNodes.forEach((step, i) => {
                if (i === 0){
                  step.classList.add("active-step-indicator")
                }
                else {
                  step.classList.remove("active-step-indicator")
                }
              })
              seqSlidersRef.current.forEach(slider => {
              if (slider.parent.id === `slider0`){
                slider.parent.className = "activeSeqSlider"
              }
              else {
                slider.parent.className = ""
              }
            })
              Tone.Transport.stop()
              setTransportState({...transportState, "player": "stopped"})
              updateState({type: ACTIONS.SEQUENCER.updateStepValue, payload: {value: 0}})
              }
          }
          >
            <img 
            className="playerIcon"
            src={transportState.player === 'stopped' ? StopWhiteIcon : StopBlackIcon} 
            alt="pause" />
          </button>
        </div>

        <div className='directionBtnContainer'>
          <button
          title="Up" 
          className={appState.sequencerSettings.direction === "up" ? "playerBtn endBtnLeft activeBtn": "playerBtn endBtnLeft"}
          onClick={
            ()=>{
                let currentFirstTrackStep
                sequencerRef.current.forEach((track, i) => {
                  if (i === 0) {
                    currentFirstTrackStep = track.stepper.value
                  }
                  track.stepper.max = 16;
                  track.stepper.mode = 'up'
                  track.stepper.value = currentFirstTrackStep
                })
                updateState({type: ACTIONS.SEQUENCER.direction, payload: {value: "up"}})
                updateState({type: ACTIONS.SEQUENCER.random, payload: {value: false}})
                }
            }
            >
            <img
            className="upIcon directionIcon playerIcon"  
            src={appState.sequencerSettings.direction === "up" ? ArrowWhiteIcon: ArrowBlackIcon} 
            alt="up" 
            />
            </button>
          <button
          title="Down"
          className={appState.sequencerSettings.direction === "down" ? "playerBtn endBtnRight activeBtn": "playerBtn endBtnRight"}
          onClick={
            ()=>{
              let currentFirstTrackStep
              sequencerRef.current.forEach((track, i) => {
                  if (i === 0) {
                    currentFirstTrackStep = track.stepper.value
                  }
                  track.stepper.max = 15;
                  track.stepper.mode = 'down'
                  track.stepper.value = currentFirstTrackStep
                })
                updateState({type: ACTIONS.SEQUENCER.direction, payload: {value: "down"}})
                updateState({type: ACTIONS.SEQUENCER.random, payload: {value: false}})
                }
            }>
            <img
            className="downIcon directionIcon playerIcon" 
            src={appState.sequencerSettings.direction === "down" ? ArrowWhiteIcon : ArrowBlackIcon} 
            alt="down" />
            </button>
          </div>
      </div>
  )
}

export default PlayerControls
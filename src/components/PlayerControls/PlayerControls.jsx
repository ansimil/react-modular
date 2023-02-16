import {useContext} from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../contexts/ModularBusContext'
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

const PlayerControls = () => {
    const { stateHook, sequencerRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

  return (
    <div className="sequencerControlsContainer">
        <div className='playBtnsContainer'>
          <button
          className={appState.sequencerSettings.player === 'started' ? "playerBtn endBtnLeft activeBtn" : "playerBtn endBtnLeft"} 
          onClick={
            ()=>{
              Tone.Transport.start()
              updateState({type: ACTIONS.SEQUENCER.player, payload: {value: 'started'}})
              }
            }
          >
            <img 
            className="playerIcon"
            src={appState.sequencerSettings.player === 'started' ? PlayWhiteIcon : PlayBlackIcon} 
            alt="play" />
          </button>
          <button 
          className={appState.sequencerSettings.player === 'paused' ? "playerBtn middleBtn activeBtn" : "playerBtn middleBtn"}
          onClick={
            ()=>{
              Tone.Transport.pause()
              updateState({type: ACTIONS.SEQUENCER.player, payload: {value: 'paused'}})
              }
            }
            >
            <img 
            className="playerIcon"
            src={appState.sequencerSettings.player === 'paused' ? PauseWhiteIcon : PauseBlackIcon} 
            alt="pause" />
          </button>

          <button 
          className={appState.sequencerSettings.player === 'stopped' ? "playerBtn endBtnRight activeBtn" : "playerBtn endBtnRight" }
          onClick={
            ()=>{
              sequencerRef.current.stepper.value = lengthMap[appState.sequencerSettings.length].up.max
              sequencerRef.current.next()
              sequencerRef.current.stepper.value = lengthMap[appState.sequencerSettings.length].up.max
              Tone.Transport.stop()
              updateState({type: ACTIONS.SEQUENCER.player, payload: {value: 'stopped'}})
              updateState({type: ACTIONS.SEQUENCER.updateStepValue, payload: {value: 0}})
              }
          }
          >
            <img 
            className="playerIcon"
            src={appState.sequencerSettings.player === 'stopped' ? StopWhiteIcon : StopBlackIcon} 
            alt="pause" />
          </button>
        </div>

        <div className='directionBtnContainer'>
          <button 
          className={appState.sequencerSettings.direction === "up" ? "playerBtn endBtnLeft activeBtn": "playerBtn endBtnLeft"}
          onClick={
            ()=>{
                sequencerRef.current.stepper.max = 16; sequencerRef.current.stepper.mode = 'up'
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
          className={appState.sequencerSettings.direction === "down" ? "playerBtn endBtnRight activeBtn": "playerBtn endBtnRight"}
          onClick={
            ()=>{
                sequencerRef.current.stepper.max = 15; sequencerRef.current.stepper.mode = 'down'
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
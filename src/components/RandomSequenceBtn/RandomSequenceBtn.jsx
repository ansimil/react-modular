import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { lengthMap } from '../SeqLength/SeqLength';
import './RandomSequenceBtn.css'

const RandomSequenceBtn = () => {
    const { stateHook, sequencerRef } = useContext(ModularBusContext)
    const [ appState, updateState ] = stateHook

  return (
    <div className="randomSequenceContainer">
        <div className="lengthLabel">
            <p>RANDOM SEQ</p>
        </div>
        <div className="randomSequenceBtnsContainer">
        <button
        className={appState.sequencerSettings.random ? "randomSequenceBtn btn endBtnLeft activeStartBtn" : "randomSequenceBtn endBtnLeft btn"}
        onClick={()=>{
                if (appState.sequencerSettings.direction === 'down') {
                  sequencerRef.current.stepper.max = lengthMap[appState.sequencerSettings.length].up.max
                }
                sequencerRef.current.stepper.mode = "random"
                updateState({type: ACTIONS.SEQUENCER.random, payload: {value: true}})
        }}
        >
        <p>ON</p>
        </button>
        <button
        className={!appState.sequencerSettings.random ? "randomSequenceBtn btn endBtnRight activeBtn" : "randomSequenceBtn endBtnRight btn"}
        onClick={()=>{
                sequencerRef.current.stepper.max = lengthMap[appState.sequencerSettings.length][appState.sequencerSettings.direction].max
                sequencerRef.current.stepper.mode = appState.sequencerSettings.direction
                updateState({type: ACTIONS.SEQUENCER.random, payload: {value: false}})
        }}
        >
        <p>OFF</p>
        </button>
        </div>
    </div>
  )
}

export default RandomSequenceBtn
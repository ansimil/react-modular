import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS';
import { lengthMap } from '../SeqLength/SeqLength';
import './RandomSequenceBtn.css'

const RandomSequenceBtn = () => {
    const { stateHook, sequencerRef } = useContext(ModularBusContext)
    const [ appState, updateState ] = stateHook
  return (
    <div className="random-sequencer-container sequencer-settings-small settings-container settings-container-dark settings-container-dark-inlay">
        <div className="seq-settings-label-div">
            <p className="seq-settings-label">RANDOM SEQ</p>
        </div>
        <div className="randomSequenceBtnsContainer">
        <button
        className={appState.sequencerSettings.random ? "btn-dark selector-btn btn btn-active" : "selector-btn btn btn-dark"}
        onClick={()=>{
                if (appState.sequencerSettings.direction === 'down') {
                  sequencerRef.current.forEach(track => {
                    track.stepper.max = lengthMap[appState.sequencerSettings.length].up.max
                  })
                  // sequencerRef.current.stepper.max = lengthMap[appState.sequencerSettings.length].up.max
                }
                // sequencerRef.current.forEach(track => {
                //     track.stepper.mode = "random"
                // })
                // sequencerRef.current.stepper.mode = "random"
                updateState({type: ACTIONS.SEQUENCER.random, payload: {value: true}})
        }}
        >
        <p>ON</p>
        </button>
        <button
        className={!appState.sequencerSettings.random ? "selector-btn btn btn-active btn-dark" : "selector-btn btn btn-dark"}
        onClick={()=>{
                // let currentFirstTrackStep
                sequencerRef.current.forEach((track, i) => {
                  // if (i === 0) {
                  //   currentFirstTrackStep = track.stepper.value
                  // }
                  // track.stepper.value = currentFirstTrackStep
                  track.stepper.max = lengthMap[appState.sequencerSettings.length][appState.sequencerSettings.direction].max
                  track.stepper.mode = appState.sequencerSettings.direction
                })
                // sequencerRef.current.stepper.max = lengthMap[appState.sequencerSettings.length][appState.sequencerSettings.direction].max
                // sequencerRef.current.stepper.mode = appState.sequencerSettings.direction
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
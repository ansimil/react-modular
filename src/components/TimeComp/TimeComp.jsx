import {useContext} from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../contexts/ModularBusContext'
import './TimeComp.css'

const TimeComp = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook 

    // const handleSubmit = (e) => {
    //     e.preventDfault()
    //     const { id, value } = e.target
    //     updateState({type: ACTIONS.synth[id], payload: {id, value}})
    // }

    const handleChange = (e) => {
        const { id, value } = e.target
        updateState({type: ACTIONS.SYNTH[id], payload: {id, value}})
    }

    const handleInc = (e) => {
        const { id } = e.target
        let value = appState.synthSettings.bpm + 1
        updateState({type: ACTIONS.SYNTH[id], payload: {id, value}})
    }

    const handleDec = (e) => {
        const { id } = e.target
        let value = appState.synthSettings.bpm - 1
        updateState({type: ACTIONS.SYNTH[id], payload: {id, value}})
    }

  return (
    <div className="timeCompContainer">
        <p style={{"color": "rgb(222, 222, 222)", "marginRight": "2rem"}}>BPM</p>
        <input id="bpm" onChange={handleChange} value={appState.synthSettings.bpm} type="number"/>
        <div className="bpmIncDecContainer">
            <button className="bpmBtn bpmTopBtn" id="bpm" onClick={handleInc}>
            +
            </button>
            <button className="bpmBtn bpmBtmBtn" id="bpm" onClick={handleDec}>
            -
            </button>
        </div>
    </div>
  )
}

export default TimeComp
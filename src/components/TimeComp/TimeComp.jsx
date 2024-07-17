import {useContext} from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import { handleMouseEvent } from '../../services/general.services'
import './TimeComp.css'

const TimeComp = () => {
    const { stateHook, sequencerRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook 

    const handleChange = (e) => {
        const { id, value } = e.target
        sequencerRef.current.forEach(track => {
            track.interval.rate = (60 / value) * 1000
        })
        // sequencerRef.current.interval.rate = (60 / value) * 1000
        updateState({type: ACTIONS.SYNTH[id], payload: {id, value}})
    }

    const handleInc = (e) => {
        const { id } = e.target
        let value = appState.synthSettings.bpm + 1
        sequencerRef.current.forEach(track => {
            track.interval.rate = (60 / value) * 1000
        })
        // sequencerRef.current.interval.rate = (60 / value) * 1000
        updateState({type: ACTIONS.SYNTH[id], payload: {id, value}})
    }

    const handleDec = (e) => {
        const { id } = e.target
        let value = appState.synthSettings.bpm - 1
        sequencerRef.current.forEach(track => {
            track.interval.rate = (60 / value) * 1000
        })
        // sequencerRef.current.interval.rate = (60 / value) * 1000
        updateState({type: ACTIONS.SYNTH[id], payload: {id, value}})
    }

  return (
    <div className="time-comp-container">
        <p style={{"color": "rgb(222, 222, 222)", "marginRight": "2rem"}}>BPM</p>
        <input id="bpm" onChange={handleChange} value={appState.synthSettings.bpm} type="number"/>
        <div className="bpm-incdec-container">
            <button 
            className="btn-bpm btn-bpm-top" id="bpm" 
            onClick={handleInc}
            onMouseDown={
                () => handleMouseEvent("btn-bpm-top", true)
            }
            onMouseUp={
                () => handleMouseEvent("btn-bpm-top", false)
            }
            >
            +
            </button>
            <button 
            className="btn-bpm btn-bpm-btm" 
            id="bpm" 
            onClick={handleDec}
            onMouseDown={
                () => handleMouseEvent("btn-bpm-btm", true)
            }
            onMouseUp={
                () => handleMouseEvent("btn-bpm-btm", false)
            }
            >
            -
            </button>
        </div>
    </div>
  )
}

export default TimeComp
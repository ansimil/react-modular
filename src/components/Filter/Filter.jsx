import { useContext, useState } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import {ModularBusContext} from '../../contexts/ModularBusContext'
import './Filter.css'

const Filter = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const [ activeType, setActiveType ] = useState('lowpass')
    const { filterSettings } = appState

    const change = e => {
        let { id, value } = e.target;
        updateState({type: ACTIONS.FILTER.CHANGE_FILTER[id], payload: { id, value }})
    }

    const changeType = e => {
        let { id } = e.target;
        setActiveType(id)
        updateState({type: ACTIONS.FILTER.CHANGE_FILTER.type, payload: { id }})
    }
  return (
    <div className='filterContainer'>
        <div className="sliderContainer">
            <label className="sliderLabel"><p>CUTOFF</p></label>
            <p>{(filterSettings.frequency).toFixed(2)}</p>
            <input
            className="freqSlider slider"
            id="frequency"
            type="range" 
            min={10} 
            max={10000} 
            step={0.001}
            value={filterSettings.frequency} 
            onChange={change}
            />
        </div>
        <div className="sliderContainer">
            <label className="sliderLabel"><p>FINE</p></label>
            <p>{filterSettings.detune}</p>
            <input
            className="detuneSlider slider"
            id="detune"
            type="range" 
            min={0} 
            max={100}
            step={0.01}
            value={filterSettings.detune}
            onChange={change}
            />
        </div>
        <div className="sliderContainer">
            <label className="sliderLabel"><p>RES</p></label>
            <p>{filterSettings.Q}</p>
            <input
            className="QSlider slider"
            id="Q"
            type="range" 
            min={0} 
            max={10}
            step={0.001}
            value={filterSettings.Q} 
            onChange={change}
            />  
        </div>
        <div className="rightSideContainer">
            <div className="moduleInfo">
                <h2>Filter</h2>
            </div>
            <div className="waveSelectContainer">
                <button 
                id="lowpass"
                className={activeType === 'lowpass' ? "btn activeBtn": "btn"}
                onClick={changeType}
                >
                LP
                </button>

                <button 
                id="highpass"
                className={activeType === 'highpass' ? "btn activeBtn": "btn"}
                onClick={changeType}
                >
                HP
                </button>

                <button
                id="bandpass"
                className={activeType === 'bandpass' ? "btn activeBtn": "btn"}
                onClick={changeType}
                >
                BP
                </button>

                <button 
                id="notch"
                className={activeType === 'notch' ? "btn activeBtn": "btn"}
                onClick={changeType}
                >
                N
                </button>
            </div>
        </div>
    </div>
  )
}

export default Filter
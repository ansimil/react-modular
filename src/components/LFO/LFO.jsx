import { useContext, useState } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import {ModularBusContext} from '../../contexts/ModularBusContext'
import '../Oscillator/Oscillator.css'

const LFO = ({ lfoNum }) => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const [ activeType, setActiveType ] = useState('sine')

    const { lfoSettings } = appState
    
    const selectedLfoAction = Object.keys(ACTIONS.LFO)[lfoNum-1]
    const selectedLfoSettings = Object.keys(appState.lfoSettings)[lfoNum-1]

    const change = e => {
        let { id, value } = e.target;
        updateState({type: ACTIONS.LFO[selectedLfoAction][id], payload: {id, value}})
    }
    const changeType = e => {
        let { id } = e.target;
        setActiveType(id)
        updateState({type: ACTIONS.LFO[selectedLfoAction].type, payload: {id}})
    }

    return (
        <div className={`lfoContainer lfoContainer${lfoNum}`}>
            <div className="sliderContainer">
                <label className="sliderLabel"><p>COARSE</p></label>
                <p>{lfoSettings[selectedLfoSettings].frequency}</p>
                <input
                className="frequencySlider slider"
                id="frequency"
                type="range" 
                min={0.5} 
                max={40} 
                step={0.001}
                value={lfoSettings[selectedLfoSettings].frequency} 
                onChange={change}
                />
            </div>
            <div className="sliderContainer"></div>
            <div className="rightSideContainer">
                    <div className="moduleInfo">
                        <h2>{`LFO_${lfoNum}`}</h2>
                    </div>
                <div className="waveSelectContainer">
                    <button 
                    id="sine"
                    className={activeType === 'sine' ? "btn activeBtn": "btn"}
                    onClick={changeType}
                    >
                    SINE
                    </button>

                    <button 
                    id="triangle"
                    className={activeType === 'triangle' ? "btn activeBtn": "btn"}
                    onClick={changeType}
                    >
                    TRI
                    </button>

                    <button
                    id="square"
                    className={activeType === 'square' ? "btn activeBtn": "btn"}
                    onClick={changeType}
                    >
                    SQR
                    </button>

                    <button 
                    id="sawtooth"
                    className={activeType === 'sawtooth' ? "btn activeBtn": "btn"}
                    onClick={changeType}
                    >
                    SAW
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LFO
import { useContext, useState } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import './Oscillator.css'

const Oscillator = ({ oscNum }) => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

    const [ activeType, setActiveType ] = useState('sine')
    const { oscSettings } = appState
    
    const selectedOscAction = Object.keys(ACTIONS.OSCILLATOR)[oscNum-1]
    const selectedOscSettings = Object.keys(appState.oscSettings)[oscNum-1]

    
    const change = e => {
        let { id, value } = e.target;
        updateState({type: ACTIONS.OSCILLATOR[selectedOscAction][id], payload: {id, value}})
    }
    const changeType = e => {
        let { id } = e.target;
        setActiveType(id)
        updateState({type: ACTIONS.OSCILLATOR[selectedOscAction].type, payload: {id}})
    }

    return (
        <div className={`oscillatorContainer oscillatorContainer${oscNum}`}>
            <div className="sliderContainer">
                <label className="sliderLabel"><p>FINE</p></label>
                <p>{oscSettings[selectedOscSettings].detune}</p>
                <input
                className="detuneSlider slider"
                id="detune"
                type="range" 
                min={0} 
                max={100} 
                value={oscSettings[selectedOscSettings].detune} 
                onChange={change}
                />
            </div>
            <div className="sliderContainer">
                <label className="sliderLabel"><p>FM AMOUNT</p></label>
                <p>{oscSettings[selectedOscSettings].oscFMIntensity.value}</p>
                <input
                className="fmIntensitySlider slider"
                id="oscFMIntensity"
                type="range" 
                min={0} 
                max={10000} 
                value={oscSettings[selectedOscSettings].oscFMIntensity.value} 
                onChange={change}
                />
            </div>
            <div className="rightSideContainer">
                <div className="moduleInfo">
                    <h2>{`OSC_${oscNum}`}</h2>
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

export default Oscillator
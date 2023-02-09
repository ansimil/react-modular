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
            <div className="sliderContainer left">
                <label className="sliderLabel"><p>FINE</p></label>
                <p className="valueIndicator">{(oscSettings[selectedOscSettings].detune).toFixed(2)}cts</p>
                <input
                className="detuneSlider slider"
                id="detune"
                type="range" 
                min={0} 
                max={100} 
                step={0.001}
                value={oscSettings[selectedOscSettings].detune} 
                onChange={change}
                />
            </div>
            <div className="sliderContainer">
                <label className="sliderLabel"><p>PWM</p></label>
                <p className="valueIndicator">{(oscSettings[selectedOscSettings].pwm).toFixed(2)}Hz</p>
                <input
                className="pwmSlider slider"
                id="pwm"
                type="range" 
                min={0} 
                max={40} 
                step={0.001}
                value={oscSettings[selectedOscSettings].pwm} 
                onChange={change}
                />
            </div>
            <div className="sliderContainer">
                <label className="sliderLabel"><p>GLIDE</p></label>
                <p className="valueIndicator">{(oscSettings[selectedOscSettings].glide).toFixed(2)}s</p>
                <input
                className="glideSlider slider"
                id="glide"
                type="range" 
                min={0.0001} 
                max={2}
                step={0.001} 
                value={oscSettings[selectedOscSettings].glide} 
                onChange={change}
                />
            </div>
            <div className="sliderContainer">
                <label className="sliderLabel"><p>FM DEPTH</p></label>
                <p className="valueIndicator">{(oscSettings[selectedOscSettings].oscFMDepth / 1000).toFixed(2)}</p>
                <input
                className="fmIntensitySlider slider"
                id="oscFMDepth"
                type="range" 
                min={0} 
                max={10000}
                step={0.01}
                value={oscSettings[selectedOscSettings].oscFMDepth} 
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
                    className={activeType === 'sine' ? "btn activeBtn endBtnLeft": "btn endBtnLeft"}
                    onClick={changeType}
                    >
                    SINE
                    </button>

                    <button 
                    id="triangle"
                    className={activeType === 'triangle' ? "btn activeBtn middleBtn": "btn middleBtn"}
                    onClick={changeType}
                    >
                    TRI
                    </button>

                    <button
                    id="pwm"
                    className={activeType === 'pwm' ? "btn activeBtn middleBtn": "btn middleBtn"}
                    onClick={changeType}
                    >
                    PULS
                    </button>

                    <button 
                    id="sawtooth"
                    className={activeType === 'sawtooth' ? "btn activeBtn endBtnRight": "btn endBtnRight"}
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
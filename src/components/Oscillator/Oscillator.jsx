import { useContext, useState } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { handleMouseEvent } from '../../services/general.services'
import Slider from '../Slider/Slider'
import './Oscillator.css'

const IncDec = ({value, incDecClass, label, updateState, oscNum}) => {
    
    return (
        <div className="inc-dec-inner">
            {label && <p className="inc-dec-label sliderLabel">{label.toUpperCase()}</p>}
            <div className="inc-dec-btns-container">
            <button
            id={label} 
            className={`inc-dec-btn dec-btn dec-btn${incDecClass}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS.OSCILLATOR[oscNum].offset, payload: {value: "dec", id:e.target.id}})}
            onMouseDown={
                () => handleMouseEvent(`dec-btn${incDecClass}${label}`, true)
            }
            onMouseUp={
                () => handleMouseEvent(`dec-btn${incDecClass}${label}`, false)
            }
            >
            -
            </button>
            <p className="inc-dec-indicator">{value}</p>
            <button
            id={label}
            className={`inc-dec-btn inc-btn inc-btn${incDecClass}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS.OSCILLATOR[oscNum].offset, payload: {value: "inc", id:e.target.id}})}
            onMouseDown={
                () => handleMouseEvent(`inc-btn${incDecClass}${label}`, true)
            }
            onMouseUp={
                () => handleMouseEvent(`inc-btn${incDecClass}${label}`, false)
            }
            >
            +
            </button>
            </div>
        </div>
    )
}

const Oscillator = ({ oscNum }) => {
    const { stateHook, oscRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

    const [ activeType, setActiveType ] = useState('sine')
    const { oscSettings } = appState
   
    
    const selectedOscAction = Object.keys(ACTIONS.OSCILLATOR)[oscNum-1]
    const selectedOscSettings = Object.keys(appState.oscSettings)[oscNum-1]
    
    const change = (e, id) => {
        let value = e;
        updateState({type: ACTIONS.OSCILLATOR[selectedOscAction][id], payload: {id, value}})
    }
    const changeType = e => {
        let { id } = e.target;
        setActiveType(id)
        updateState({type: ACTIONS.OSCILLATOR[selectedOscAction].type, payload: {id}})
    }

    return (
        <div className={`modulesContainer oscillatorContainer${oscNum}`}>
            <div className="moduleInfo">
                <div className="moduleInfoInner">
                    <p>{`osc_${oscNum}`}</p>
                </div>
            </div>

            <div className="moduleSettingsContainer">
                <div className="moduleSettingsInner">
                <div className="slidersContainer">
                <Slider module={selectedOscAction} label={"FINE"} valueLabel={(oscSettings[selectedOscSettings].detune).toFixed(2)} unit={"cts"} min={0} max={100} step={0.001} values={oscSettings[selectedOscSettings].detune} sliderRef={oscRef} id={"detune"} changeFunction={change}/>
                <Slider module={selectedOscAction} label={"PWM"} valueLabel={(oscSettings[selectedOscSettings].pwm).toFixed(2)} unit={"Hz"} min={0} max={40} step={0.001} values={oscSettings[selectedOscSettings].pwm} sliderRef={oscRef} id={"pwm"} changeFunction={change}/>
                <Slider module={selectedOscAction} label={"GLIDE"} valueLabel={(oscSettings[selectedOscSettings].glide).toFixed(2)} unit={"s"} min={0.0001} max={2} step={0.001} values={oscSettings[selectedOscSettings].glide} sliderRef={oscRef} id={"glide"} changeFunction={change}/>
                <Slider module={selectedOscAction} label={"FM DEPTH"} valueLabel={(oscSettings[selectedOscSettings].oscFMDepth).toFixed(2)} unit={""} min={0} max={2500} step={0.001} values={oscSettings[selectedOscSettings].oscFMDepth} sliderRef={oscRef} id={"oscFMDepth"} changeFunction={change}/>
                </div>
                <div className="rightSideContainer">
                    
                    <div className="waveSelectContainer">
                        <button 
                        id="sine"
                        className={activeType === 'sine' ? "btn waveselect-btn activeBtn": "btn waveselect-btn"}
                        onClick={changeType}
                        >
                        SINE
                        </button>

                        <button 
                        id="triangle"
                        className={activeType === 'triangle' ? "btn waveselect-btn activeBtn": "btn waveselect-btn"}
                        onClick={changeType}
                        >
                        TRI
                        </button>

                        <button
                        id="pwm"
                        className={activeType === 'pwm' ? "btn waveselect-btn activeBtn": "btn waveselect-btn"}
                        onClick={changeType}
                        >
                        PULS
                        </button>

                        <button 
                        id="sawtooth"
                        className={activeType === 'sawtooth' ? "btn waveselect-btn activeBtn": "btn waveselect-btn"}
                        onClick={changeType}
                        >
                        SAW
                        </button>
                    </div>
                    <div className="inc-dec-container">
                    <IncDec value={oscSettings[selectedOscSettings].semitone} incDecClass={selectedOscAction} label={"semitone"} updateState={updateState} oscNum={selectedOscAction}/>
                    <IncDec value={oscSettings[selectedOscSettings].octave} incDecClass={selectedOscAction} label={"octave"} updateState={updateState} oscNum={selectedOscAction}/>
                    </div>
                </div>
            </div>
        </div>  
        </div>
    )
}

export default Oscillator
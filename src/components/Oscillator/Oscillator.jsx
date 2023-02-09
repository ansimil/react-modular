import { useContext, useState } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Slider from '../Slider/Slider'
import './Oscillator.css'

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
        <div className={`oscillatorContainer oscillatorContainer${oscNum}`}>
            
            <Slider module={selectedOscAction} label={"FINE"} valueLabel={(oscSettings[selectedOscSettings].detune).toFixed(2)} unit={"cts"} min={0} max={100} step={0.001} values={oscSettings[selectedOscSettings].detune} sliderRef={oscRef} id={"detune"} changeFunction={change}/>
            <Slider module={selectedOscAction} label={"PWM"} valueLabel={(oscSettings[selectedOscSettings].pwm).toFixed(2)} unit={"Hz"} min={0} max={40} step={0.001} values={oscSettings[selectedOscSettings].pwm} sliderRef={oscRef} id={"pwm"} changeFunction={change}/>
            <Slider module={selectedOscAction} label={"GLIDE"} valueLabel={(oscSettings[selectedOscSettings].glide).toFixed(2)} unit={"s"} min={0.0001} max={2} step={0.001} values={oscSettings[selectedOscSettings].glide} sliderRef={oscRef} id={"glide"} changeFunction={change}/>
            <Slider module={selectedOscAction} label={"FM DEPTH"} valueLabel={(oscSettings[selectedOscSettings].oscFMDepth).toFixed(2)} unit={""} min={0} max={2500} step={0.001} values={oscSettings[selectedOscSettings].oscFMDepth} sliderRef={oscRef} id={"oscFMDepth"} changeFunction={change}/>
            
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
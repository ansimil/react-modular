import { useContext, useState } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import {ModularBusContext} from '../../contexts/ModularBusContext'
import Slider from '../Slider/Slider'
import '../Oscillator/Oscillator.css'

const LFO = ({ lfoNum }) => {
    const { stateHook, lfoRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const [ activeType, setActiveType ] = useState('sine')
    const { lfoSettings } = appState
    const selectedLfoAction = Object.keys(ACTIONS.LFO)[lfoNum-1]
    const selectedLfoSettings = Object.keys(appState.lfoSettings)[lfoNum-1]

    const change = (e, id) => {
        let value = e;
        updateState({type: ACTIONS.LFO[selectedLfoAction][id], payload: {id, value}})
    }
    const changeType = e => {
        let { id } = e.target;
        setActiveType(id)
        updateState({type: ACTIONS.LFO[selectedLfoAction].type, payload: {id}})
    }

    return (
        <div className={`modulesContainer lfoContainer lfoContainer${lfoNum}`}>
            <div className="moduleInfo">
                <div className="moduleInfoInner">
                    <p>{`lfo_${lfoNum}`}</p>
                </div>
            </div>
            <div className="moduleSettingsContainer">
                <div className="moduleSettingsInner">
                <div className="slidersContainer">
            <Slider module={selectedLfoSettings} label={"COARSE"} valueLabel={(lfoSettings[selectedLfoSettings].frequency).toFixed(2)} unit={"Hz"} min={0.1} max={40} step={0.001} values={lfoSettings[selectedLfoSettings].frequency} sliderRef={lfoRef} id={"frequency"} changeFunction={change}/>
            <Slider module={selectedLfoSettings} label={"PWM"} valueLabel={(lfoSettings[selectedLfoSettings].pwm).toFixed(2)} unit={"Hz"} min={0} max={40} step={0.001} values={lfoSettings[selectedLfoSettings].pwm} sliderRef={lfoRef} id={"pwm"} changeFunction={change}/>
            <Slider module={selectedLfoSettings} label={"FM DEPTH"} valueLabel={(lfoSettings[selectedLfoSettings].lfoFMDepth / 1000).toFixed(2)} unit={""} min={0} max={10000} step={0.001} values={lfoSettings[selectedLfoSettings].lfoFMDepth} sliderRef={lfoRef} id={"lfoFMDepth"} changeFunction={change}/>
            </div>
            <div className="rightSideContainer">

                <div className="waveSelectContainer">
                    <button 
                    id="sine"
                    className={activeType === 'sine' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    SINE
                    </button>

                    <button 
                    id="triangle"
                    className={activeType === 'triangle' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    TRI
                    </button>

                    <button
                    id="pwm"
                    className={activeType === 'pwm' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    PULS
                    </button>

                    <button 
                    id="sawtooth"
                    className={activeType === 'sawtooth' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    SAW
                    </button>
                </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LFO
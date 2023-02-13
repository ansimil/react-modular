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
        <div className={`lfoContainer lfoContainer${lfoNum}`}>

            <Slider module={selectedLfoSettings} label={"COARSE"} valueLabel={(lfoSettings[selectedLfoSettings].frequency).toFixed(2)} unit={"Hz"} min={0.5} max={40} step={0.001} values={lfoSettings[selectedLfoSettings].frequency} sliderRef={lfoRef} id={"frequency"} changeFunction={change}/>
            <Slider module={selectedLfoSettings} label={"FM DEPTH"} valueLabel={(lfoSettings[selectedLfoSettings].lfoFMDepth / 1000).toFixed(2)} unit={""} min={0} max={10000} step={0.001} values={lfoSettings[selectedLfoSettings].lfoFMDepth} sliderRef={lfoRef} id={"lfoFMDepth"} changeFunction={change}/>
            {/* <div className="sliderContainer left">
                <label className="sliderLabel"><p>COARSE</p></label>
                <p className="valueIndicator">{(lfoSettings[selectedLfoSettings].frequency).toFixed(2)}Hz</p>
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
            </div> */}
            {/* <div className="sliderContainer">
                <label className="sliderLabel"><p>FM DEPTH</p></label>
                <p className="valueIndicator">{(lfoSettings[selectedLfoSettings].lfoFMDepth / 1000).toFixed(2)}</p>
                <input
                className="fmIntensitySlider slider"
                id="lfoFMDepth"
                type="range" 
                min={0} 
                max={10000}
                step={0.01}
                value={lfoSettings[selectedLfoSettings].lfoFMDepth} 
                onChange={change}
                />
            </div> */}
            <div className="rightSideContainer">
                    <div className="moduleInfo">
                        <h2>{`LFO_${lfoNum}`}</h2>
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

export default LFO
import { useContext, useState } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import {ModularBusContext} from '../../contexts/ModularBusContext'
import Slider from '../Slider/Slider'
import './Filter.css'

const Filter = () => {
    const { stateHook, filterRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const [ activeType, setActiveType ] = useState('lowpass')
    const { filterSettings } = appState
    const change = (e, id) => {
        let value = e;
        updateState({type: ACTIONS.filter[id], payload: { id, value }})
    }

    const changeType = e => {
        let { id } = e.target;
        setActiveType(id)
        updateState({type: ACTIONS.filter.type, payload: { id }})
    }
  return (
    <div className='modulesContainer filterContainer'>

        <div className="moduleInfo">
            <div className="moduleInfoInner">
                <p>{`filter`}</p>
            </div>
        </div>

        <div className="moduleSettingsContainer">
            <div className="moduleSettingsInner">
                <div className="slidersContainer">
                    <Slider module={"filter"} label={"CUTOFF"} valueLabel={(filterSettings.frequency).toFixed(0)} unit={"Hz"} min={10} max={10000} step={0.001} values={filterSettings.frequency} sliderRef={filterRef} id={"frequency"} changeFunction={change}/>
                    <Slider module={"filter"} label={"FINE"} valueLabel={(filterSettings.detune).toFixed(2)} unit={"cts"} min={0} max={100} step={0.001} values={filterSettings.detune} sliderRef={filterRef} id={"detune"} changeFunction={change}/>
                    <Slider module={"filter"} label={"RES"} valueLabel={(filterSettings.Q).toFixed(2)} unit={""} min={0} max={10} step={0.001} values={filterSettings.Q} sliderRef={filterRef} id={"Q"} changeFunction={change}/>
                    <Slider module={"filter"} label={"FM DEPTH"} valueLabel={(filterSettings.freqFMDepth).toFixed(2)} unit={""} min={0} max={2500} step={0.001} values={filterSettings.freqFMDepth} sliderRef={filterRef} id={"freqFMDepth"} changeFunction={change}/>
                </div>
            <div className="rightSideContainer">
                <div className="waveSelectContainer">
                    <button 
                    id="lowpass"
                    className={activeType === 'lowpass' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    LP
                    </button>

                    <button 
                    id="highpass"
                    className={activeType === 'highpass' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    HP
                    </button>

                    <button
                    id="bandpass"
                    className={activeType === 'bandpass' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    BP
                    </button>

                    <button 
                    id="notch"
                    className={activeType === 'notch' ? "btn activeBtn waveselect-btn": "btn waveselect-btn"}
                    onClick={changeType}
                    >
                    N
                    </button>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Filter
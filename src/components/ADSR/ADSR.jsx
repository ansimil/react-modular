import { useContext } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import {ModularBusContext} from '../../contexts/ModularBusContext'
import './ADSR.css'

export const ADSR = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const { adsrSettings } = appState

    const change = e => {
        let { id, value } = e.target;
        updateState({type: ACTIONS.ADSR.CHANGE_ADSR, payload: { id, value }})
    }
  return (
    <div className='adsrContainer'>
        <div className="sliderContainer">
            <label className="sliderLabel"><p>A</p></label>
            <p>{adsrSettings.attack}</p>
            <input
            className="adsrSlider slider"
            id="attack"
            type="range" 
            min={0} 
            max={5} 
            step={0.001}
            value={adsrSettings.attack} 
            onChange={change}
            />
        </div>

        <div className="sliderContainer">
            <label className="sliderLabel"><p>D</p></label>
            <p>{adsrSettings.decay}</p>
            <input
            className="adsrSlider slider"
            id="decay"
            type="range" 
            min={0} 
            max={5} 
            step={0.001}
            value={adsrSettings.decay} 
            onChange={change}
            />
        </div>

        <div className="sliderContainer">
            <label className="sliderLabel"><p>S</p></label>  
            <p>{adsrSettings.sustain}</p>
            <input
            className="adsrSlider slider"
            id="sustain"
            type="range" 
            min={0} 
            max={1} 
            step={0.001}
            value={adsrSettings.sustain} 
            onChange={change}
            />
        </div>

        <div className="sliderContainer">
            <label className="sliderLabel"><p>R</p></label>
            <p>{adsrSettings.release}</p>
            <input
            className="adsrSlider slider"
            id="release"
            type="range" 
            min={0} 
            max={5} 
            step={0.001}
            value={adsrSettings.release} 
            onChange={change}
            />
        </div>
    </div>
  )
}

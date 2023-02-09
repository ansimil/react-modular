import { useContext } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import './StartBtn.css'

const StartBtn = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const { synthSettings } = appState

    const change = e => {
        let { id, value } = e.target;
        updateState({type: ACTIONS.SYNTH[id], payload: { id, value }})
    }

  return (
    <div className="startBtnContainer">
    
        <div className="startBtnInner">
            <button
            id="start"
            onClick={change}
            className={synthSettings.start ? "startBtn activeStartBtn endBtnLeft": "startBtn endBtnLeft"}
            >
            ON
            </button>
            
            <button
            id="stop"
            onClick={change}
            className={!synthSettings.start ? "startBtn activeStopBtn endBtnRight": "startBtn endBtnRight"}
            >
            OFF
            </button>
        </div>
        {/* <div className="sliderContainer">
                <label className="sliderLabel"><p>GAIN</p></label>
                <p>{(Math.round(synthSettings.outputGain * 100) / 10)}</p>
                <input
                className="outputGainSlider slider"
                id="outputGain"
                type="range" 
                min={0} 
                max={1}
                step={0.0001} 
                value={synthSettings.outputGain} 
                onChange={change}
                />
            </div> */}
    </div>
  )
}

export default StartBtn
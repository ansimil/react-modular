import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Slider from '../Slider/Slider'
import { ACTIONS } from '../../utils/ACTIONS'

const Reverb = () => {
    const { stateHook, reverbRef } = useContext(ModularBusContext)
    const [ appState, updateState ] = stateHook

    const change = (e, id) => {
        let [ value ] = e;
        updateState({type: ACTIONS.EFFECTS.reverb[id], payload: { id, value }})
    }

  return (
    <div className='modulesContainer reverbContainer'>
    <div className="moduleInfo">
        <div className="moduleInfoInner">
            <p>{`reverb`}</p>
        </div>
    </div>

    <div className="moduleSettingsContainer">
        <div className="moduleSettingsInner">
            <div className="slidersContainer">
              <Slider module={"reverb"} label={"DECAY"} valueLabel={(appState.effectsSettings.reverb.decay).toFixed(2)} unit={"s"} min={0} max={5} step={0.001} values={appState.effectsSettings.reverb.decay} sliderRef={reverbRef} id={"decay"} changeFunction={change}/>
              <Slider module={"reverb"} label={"DELAY"} valueLabel={(appState.effectsSettings.reverb.preDelay).toFixed(2)} unit={"s"} min={0} max={2} step={0.0001} values={appState.effectsSettings.reverb.preDelay} sliderRef={reverbRef} id={"preDelay"} changeFunction={change}/>
              <Slider module={"reverb"} label={"WET"} valueLabel={(appState.effectsSettings.reverb.wet*100).toFixed(2)} unit={"%"} min={0} max={1} step={0.0001} values={appState.effectsSettings.reverb.wet} sliderRef={reverbRef} id={"wet"} changeFunction={change}/>
            </div>
        </div>
    </div>  
</div>
  )
}

export default Reverb
import { useContext } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Slider from '../Slider/Slider'
import './ADSR.css'

export const ADSR = () => {
    const { stateHook, adsrRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

    const change = (e, stage) => {
        let [ value ] = e;
        let id = stage
        updateState({type: ACTIONS.ADSR.CHANGE_ADSR, payload: { id, value }})
    }
  return (
    <div className='adsrContainer'>
        <div className="adsrContainerInner">
        <Slider module={"adsr"} label={"A"} valueLabel={(appState.adsrSettings.attack).toFixed(2)} unit={"s"} min={0} max={5} step={0.001} values={appState.adsrSettings.attack} sliderRef={adsrRef} id={"attack"} changeFunction={change}/>
        <Slider module={"adsr"} label={"D"} valueLabel={(appState.adsrSettings.decay).toFixed(2)} unit={"s"} min={0.01} max={5} step={0.001} values={appState.adsrSettings.decay} sliderRef={adsrRef} id={"decay"} changeFunction={change}/>
        <Slider module={"adsr"} label={"S"} valueLabel={(appState.adsrSettings.sustain).toFixed(2)} unit={""} min={0} max={1} step={0.001} values={appState.adsrSettings.sustain} sliderRef={adsrRef} id={"sustain"} changeFunction={change}/>
        <Slider module={"adsr"} label={"R"} valueLabel={(appState.adsrSettings.release).toFixed(2)} unit={"s"} min={0} max={5} step={0.001} values={appState.adsrSettings.release} sliderRef={adsrRef} id={"release"} changeFunction={change}/>
        </div>
        <div className="moduleInfo">
            <h2>ENV_1</h2>
        </div>
    </div>
  )
}

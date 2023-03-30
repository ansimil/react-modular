import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import Slider from '../Slider/Slider'

const SlidersContainer = ({ module, i }) => {
    const context = useContext(ModularBusContext)
    const { stateHook } = context
    const [ appState, updateState ] = stateHook
    const { name, type, subtype } = module
    const { slidersArr } = module.settings
    
    const change = (e, id) => {
        console.log(e, id)
        let [value] = e;
        if (subtype) {
            updateState({type: ACTIONS[type][subtype][id], payload: {id, value, moduleName: name, i, type, subtype}})
        }
        else {
            updateState({type: ACTIONS[type][id], payload: {id, value, moduleName: name, i, type, subtype}})
        }
    }

  return (
    <div className="sliders-container">

        {slidersArr.map((slider, i) => {
            const {module, label, unit, min, max, step, id, valueMultiplier} = slider
            const sliderState = appState[`${type}Settings`][name]
            return (
                <Slider key={`${module}${label}${i}`} name={name} label={label} valueLabel={(sliderState[id])} unit={unit} min={min} max={max} step={step} values={sliderState[id]} sliderRef={context[`${type}Ref`]} id={id} changeFunction={change} valueMultiplier={valueMultiplier}/>
            )
        })}

    </div>
  )
}

export default SlidersContainer
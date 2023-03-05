import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import Slider from '../Slider/Slider'

const SlidersContainer = ({ module }) => {
    const { name, type } = module
    const { slidersArr } = module.settings
    const context = useContext(ModularBusContext)
    const { stateHook } = context
    const [ appState, updateState ] = stateHook
    
    const change = (e, id) => {
        let value = e;
        updateState({type: ACTIONS[type][name][id], payload: {id, value}})
    }

  return (
    <div className="sliders-container">

        {slidersArr.map((slider, i) => {
            const {module, label, unit, min, max, step, id} = slider
            const sliderState = appState[`${type}Settings`][name]

            // Just for testing. This needs to be removed and module needs to be changed back to module //
            const newModule = module+"0"

            return (
                <Slider key={`${module}${label}${i}`} module={newModule} label={label} valueLabel={(sliderState[id]).toFixed(2)} unit={unit} min={min} max={max} step={step} values={sliderState[id]} sliderRef={context[`${type}Ref`]} id={id} changeFunction={change} />
            )
        })}

    </div>
  )
}

export default SlidersContainer
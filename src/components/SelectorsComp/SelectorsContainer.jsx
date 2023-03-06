import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import SelectorBtn from '../SelectorBtn/SelectorBtn'

const SelectorsContainer = ({ module, i }) => {
    const { stateHook } = useContext(ModularBusContext)
    const [ appState, updateState ] = stateHook
    const { selectorsArr } = module.settings
    const { type: moduleType } = module
    const { name } = module

    const change = (e, toChange, i) => {
        let { id } = e.target;
        updateState({type: ACTIONS[moduleType][name][toChange], payload: {id, i, module:name}})
    }

  return (
    <div className="selectors-container">
    {selectorsArr && selectorsArr.map((selector) => {
        const { id, label, type } = selector
        return (
            <SelectorBtn key={`${module.name}${type}${id}`} id={id} label={label} change={change} activeType={appState[`${moduleType}Settings`][name][type]} toChange={type} i={i}/>
        )
    })}
    </div>
  )
}

export default SelectorsContainer
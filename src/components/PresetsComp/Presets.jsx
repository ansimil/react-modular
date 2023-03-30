import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'

const SavePresetsBtn = ({handleSave}) => {
    return (
        <div className='presets-save-btn-container'>
        <button
        onClick={handleSave}
        >
        Save settings
        </button>
        </div>  
    )
}

const Presets = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook
    const handleSave = () => {
        updateState({type: ACTIONS.SYNTH.savePreset, payload: {value: "save"}})
    }

  return (
    <div className='presets-container'>
    <SavePresetsBtn handleSave={handleSave} />
    </div>
  )
}

export default Presets
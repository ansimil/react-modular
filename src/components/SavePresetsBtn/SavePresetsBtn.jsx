import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'

const SavePresetsBtn = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook
    const handleSave = () => {
        updateState({type: ACTIONS.SYNTH.savePreset, payload: {value: "save"}})
    }

  return (
    <div className='presets-save-btn-container'>
        <button
        onClick={handleSave}
        >
        Save patch
        </button>
        </div>  
  )
}

export default SavePresetsBtn
import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import IncDec from '../IncDec/IncDec'

const AdditionalSettingsContainer = ({ module, i }) => {
    const { stateHook } = useContext(ModularBusContext)
    const [ appState, updateState ] = stateHook
    const { incDecArr } = module.settings
    const { name: moduleName, type } = module
    const moduleIdx = i
  return (
    <div className="additional-settings-container">
        {incDecArr.map((incDec, i) => {
            const value = appState[`${type}Settings`][moduleName][incDec.name]
            return (
                <IncDec key={i} updateState={updateState} value={value} moduleName={moduleName} type={type} label={incDec.name} i={moduleIdx} />
            )
        })}
    </div>
  )
}

export default AdditionalSettingsContainer
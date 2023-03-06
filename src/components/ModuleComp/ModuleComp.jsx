import SlidersContainer from '../SlidersContainer/SlidersContainer'
import ModuleInfo from '../ModuleInfo.jsx/ModuleInfo'
import SelectorsContainer from '../SelectorsComp/SelectorsContainer'
import AdditionalSettingsContainer from '../AdditionalSettingsContainer/AdditionalSettingsContainer'

const ModuleComp = ({ module, i }) => {
    const { slidersArr } = module.settings
    const { selectorsArr } = module.settings
    const { incDecArr } = module.settings
    const { name } = module
  return (
    <div key={name} className="module-container">

        {name && <ModuleInfo moduleName={name}/>}

        <div className="module-settings-container">
            <div className="module-settings-inner">
                {slidersArr && <SlidersContainer module={module} i={i} />}
                {(selectorsArr || incDecArr) && <div className="module-right-side-container">
                {selectorsArr && <SelectorsContainer module={module} i={i} />}
                {incDecArr && <AdditionalSettingsContainer module={module} i={i} />}
                </div>}
            </div>
        </div>
    </div>
  )
}

export default ModuleComp
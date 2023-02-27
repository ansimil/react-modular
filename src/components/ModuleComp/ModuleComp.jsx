import SlidersContainer from '../SlidersContainer/SlidersContainer'
import ModuleInfo from '../ModuleInfo.jsx/ModuleInfo'
import SelectorsComp from '../SelectorsComp/SelectorsComp'

const ModuleComp = ({ module }) => {
    const { slidersArr } = module.settings
    const { selectorsArr } = module.settings
    const { name } = module

  return (
    <div key={name} className="module-container">

        {name && <ModuleInfo moduleName={name}/>}

        <div className="module-settings-container">
            <div className="module-settings-inner">
                {slidersArr && <SlidersContainer module={module}/>}
                <div className="module-right-side-container">
                {selectorsArr && <SelectorsComp module={module} />}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ModuleComp
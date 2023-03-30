import { useContext } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { handleMouseEvent } from '../../services/general.services'
import { ModularBusContext } from '../../contexts/ModularBusContext'

const IncDecVertical = ({value, label, moduleType, id, moduleName}) => {
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook

    return (
        <div className="inc-dec-vertical-inner">
            {label && <p className="inc-dec-label sliderLabel">{label.toUpperCase()}</p>}
            <div className="inc-dec-btns-container">
            <button
            id={label} 
            className={`inc-dec-btn dec-btn dec-btn${moduleName}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS[moduleType][id], payload: {value: "dec", id:e.target.id, moduleName, moduleType}})}
            onMouseDown={
                () => handleMouseEvent(`dec-btn${moduleName}${label}`, true)
            }
            onMouseUp={
                () => handleMouseEvent(`dec-btn${moduleName}${label}`, false)
            }
            >
            -
            </button>
            <p className="inc-dec-indicator">{value}</p>
            <button
            id={label}
            className={`inc-dec-btn inc-btn inc-btn${moduleName}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS[moduleType][id], payload: {value: "inc", id:e.target.id, moduleName, moduleType}})}
            onMouseDown={
                () => handleMouseEvent(`inc-btn${moduleName}${label}`, true)
            }
            onMouseUp={
                () => handleMouseEvent(`inc-btn${moduleName}${label}`, false)
            }
            >
            +
            </button>
            </div>
        </div>
    )
}

export default IncDecVertical
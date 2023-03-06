import { useContext } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { handleMouseEvent } from '../../services/general.services'
import { ModularBusContext } from '../../contexts/ModularBusContext'


const IncDec = ({value, label, moduleName, i, type}) => {
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook

    return (
        <div className="inc-dec-inner">
            {label && <p className="inc-dec-label sliderLabel">{label.toUpperCase()}</p>}
            <div className="inc-dec-btns-container">
            <button
            id={label} 
            className={`inc-dec-btn dec-btn dec-btn${moduleName}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS.osc.offset, payload: {value: "dec", id:e.target.id, i, moduleName, type}})}
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
            onClick={(e)=> updateState({type: ACTIONS.osc.offset, payload: {value: "inc", id:e.target.id, i, moduleName}})}
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

export default IncDec
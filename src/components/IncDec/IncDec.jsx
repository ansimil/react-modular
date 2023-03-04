import { useContext } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { handleMouseEvent } from '../../services/general.services'
import { ModularBusContext } from '../../contexts/ModularBusContext'


const IncDec = ({value, label, oscNum}) => {
    
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook

    return (
        <div className="inc-dec-inner">
            {label && <p className="inc-dec-label sliderLabel">{label.toUpperCase()}</p>}
            <div className="inc-dec-btns-container">
            <button
            id={label} 
            className={`inc-dec-btn dec-btn dec-btn${oscNum}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS.osc[oscNum].offset, payload: {value: "dec", id:e.target.id}})}
            onMouseDown={
                () => handleMouseEvent(`dec-btn${oscNum}${label}`, true)
            }
            onMouseUp={
                () => handleMouseEvent(`dec-btn${oscNum}${label}`, false)
            }
            >
            -
            </button>
            <p className="inc-dec-indicator">{value}</p>
            <button
            id={label}
            className={`inc-dec-btn inc-btn inc-btn${oscNum}${label} btn`}
            onClick={(e)=> updateState({type: ACTIONS.osc[oscNum].offset, payload: {value: "inc", id:e.target.id}})}
            onMouseDown={
                () => handleMouseEvent(`inc-btn${oscNum}${label}`, true)
            }
            onMouseUp={
                () => handleMouseEvent(`inc-btn${oscNum}${label}`, false)
            }
            >
            +
            </button>
            </div>
        </div>
    )
}

export default IncDec
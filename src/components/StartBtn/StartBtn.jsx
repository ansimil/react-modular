import { useContext } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import powerOn from '../../assets/icons/power-blue-icon3.png'
import powerOff from '../../assets/icons/power-grey-icon.png'
import './StartBtn.css'
import { TransportContext } from '../../contexts/TransportContext'

const StartBtn = () => {
    const { stateHook } = useContext(ModularBusContext)
    const { transportState, setTransportState } = useContext(TransportContext)
    const [ , updateState] = stateHook

    const change = e => {
        let id
        if (transportState.synthState.start) {
          id = 'stop'
        }
        else {
          id = 'start'
        }
        setTransportState({...transportState, synthState: {
          ...transportState.synthState, start: !transportState.synthState.start, startCount: 1
        }})
        updateState({type: ACTIONS.SYNTH[id], payload: { id }})
    }

  return (
    <div className="start-btn-container">
    
        <div className={transportState.synthState.start ? "start-btn-inner started" : "start-btn-inner"}>
            <div className="start-btn">
              <button
              id="start"
              title="on/off"
              onClick={change}
              className={transportState.synthState.start ? "btn-start btn-active btn-right-end": "btn-start btn-left-end"}
              >
                <img src={transportState.synthState.start ? powerOn : powerOff} alt="power-icon" /> 
              </button>
            </div>
            
            <div className={transportState.synthState.start ? "start-indicator start-indicator-on" : "start-indicator start-indicator-off"}>
            r
            </div>
        </div>
    </div>
  )
}

export default StartBtn
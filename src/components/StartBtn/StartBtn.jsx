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
    <div className="startBtnContainer">
    
        <div className={transportState.synthState.start ? "startBtnInner started" : "startBtnInner"}>
            <div className="startBtnDiv">
              <button
              id="start"
              title="on/off"
              onClick={change}
              className={transportState.synthState.start ? "startBtn activeBtn endBtnRight": "startBtn endBtnLeft"}
              >
              <img src={transportState.synthState.start ? powerOn : powerOff} alt="power-icon" /> 
              </button>
            </div>
            
            <div className={transportState.synthState.start ? "startBtnOn" : "startBtnOff"}>
            r
            </div>
        </div>
    </div>
  )
}

export default StartBtn
import { useContext } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import powerOn from '../../assets/icons/power-blue-icon3.png'
import powerOff from '../../assets/icons/power-grey-icon.png'
import './StartBtn.css'

const StartBtn = () => {
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const { synthSettings } = appState

    const change = e => {
        let id
        if (synthSettings.start) {
          id = 'stop'
        }
        else {
          id = 'start'
        }
        updateState({type: ACTIONS.SYNTH[id], payload: { id }})
    }

  return (
    <div className="startBtnContainer">
    
        <div className={synthSettings.start ? "startBtnInner started" : "startBtnInner"}>
            <div className="startBtnDiv">
              <button
              id="start"
              onClick={change}
              className={synthSettings.start ? "startBtn activeBtn endBtnRight": "startBtn endBtnLeft"}
              >
              <img src={synthSettings.start ? powerOn : powerOff} alt="power-icon" /> 
              </button>
            </div>
            
            <div className={synthSettings.start ? "startBtnOn" : "startBtnOff"}>
            r
            </div>
        </div>
    </div>
  )
}

export default StartBtn
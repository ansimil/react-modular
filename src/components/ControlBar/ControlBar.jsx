// import {useContext} from 'react'
import StartBtn from '../StartBtn/StartBtn'
import TimeComp from '../TimeComp/TimeComp'
// import { ModularBusContext } from '../../contexts/ModularBusContext'
import './ControlBar.css'

const ControlBar = () => {
    // const { stateHook } = useContext(ModularBusContext)
    // const [appState, updateState] = stateHook 
  
    return (
    <div className="controlBarContainer">
        <StartBtn/>
        <TimeComp />
    </div>
  )
}

export default ControlBar
import { useContext } from 'react'
import { Display } from "react-7-segment-display";
import { ModularBusContext } from "../../contexts/ModularBusContext";

import './SevenSegDisplay.css'

const SevenSegDisplay = () => {
  const { stateHook } = useContext(ModularBusContext)
  const [appState] = stateHook
  return (
    <div className="sevenSegDisplayContainer">
      <Display 
      value={appState.sequencerSettings.step+1}
      height="30"
      />
    </div>
  )
}

export default SevenSegDisplay
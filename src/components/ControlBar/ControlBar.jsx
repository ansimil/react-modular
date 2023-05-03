import { useEffect, useState } from 'react'
import StartBtn from '../StartBtn/StartBtn'
import TimeComp from '../TimeComp/TimeComp'
import HelpModal from '../HelpModal/HelpModal'
import PlayerControls from '../PlayerControls/PlayerControls'
import Oscilloscope from '../Oscilloscope/Oscilloscope'
import './ControlBar.css'
import qMark from '../../assets/icons/questionmark-icon.png'
import saveIcon from '../../assets/icons/save-preset-icon.png'
import PresetsModal from '../PresetsModal/PresetsModal'

const ControlBar = ({currentPatch, setCurrentPatch}) => {
    const [showModal, setShowModal] = useState(process.env.REACT_APP_ENVIRONMENT === 'dev' ? false : true)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)
    const toggleSaveModal = () => setShowSaveModal(!showSaveModal)

    useEffect(()=>{
      setCurrentPatch(localStorage.getItem("presetToLoad"))
    },[currentPatch, setCurrentPatch])

    return (
    <div className="controlBarContainer">
        <div className="controlbar-start-container controlbar-inner">
          <StartBtn/>
        </div>

        <div className="controlbar-middle-container controlbar-inner">
          <div className='bpmIndicatorContainer'>
            <div className='bpmIndicator'>
            </div>
          </div>
          <TimeComp />
          <PlayerControls/>
        </div>
        <div className="controlbar-end-container controlbar-inner">
          <div title={`Current Patch: ${currentPatch ? currentPatch : "--No saved patches--"}`} className='save-preset-container'>
            <p className="current-patch-title">Current patch:</p>
            <p title={currentPatch} className='valueIndicator currentPatchIndicator'>{currentPatch ? currentPatch : "--No saved patches--"}</p>
            <img title="Save/Load a Patch" onClick={toggleSaveModal} className='save-preset-icon' src={saveIcon} alt="save-preset" />
          </div>
          
          <Oscilloscope size={[60,30]} id={"small"}/>
          <div className="helpIconContainer">
          <img onClick={toggleModal} className="helpIcon" src={qMark} alt="help" />
          <HelpModal showModal={showModal} setShowModal={setShowModal}/>
          <PresetsModal showSaveModal={showSaveModal} setShowSaveModal={setShowSaveModal} currentPatch={currentPatch} setCurrentPatch={setCurrentPatch} />
          </div>
        </div>
    </div>
  )
}

export default ControlBar
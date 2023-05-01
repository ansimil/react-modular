import { useState } from 'react'
import StartBtn from '../StartBtn/StartBtn'
import TimeComp from '../TimeComp/TimeComp'
import HelpModal from '../HelpModal/HelpModal'
import PlayerControls from '../PlayerControls/PlayerControls'
import Oscilloscope from '../Oscilloscope/Oscilloscope'
import './ControlBar.css'
import qMark from '../../assets/icons/questionmark-icon.png'
import Presets from '../PresetsComp/Presets'

const ControlBar = () => {
    const [showModal, setShowModal] = useState(process.env.REACT_APP_ENVIRONMENT === 'dev' ? false : true)
    const toggleModal = () => setShowModal(!showModal)

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
          <Presets/>
          <Oscilloscope size={[60,30]} id={"small"}/>
          <div className="helpIconContainer">
          <img onClick={toggleModal} className="helpIcon" src={qMark} alt="help" />
          <HelpModal showModal={showModal} setShowModal={setShowModal}/>
          </div>
        </div>
    </div>
  )
}

export default ControlBar
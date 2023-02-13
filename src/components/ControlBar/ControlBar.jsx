import { useState } from 'react'
import StartBtn from '../StartBtn/StartBtn'
import TimeComp from '../TimeComp/TimeComp'
import HelpModal from '../HelpModal/HelpModal'
import PlayerControls from '../PlayerControls/PlayerControls'
import Oscilloscope from '../Oscilloscope/Oscilloscope'
import './ControlBar.css'
import qMark from '../../assets/icons/questionmark-icon.png'

const ControlBar = () => {
    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    return (
    <div className="controlBarContainer">
        <StartBtn/>
        {/* <div className='bpmIndicatorContainer'>
          <div className='bpmIndicator'>
          </div>
        </div> */}
        <TimeComp />
        <PlayerControls/>
        <Oscilloscope size={[60,30]} id={"small"}/>
        <div className="helpIconContainer">
        <img onClick={toggleModal} className="helpIcon" src={qMark} alt="help" />
        <HelpModal showModal={showModal} setShowModal={setShowModal}/>
        </div>
    </div>
  )
}

export default ControlBar
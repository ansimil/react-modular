// import {useContext} from 'react'
import { useState } from 'react'
import StartBtn from '../StartBtn/StartBtn'
import TimeComp from '../TimeComp/TimeComp'
import HelpModal from '../HelpModal/HelpModal'
// import { ModularBusContext } from '../../contexts/ModularBusContext'
import './ControlBar.css'
import qMark from '../../assets/icons/questionmark-icon.png'

const ControlBar = () => {
    const [showModal, setShowModal] = useState(false)
    // const { stateHook } = useContext(ModularBusContext)
    // const [appState, updateState] = stateHook 
    const toggleModal = () => setShowModal(!showModal)

    return (
    <div className="controlBarContainer">
        <StartBtn/>
        <TimeComp />
        <div className="helpIconContainer">
        <img onClick={toggleModal} className="helpIcon" src={qMark} alt="help" />
        <HelpModal showModal={showModal} setShowModal={setShowModal}/>
        </div>
    </div>
  )
}

export default ControlBar
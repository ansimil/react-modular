import { useEffect, useState, useContext } from 'react'
import StartBtn from '../StartBtn/StartBtn'
import TimeComp from '../TimeComp/TimeComp'
import HelpModal from '../HelpModal/HelpModal'
import PlayerControls from '../PlayerControls/PlayerControls'
import Oscilloscope from '../Oscilloscope/Oscilloscope'
import './ControlBar.css'
import qMark from '../../assets/icons/questionmark-icon.png'
import saveIcon from '../../assets/icons/save-preset-icon.png'
import PresetsModal from '../PresetsModal/PresetsModal'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import toast from 'react-hot-toast'

const ControlBar = ({currentPatch, setCurrentPatch}) => {
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook
    const [showModal, setShowModal] = useState(process.env.REACT_APP_ENVIRONMENT === 'dev' ? false : true)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const toggleModal = (e) => {
        setShowModal(!showModal)
    }
    const toggleSaveModal = async (e) => {
      if (e.shiftKey) {
          const currentPatch = await localStorage.getItem("presetToLoad")
          if (!currentPatch) {
            toast.error(`No currently saved patches. Please save an initial patch and select a name before using the quick save feature`, {
              style: {
                  marginTop: "5rem",
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                  fontFamily: "mainFont"
              }
            })
            return
          }
          await updateState({type: ACTIONS.SYNTH.overwritePreset, payload: {value: currentPatch}})
          toast.success(`'${currentPatch}' has been successfully saved`, {
              style: {
                  marginTop: "5rem",
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                  fontFamily: "mainFont"
              }
            })
      }
      else {
        setShowSaveModal(!showSaveModal)
      }
      
    }

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
          <div title={`Current Patch: ${currentPatch ? currentPatch : "--Default Patch--"}`} className='save-preset-container'>
            <p className="current-patch-title">Current patch:</p>
            <p title={currentPatch} className='valueIndicator currentPatchIndicator'>{currentPatch ? currentPatch : "--Default Patch--"}</p>
            <img 
            title="Save/Load options. Shift+click for quick save" 
            onClick={(e) => {
              toggleSaveModal(e)
            }  
            } 
            className='save-preset-icon' 
            src={saveIcon} 
            alt="save-preset" />
          </div>
          
          <Oscilloscope size={[60,30]} id={"small"}/>
          <div className="helpIconContainer">
          <img 
          onClick={(e) => {
            toggleModal(e)
          }} 
          className="helpIcon" 
          src={qMark} 
          alt="help"   
          />
          <HelpModal showModal={showModal} setShowModal={setShowModal}/>
          <PresetsModal showSaveModal={showSaveModal} setShowSaveModal={setShowSaveModal} currentPatch={currentPatch} setCurrentPatch={setCurrentPatch} />
          </div>
        </div>
    </div>
  )
}

export default ControlBar
import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../contexts/ModularBusContext'
import './SeqLength.css'

const SeqLength = () => {
    const { stateHook, sequencerRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

    const lengthMap = {
        2: {
            up: {
                min: 0,
                max: 2
            },
            down: {
                min: 0,
                max: 1
            }
        },
        4: {
            up: {
                min: 0,
                max: 4
            },
            down: {
                min: 0,
                max: 3
            }
        },
        8: {
            up: {
                min: 0,
                max: 8
            },
            down: {
                min: 0,
                max: 7
            }
        },
        16: {
            up: {
                min: 0,
                max: 16
            },
            down: {
                min: 0,
                max: 15
            }
        }
    }

    const changeSeqLength = (length) => {
        if (sequencerRef.current.stepper.mode === "up"){
            sequencerRef.current.stepper.min = lengthMap[length].up.min
            sequencerRef.current.stepper.max = lengthMap[length].up.max

        }
        else if (sequencerRef.current.stepper.mode === "down"){
            sequencerRef.current.stepper.min = lengthMap[length].down.min
            sequencerRef.current.stepper.max = lengthMap[length].down.max
        }
        console.log('mode', sequencerRef.current.stepper.mode, 'min', sequencerRef.current.stepper.min, 'max', sequencerRef.current.stepper.max)
        updateState({type: ACTIONS.SEQUENCER.length, payload:  {value: length}})
    }

  return (
    <div className="sequencerLengthContainer">
        <div className="lengthLabel">
            <p>length</p>
        </div>
        <div className="lengthBtnsContainer">
            <button
            className={appState.sequencerSettings.length === 2 ? "btn lengthBtn endBtnLeft activeBtn" : "btn lengthBtn endBtnLeft"}
            onClick={(e)=>{
                changeSeqLength(2)
                }}
            >
            2
            </button>
            <button
            className={appState.sequencerSettings.length === 4 ? "btn lengthBtn middleBtn activeBtn" : "btn lengthBtn middleBtn"}
            onClick={(e)=>{
                changeSeqLength(4)
                }}>
            4
            </button>
            <button             
            className={appState.sequencerSettings.length === 8 ? "btn lengthBtn middleBtn activeBtn" : "btn lengthBtn middleBtn"}
            onClick={(e)=>{
                changeSeqLength(8)
                }}>
            8
            </button>
            <button
            className={appState.sequencerSettings.length === 16 ? "btn lengthBtn endBtnRight activeBtn" : "btn lengthBtn endBtnRight"}
            onClick={(e)=>{
                changeSeqLength(16)
                }}>
            16
            </button>
        </div>
    </div>
  )
}

export default SeqLength
import { useContext, useEffect, useState } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { handleMouseEvent } from '../../services/general.services'
import Nexus from 'nexusui'
import './Keyboard.css'


const Keyboard = () => {
    const [ noteState, setNoteState ] = useState(3)
    const { stateHook } = useContext(ModularBusContext)
    const [, updateState] = stateHook
    let midiNoteArr = [[24, 36], [36, 48], [48, 60], [60, 72], [72, 84], [84, 96], [96, 108]]

    const keyMapper = {
        a: 0,
        w: 1,
        s: 2,
        e: 3,
        d: 4,
        f: 5,
        t: 6,
        g: 7,
        y: 8,
        h: 9,
        u: 10,
        j: 11,
        k: 12,
    }     

    useEffect(()=>{
        keyboardRef.current?.destroy()
        const keyboard = new Nexus.Piano('#keyboard', {
            'size': [300,150],
            'mode': 'button',
            'lowNote': midiNoteArr[noteState][0],
            'highNote': midiNoteArr[noteState][1],
        })
        keyboard.on("change", handleKeyboard)
        keyboard.keys.forEach(key => {
            if(key.color === "w"){
            key.colors.accent = "#fafdd1"
            }
            else {
                key.colors.accent = "#f7ff61" 
            }
        })

        keyboardRef.current = keyboard
        let { current } = keyboardRef
        document.addEventListener('keypress', (event) => {
            switch (event.key){
                case ".":
                    if (noteState <= 4) {
                        setNoteState(noteState+1)
                    }
                    event.Handled = true
                    return (event.key)

                case ",":
                    if (noteState >= 1) {
                        setNoteState(noteState-1)
                    }
                    event.Handled = true
                    return (event.key)

                default: 
                return null
            }
        })

        document.addEventListener('keydown', (event) => {
            let keyIndex = keyMapper[event.key];
           
            if (keyIndex !== undefined && !current?.keys[keyIndex]._state.state) {
                current?.toggleIndex(keyIndex, true)
                event.Handled = true
            }
            else {
                return null
            }
          });
          
          document.addEventListener('keyup', (event) => {
            let keyIndex = keyMapper[event.key];
            
            if (keyIndex !== undefined && current?.keys[keyIndex]._state.state) {
                current?.toggleIndex(keyIndex, false)
                event.Handled = true
            }
            else {
                return null
            }
          });
    // eslint-disable-next-line 
    },[noteState])
    const { keyboardRef } = useContext(ModularBusContext)


    const handleKeyboard = (e) => {
        const { note, state } = e
        updateState({type: ACTIONS.keyboard.note, payload: {note, stateKey: state}})
    }


  return (
    <div className='keyboardContainer'>
        <div className="moduleInfo">
            <div className="moduleInfoInnerSeq">
                <p>{`keys`}</p>
            </div>
        </div>
        <div className="moduleSettingsInner">
        <div className="keyboardContainerInner">
            <div id='keyboard'></div>
        </div>
        <div className="octaveInfo">
            
            <div className="octaveBtns">
                
                
                <button 
                disabled={noteState >= 1 ? "" : true} 
                className={noteState>=1 ? "btn octaveDownBtn": "btn octaveDownBtn disabledBtn"} 
                onClick={()=> {
                    setNoteState(noteState-1)
                }}
                onMouseDown={()=>{
                    handleMouseEvent("octaveDownBtn", true)
                }}
                onMouseUp={()=>{
                    handleMouseEvent("octaveDownBtn", false)
                }}
                >
                -
                </button>
                <p className="valueIndicator octaveIndicator">{noteState+1}</p>
                <button 
                disabled={noteState<=4 ? "" : true} 
                className={noteState<=4 ? "btn octaveUpBtn": "octaveUpBtn btn disabledBtn"} 
                onClick={()=> {
                    setNoteState(noteState+1)
                    }}
                onMouseDown={()=>{
                    handleMouseEvent("octaveUpBtn", true)
                }}
                onMouseUp={()=>{
                    handleMouseEvent("octaveUpBtn", false)
                }}
                >
                +
                </button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Keyboard
import { useContext, useEffect } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import * as Tone from 'tone'
import Nexus from 'nexusui'
import './Sequencer.css'

const Sequencer = () => {
  const { stateHook, sequencerRef, seqSlidersRef } = useContext(ModularBusContext)
  // eslint-disable-next-line
  const [appState, updateState] = stateHook
  const { sequencerSettings } = appState
  const arr = Object.keys(sequencerSettings.sliders)
  const notesObject = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
  }

  const handleInc = (id, i) => {
    if (appState.sequencerSettings.sliders[i].octave < 6){
    let value = appState.sequencerSettings.sliders[i].octave + 1
    updateState({type: ACTIONS.SEQUENCER[id], payload: {id, value, i}})
    }
  }

  const handleDec = (id, i) => {
    if (appState.sequencerSettings.sliders[i].octave > 0){
    let value = appState.sequencerSettings.sliders[i].octave - 1
    updateState({type: ACTIONS.SEQUENCER[id], payload: {id, value, i}})
    }
  }

  const change = (e, i) => {
    const [ value ] = e
    updateState({type: ACTIONS.SEQUENCER.note, payload: {value, i}})
  }

  const handleStep = (time) => {
    
    sequencerRef.current.next()
    const { value } = sequencerRef.current.stepper
    if (sequencerRef.current.cells[value]._state.state) {
      updateState({type: ACTIONS.SEQUENCER.step, payload: {value, time}})
    }
  }

  useEffect(()=>{
    const sequencerWidth = 600
    if (sequencerRef.current){
      sequencerRef.current.destroy()
    }
    if (seqSlidersRef.current){
      seqSlidersRef.current.forEach(slider => {
        slider.destroy()
      })
    }


    Tone.Transport.scheduleRepeat(function(time){
      const [bpm] = document.getElementsByClassName('bpmIndicator')
      const clock = ((60 / appState.synthSettings.bpm) * 1000) / 8
      bpm.classList.add('activeBpmIndicator')
      console.log('on')
      setTimeout(()=>{
      bpm.classList.remove('activeBpmIndicator')
      console.log('off')
      }, clock)
      handleStep(time)
    }, "16n")

    let sequencer = new Nexus.Sequencer("#sequencer", {
      "size": [sequencerWidth,30],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })

    let sliders = []
    arr.forEach(i => {
      let slider = new Nexus.Multislider(`#slider${i}`, {
        'size': [(sequencerWidth/16)-2,100],
        'numberOfSliders': 1,
        'min': 0,
        'max': 11,
        'step': 1,
        'values': [[sequencerSettings.sliders[i].note]],
        'smoothing': 0,
        'mode': 'bar'
      })
      slider.on("change", (e) => {
        change(e, i)
      })
      slider.bars[0].attributes[5].value = "#fafdd1"
      slider.caps[0].attributes[4].value = "#000"
      slider.element.attributes[2].value = "background-color: rgb(255, 255, 255); cursor: pointer;"
      sliders.push(slider)
    })
    seqSlidersRef.current = sliders

    sequencer.on("step", (e) => {
      // handleStep(e)
    })
    sequencer.interval.rate = 60 / appState.synthSettings.bpm * 1000
    sequencer.colors.accent = "#000"
    sequencer.colors.mediumLight = "#fff"
    sequencerRef.current = sequencer
  // eslint-disable-next-line
  },[])

  return (
    <div className="sequencerContainer">
    
      <div className="sequencerNotesGates">
        <div id="sequencer"></div>
        <div className="slidersContainer">

          {arr.map((i) => {
            return (
              <div key={i} id={`slider${i}`}></div>
            )
          })}
          </div>

          <div className='notesAndOctaves'>
            <div className="sequencerNotes">
              {arr.map(i => {
                return (
                  <p key={i}>{notesObject[sequencerSettings.sliders[i].note]}</p>
                )
              })}
            </div>
            <div className="noteOctave">
            {arr.map(i => {
                return (
                  <div key={i} className="noteOctaveInner">
                    <p>{sequencerSettings.sliders[i].octave}</p>
                    <div className="bpmIncDecContainer">
                      <button
                      disabled={sequencerSettings.sliders[i].octave >= 6 ? true: ""}
                      className="bpmBtn bpmTopBtn" 
                      onClick={()=> {
                        handleInc("octave", i)
                      }}
                      >
                      +
                      </button>
                      <button
                      disabled={sequencerSettings.sliders[i].octave <= 1 ? true: ""}
                      className="bpmBtn bpmBtmBtn"
                      onClick={()=> {
                        handleDec("octave", i)
                      }}
                      >
                      -
                      </button>
                    </div>
                  </div>
                )
            })
            }
            </div>
          </div>
        
      </div>
      
    </div>
  )
}

export default Sequencer
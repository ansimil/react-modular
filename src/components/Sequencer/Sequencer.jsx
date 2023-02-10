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
  const counter = new Nexus.Counter(0,16)
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

  const handleStep = (e) => {
    counter.next()
    const { value } = counter
    const [stepBool] = e
    if (stepBool) {
      updateState({type: ACTIONS.SEQUENCER.step, payload: {value}})
    }
  }

  useEffect(()=>{
    if (sequencerRef.current){
      sequencerRef.current.destroy()
    }
    if (seqSlidersRef.current){
      seqSlidersRef.current.forEach(slider => {
        slider.destroy()
      })
    }
    Tone.Transport.scheduleRepeat(function(time){
      sequencerRef.current.next()
    }, "8n")

    let sequencer = new Nexus.Sequencer("#sequencer", {
      "size": [300,25],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })

    let sliders = []
    arr.forEach(i => {
      let slider = new Nexus.Multislider(`#slider${i}`, {
        'size': [20,100],
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
      slider.bars[0].attributes[5].value = "#dedede"
      slider.caps[0].attributes[4].value = "#000"
      slider.element.attributes[2].value = "backgroundColor: rgb(255, 255, 255); cursor: pointer;"
      sliders.push(slider)
    })
    seqSlidersRef.current = sliders

    sequencer.on("step", (e) => {
      handleStep(e)
    })
    sequencer.interval.rate = 60 / appState.synthSettings.bpm * 1000
    sequencer.colors.accent = "#000"
    sequencer.colors.mediumLight = "#000"
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
      <div className="sequencerControlsContainer">
        <button onClick={()=>{Tone.Transport.start()}}>Start</button>
        <button onClick={()=>{Tone.Transport.stop()}}>Stop</button>
      </div>
    </div>
  )
}

export default Sequencer
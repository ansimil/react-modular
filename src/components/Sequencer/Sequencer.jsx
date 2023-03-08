import { useContext, useEffect } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import SeqLength from '../SeqLength/SeqLength'
import SevenSegDisplay from '../SevenSegDisplay/SevenSegDisplay'
import RandomSequenceBtn from '../RandomSequenceBtn/RandomSequenceBtn'
import RandomGatesBtn from '../RandomGatesBtn/RandomGatesBtn'
import RandomizeNotes from '../RandomizeNotes/RandomizeNotes'
import { handleMouseEvent } from '../../services/general.services'
import * as Tone from 'tone'
import Nexus from 'nexusui'
import './Sequencer.css'

const Sequencer = () => {
  const { stateHook, sequencerRef, seqSlidersRef } = useContext(ModularBusContext)
  // eslint-disable-next-line
  const [appState, updateState] = stateHook
  const { sequencerSettings } = appState
  const arr = Object.keys(sequencerSettings.track1.sliders)

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

  const randomizeGates = () => {
    sequencerRef.current.matrix.populate.row(0, [0.5])
  }

  const handleInc = (id, i) => {
    if (appState.sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave < 6){
    let value = appState.sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave + 1
    updateState({type: ACTIONS.SEQUENCER[id], payload: {id, value, i}})
    }
  }

  const handleDec = (id, i) => {
    if (appState.sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave > 0){
    let value = appState.sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave - 1
    updateState({type: ACTIONS.SEQUENCER[id], payload: {id, value, i}})
    }
  }

  const change = (e, i) => {
    let value
    if (Array.isArray(e)){
      [ value ] = e
    }
    else {
      value = e.value
    }
    updateState({type: ACTIONS.SEQUENCER.note, payload: {value, i}})
  }

  const handleStep = () => {
    sequencerRef.current.forEach(track => {
      track.next()
    })
  }

  const handleTrigger = (time) => {
    const { value } = sequencerRef.current[0].stepper
    
    updateState({type: ACTIONS.SEQUENCER.updateStepValue, payload: {value}})
    
    if (sequencerRef.current[0].cells[value]._state.state) {
      updateState({type: ACTIONS.SEQUENCER.step, payload: {value, time}})
    }

    seqSlidersRef.current.forEach(slider => {
      if (slider.parent.id === `slider${value}`){
        slider.parent.className = "activeSeqSlider"
      }
      else {
        slider.parent.className = ""
      }
    })
  }

  const changeCurrentTrack = (e) => {
    const { id: i} = e.target
    updateState({type: ACTIONS.SEQUENCER.currentTrack, payload: {value: i}})
  }

  const loadTrackSliders = (e) => {
      const { id } = e.target
      seqSlidersRef.current.forEach((slider, i) => {
        slider.setSlider(0, sequencerSettings[`track${id}`].sliders[i].note)
        slider.render()
      })
  }

  useEffect(()=>{
    const sequencerWidth = 600
    const [bpm] = document.getElementsByClassName('bpmIndicator')

    if (sequencerRef.current){
      sequencerRef.current.forEach((track)=>{
        track.destroy()
      })
    }
    if (seqSlidersRef.current){
      seqSlidersRef.current.forEach(slider => {
        slider.destroy()
      })
    }
    
    Tone.Transport.scheduleRepeat(()=>{
      if (bpm.classList.length > 1) {
        bpm.classList.remove('activeBpmIndicator')
      }
      else {
        bpm.classList.add('activeBpmIndicator')
      }
    }, "32n")


    Tone.Transport.scheduleRepeat(function(time){ 
        handleStep()
        handleTrigger(time)
    }, "16n")

    let track1 = new Nexus.Sequencer("#seq-track1", {
      "size": [sequencerWidth,37.5],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })

    let track2 = new Nexus.Sequencer("#seq-track2", {
      "size": [sequencerWidth,37.5],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })

    let sliders = []
    arr.forEach(i => {
      let slider = new Nexus.Multislider(`#slider${i}`, {
        'size': [(sequencerWidth/16)-1,120],
        'numberOfSliders': 1,
        'min': 0,
        'max': 11,
        'step': 1,
        'values': [[sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].note]],
        'smoothing': 0,
        'mode': 'bar'
      })
      slider.on("change", (e) => {
        change(e, i)
      })
      slider.bars[0].attributes[5].value = "#fafdd1"
      slider.caps[0].attributes[4].value = "#000"
      slider.element.attributes[2].value = "background-color: rgb(57, 57, 57); cursor: pointer;"
      sliders.push(slider)
    })
    seqSlidersRef.current = sliders

    track1.interval.rate = 60 / appState.synthSettings.bpm * 1000
    track1.colors.accent = "#000"
    track1.colors.mediumLight = "#fafdd1"
    track2.interval.rate = 60 / appState.synthSettings.bpm * 1000
    track2.colors.accent = "#000"
    track2.colors.mediumLight = "#fafdd1"
    sequencerRef.current = [track1, track2]
  // eslint-disable-next-line
  },[])

  return (
    <div className="sequencerContainer">
      <div className="moduleInfo">
        <div className="moduleInfoInnerSeq">
            <p>{`seq`}</p>
        </div>
      </div>
      <div className="sequencerInner">
      <div className="sequencerNotesGates">
        <div id="seq-track1"></div>
        <div id="seq-track2"></div>
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
                  <p key={i}>{notesObject[sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].note]}</p>
                )
              })}
            </div>
            <div className="noteOctave">
            {arr.map(i => {
                return (
                  <div key={i} className="noteOctaveInner">
                    <p>{sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave}</p>
                    <div className="bpmIncDecContainer">
                      <button
                      disabled={sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave >= 6 ? true: ""}
                      className={`bpmBtn bpmTopBtn octave-up-${i}`} 
                      onClick={()=> {
                        handleInc("octave", i)
                      }}
                      onMouseDown={
                        () => handleMouseEvent(`octave-up-${i}`, true)
                      }
                      onMouseUp={
                        () => handleMouseEvent(`octave-up-${i}`, false)
                      }
                      >
                      +
                      </button>
                      <button
                      disabled={sequencerSettings[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave <= 1 ? true: ""}
                      className={`bpmBtn bpmBtmBtn octave-down-${i}`}
                      onClick={()=> {
                        handleDec("octave", i)
                      }}
                      onMouseDown={
                        () => handleMouseEvent(`octave-down-${i}`, true)
                      }
                      onMouseUp={
                        () => handleMouseEvent(`octave-down-${i}`, false)
                      }
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
      <div className="sequencerSettingsContainer">
        <div className="sequencer-settings-inner">
          <SevenSegDisplay />
          <div className="sequencer-settings-inner-inner">
            <div className="sequencer-settings-topthird">
            <SeqLength />
            <RandomSequenceBtn />
            <RandomGatesBtn randomizeFunc={randomizeGates}/>
            </div>
            <div className="sequencer-settings-middlethird">
            <RandomizeNotes seqSlidersRef={seqSlidersRef}/>
            </div>
            <div className="sequencer-settings-bottomthird">
            <div style={{"display": "flex"}}>
              <button
              className="btn selector-btn"
              id="1"
              onClick={(e) => {
                changeCurrentTrack(e)
                loadTrackSliders(e)
              }}
              >
              Track 1
              </button>
              <button
              className="btn selector-btn"
              id="2"
              onClick={(e) => {
                changeCurrentTrack(e)
                loadTrackSliders(e)
              }}
              >
              Track 2
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Sequencer
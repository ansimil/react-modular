import { useContext, useEffect } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import SeqLength from '../SeqLength/SeqLength'
import SevenSegDisplay from '../SevenSegDisplay/SevenSegDisplay'
import RandomSequenceBtn from '../RandomSequenceBtn/RandomSequenceBtn'
import RandomGatesBtn from '../RandomGatesBtn/RandomGatesBtn'
import RandomizeNotes from '../RandomizeNotes/RandomizeNotes'
import TrackAssignmentComp from '../TrackAssignmentComp/TrackAssignmentComp'
import ShowTrackNotes from '../ShowTrackNotes/ShowTrackNotes'
import { handleMouseEvent } from '../../services/general.services'
import * as Tone from 'tone'
import Nexus from 'nexusui'
import './Sequencer.css'

const Sequencer = () => {
  const { stateHook, sequencerRef, seqSlidersRef } = useContext(ModularBusContext)
  // eslint-disable-next-line
  const [appState, updateState] = stateHook
  const { sequencerSettings } = appState
  const arr = Object.keys(sequencerSettings.tracks.track1.sliders)
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

  const highlightCell = (cell, i) => {
    let row = cell.row
    let column = cell.column
    sequencerRef.current.forEach(track => {
      track.cells.forEach(cell => {
        if (!cell._state.state) {
          cell.element.children[0].style.fill = "#eee"
      }
      else if (cell._state.state) {
          cell.element.children[0].style.fill = "#000"
      }
      })
    })
    sequencerRef.current[i].cells.forEach(cell => {
    if ((cell.row === row && cell.column === column) && !cell._state.state) {
      cell.element.children[0].style.fill = "#fafdd1" 
    }
    })
    
  }

  const randomizeGates = () => {
    sequencerRef.current.forEach(track => {
      track.matrix.populate.row(0, [0.5])
    })
  }

  const handleInc = (id, i) => {
    if (appState.sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave < 6){
    let value = appState.sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave + 1
    updateState({type: ACTIONS.SEQUENCER[id], payload: {id, value, i}})
    }
  }

  const handleDec = (id, i) => {
    if (appState.sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave > 0){
    let value = appState.sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave - 1
    updateState({type: ACTIONS.SEQUENCER[id], payload: {id, value, i}})
    }
  }

  const toggleCell = (e, i) => {
    sequencerRef.current?.forEach(track => {
      track.cells.forEach(cell => {
        if (cell.row === e.row && cell.column === e.column && e.state) {
            cell.element.children[0].style.fill = "#000"
        }
        if (cell.row === e.row && cell.column === e.column && !e.state){
            cell.element.children[0].style.fill = "#eee"
        }
        highlightCell(e, i)
      })
    })
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
    const randStep = Math.floor(Math.random()*16)

    if (sequencerSettings.random){
      sequencerRef.current.forEach(track => {
        track.stepper.value = randStep
        track.next()
      })
    }
    else {
    sequencerRef.current.forEach(track => {
      track.next()
    })
    }
  }

  const handleTrigger = (time) => {
    const { value } = sequencerRef.current[0].stepper
    const highSteps = []
    updateState({type: ACTIONS.SEQUENCER.updateStepValue, payload: {value}})
    
    sequencerRef.current.forEach(track => {
      if (track.cells[value]._state.state) {
        highSteps.push(1)
      }
      else {
        highSteps.push(0)
      }
    })
    
    updateState({type: ACTIONS.SEQUENCER.trigger, payload: {value, time, highSteps}})

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
        slider.setSlider(0, sequencerSettings.tracks[`track${id}`].sliders[i].note)
        slider.render()
      })
  }

  useEffect(()=>{
    Tone.Transport.cancel(0)
    const [bpm] = document.getElementsByClassName('bpmIndicator')
    Tone.Transport.scheduleRepeat(()=>{
      if (bpm.classList.length > 1) {
        bpm.classList.remove('activeBpmIndicator')
      }
      else {
        bpm.classList.add('activeBpmIndicator')
      }
    }, "32n")


    Tone.Transport.scheduleRepeat((time) => { 
        handleStep()
        handleTrigger(time)
    }, "16n")
  // eslint-disable-next-line
  },[sequencerSettings.random])

  useEffect(()=>{
    const sequencerWidth = 600

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
    let tracks = []
    let track1 = new Nexus.Sequencer("#seq-track1", {
      "size": [sequencerWidth,37.5],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })
    tracks.push(track1)
    let track2 = new Nexus.Sequencer("#seq-track2", {
      "size": [sequencerWidth,37.5],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })
    tracks.push(track2)

    let sliders = []
    arr.forEach(i => {
      let slider = new Nexus.Multislider(`#slider${i}`, {
        'size': [(sequencerWidth/16)-1,120],
        'numberOfSliders': 1,
        'min': 0,
        'max': 11,
        'step': 1,
        'values': [[sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].note]],
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

    tracks.forEach((track, i) => {
      track.on("change", (e) => {
        toggleCell(e, i)
      })
      track.interval.rate = 60 / appState.synthSettings.bpm * 1000
      track.colors.accent = "#000"
      track.colors.mediumLight = "#fafdd1"
      track.cells.forEach(cell => {
        cell.element.addEventListener("mouseover", (e) => {
            highlightCell(cell, i)
        })
    })
    })
    sequencerRef.current = tracks
  // eslint-disable-next-line
  },[])

  return (
    <div className="sequencerContainer">
      <div className="moduleInfo">
        <div className="moduleInfoInnerSeq">
            <p>{`seq`}</p>
        </div>
      </div>
      <div 
      className="sequencerInner"
      onMouseOver={(e) => {
        const verticalLabels = document.getElementsByClassName('verticalLabels')[0].childNodes
        const horizontalLabels = Array.from(document.getElementsByClassName('horizontal-label'))
        
        if (e.target.nodeName !== "rect") {
        sequencerRef.current?.forEach(track=> {
          track.cells.forEach(cell => {
            if (cell._state.state) {
                cell.element.children[0].style.fill = "#000"
            }
            else {
                cell.element.children[0].style.fill = "#eee"
            }
        })
        })
        if (e.target.nodeName !== "rect" && e.target.nodeName !== "svg"){
            verticalLabels.forEach((label) => {
            label.style.color = "#000"
            label.children[0].style.borderBottom = "none"
        })
        horizontalLabels.forEach((label) => {
            label.style.color = "#000"
            label.children[0].style.borderBottom = "none"
        })
        }
        }}}
        >
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
                  <p key={i}>{notesObject[sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].note]}</p>
                )
              })}
            </div>
            <div className="noteOctave">
            {arr.map(i => {
                return (
                  <div key={i} className="noteOctaveInner">
                    <p>{sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave}</p>
                    <div className="bpmIncDecContainer">
                      <button
                      disabled={sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave >= 6 ? true: ""}
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
                      disabled={sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave <= 1 ? true: ""}
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
      <ShowTrackNotes changeCurrentTrack={changeCurrentTrack} loadTrackSliders={loadTrackSliders} />
      {sequencerRef.current && <TrackAssignmentComp sequencerRef={sequencerRef} />}

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
            
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Sequencer
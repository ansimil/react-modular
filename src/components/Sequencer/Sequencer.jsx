import { useContext, useEffect } from 'react'
import { ACTIONS } from '../../utils/ACTIONS'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import SeqLength from '../SeqLength/SeqLength'
// import SevenSegDisplay from '../SevenSegDisplay/SevenSegDisplay'
import RandomSequenceBtn from '../RandomSequenceBtn/RandomSequenceBtn'
import RandomGatesBtn from '../RandomGatesBtn/RandomGatesBtn'
import RandomizeNotes from '../RandomizeNotes/RandomizeNotes'
import TrackAssignmentComp from '../TrackAssignmentComp/TrackAssignmentComp'
import ShowTrackNotes from '../ShowTrackNotes/ShowTrackNotes'
import IncDecVertical from '../IncDecVertical/IncDecVertical'
import * as Tone from 'tone'
import Nexus from 'nexusui'
import './Sequencer.css'

const Sequencer = () => {
  const sequencerWidth = 600
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
    sequencerRef.current[i]?.cells.forEach(cell => {
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


  const toggleCell = (e, i) => {
    sequencerRef.current?.forEach((track, trackIdx) => {
      track.cells.forEach(cell => {
        if (cell.row === e.row && cell.column === e.column && e.state) {
            cell.element.children[0].style.fill = "#000"
            updateState({type: ACTIONS.SEQUENCER.toggleGate, payload: { value: [i, e.column, true]}})
        }
        if (cell.row === e.row && cell.column === e.column && !e.state) {
            cell.element.children[0].style.fill = "#eee"
            updateState({type: ACTIONS.SEQUENCER.toggleGate, payload: { value: [i, e.column, false]}})
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

    const stepIndicatorArr = [...document.getElementsByClassName("sequencer-step-indicators")]
    stepIndicatorArr[0].childNodes.forEach((step, i) => {
      if (value === i){
        step.classList.add("active-step-indicator")
      }
      else {
        step.classList.remove("active-step-indicator")
      }
    })

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
        'size': [(sequencerWidth/16)-2,150],
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
    Object.keys(sequencerSettings.tracks).forEach((track, trackIdx) => {
      Object.keys(sequencerSettings.tracks[track].sliders).forEach((step, i) => {
        if (sequencerSettings.tracks[track].sliders[step].active){
          sequencerRef.current?.[trackIdx].cells.forEach(cell => {
            // console.log(cell.column, step)
            if (Number(cell.column) === Number(step)){
              sequencerRef.current?.[trackIdx].matrix.toggle.column(cell.column)
            }
          })
        }
      })
    })
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
        <div className="sequencer-gates-container">
          <div className='sequencer-step-indicators'>
          {arr.map((num, i) => {
            let border
            if (i === 0){
              border = "border-left"
            }
            else if (i === 15) {
              border = "border-right"
            }
            else if ((i !== 0) && (i !== 15) && ((i+1) % 4 === 0)) {
              border = "border-right"
            }
            return (
              <p key={`seqStepLabel${i}`} className={border ? `sequencer-step-indicator ${border}` : "sequencer-step-indicator"} style={{width: (sequencerWidth-2.5)/16 }}>{Number(i)+1}</p>
            )
          })}
          </div>
          <div id="seq-track1"></div>
          <div id="seq-track2"></div>
        </div>
        <div className="slidersContainer">

          {arr.map((i) => {
            return (
              <div key={`seqSlider${i}`} id={`slider${i}`}></div>
            )
          })}
          </div>

          <div className='notesAndOctaves'>
            <div className="sequencerNotes">
              <p className="inc-dec-label sliderLabel">NOTE</p>
              <div className="sequencer-inc-dec-note-container">
                {arr.map(i => {
                  return (
                    <p key={`stepLabel${i}`}>{notesObject[sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].note]}</p>
                  )
                })}  
              </div>
            </div>
            <div className="noteOctave">
              <p className="inc-dec-label sliderLabel">OCTAVE</p>

              <div className="sequencer-inc-dec-octave-container">
              {arr.map(i => {
                  return (
                    <IncDecVertical key={`incDec${i}`} moduleType={"SEQUENCER"} moduleName={`slider${i}`} id={"octave"} i={i} value={sequencerSettings.tracks[`track${appState.sequencerSettings.currentTrack}`].sliders[i].octave} />
                  )
              })
              }
              </div>
            </div>
          </div>
        
      </div>
      <ShowTrackNotes changeCurrentTrack={changeCurrentTrack} loadTrackSliders={loadTrackSliders} />
      {sequencerRef.current && <TrackAssignmentComp sequencerRef={sequencerRef} />}

      <div className="sequencerSettingsContainer">
        <div className="sequencer-settings-inner">
          {/* <SevenSegDisplay /> */}
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
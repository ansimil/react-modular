import { useContext, useEffect } from 'react'
// import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'
import './Sequencer.css'

const Sequencer = () => {
  const { stateHook, sequencerRef, seqSlidersRef, transport } = useContext(ModularBusContext)
  // eslint-disable-next-line
  const [appState, updateState] = stateHook
  const arr = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
  ]

  // transport.scheduleRepeat((time) => {
  //   sequencerRef.current.stepper.next();
  // }, "8n");


  useEffect(()=>{
    let sliderVals = [...appState.sequencerSettings.sliders]
    if (sequencerRef.current){
      sequencerRef.current.destroy()
    }
    let sequencer = new Nexus.Sequencer("#sequencer", {
      "size": [300,25],
      "mode": "toggle",
      "rows": 1,
      "columns": 16,
      "paddingColumn": 2
    })
    let sliders = []
    sliderVals.forEach((step, i) => {
      let slider = new Nexus.Multislider(`#slider${i}`, {
        'size': [20,100],
        'numberOfSliders': 1,
        'min': 0,
        'max': 11,
        'step': 1,
        'values': [[step]],
        'smoothing': 0,
        'mode': 'bar'
      })
      slider.bars[0].attributes[5].value = "#dedede"
      slider.caps[0].attributes[4].value = "#000"
      slider.element.attributes[2].value = "background-color: rgb(255, 255, 255); cursor: pointer;"
      sliders.push(slider)
    })
    seqSlidersRef.current = sliders
    sequencer.interval.rate = 1000
    sequencer.start()
    sequencer.colors.accent = "#000"
    sequencer.colors.mediumLight = "#000"
    sequencerRef.current = sequencer
  // eslint-disable-next-line
  },[])

  return (
    <div className="sequencerContainer">
    <div id="sequencer"></div>
    <div className="slidersContainer">
    {arr.map((i) => {
      return (
        <div key={i} id={`slider${i}`}></div>
      )
    })}
    </div>
    <div>
      <button onClick={()=>{transport.start()}}>Start</button>
      <button onClick={()=>{transport.stop()}}>Stop</button>
    </div>
    </div>
  )
}

export default Sequencer
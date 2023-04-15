import { useEffect } from 'react'
import Nexus from 'nexusui'
import './Slider.css'

const Slider = ({ name, label, valueLabel, unit, min, max, step, values, valueMultiplier, sliderRef, id, changeFunction}) => {
    const height = 150
    const width = 30
    const shortLine = "7px"
    const longLine = "13px"

    const lineArray = [shortLine, shortLine, shortLine, shortLine, longLine, shortLine, shortLine, shortLine, shortLine]

    useEffect(()=>{
        let multislider = new Nexus.Multislider(`#${name}${id}`, {
            'size': [width,height],
            'numberOfSliders': 1,
            'min': min,
            'max': max,
            'step': step,
            'values': [values],
            'smoothing': 0,
            'mode': 'bar'
        })
        multislider.setSlider(0, values)
        multislider.on("change", (e) => {
            changeFunction(e, id)
        })
        multislider.bars[0].attributes[5].value = "#fafdd1"
        multislider.caps[0].attributes[4].value = "#000"
        multislider.element.attributes[2].value = "background-color: rgb(57, 57, 57); cursor: pointer;"
        sliderRef.current = [...sliderRef.current, multislider]
    // eslint-disable-next-line
    },[])

  return (
    <div className={`sliderContainer ${id}`}>
      <label className="sliderLabel"><p>{label}</p></label>
      <p className="valueIndicator">{`${(valueLabel * valueMultiplier).toFixed(2)}${unit}`}</p>
      <div className="slider-outer-container">
      <div className="slider-lines-left" style={{height: height}}>
      {lineArray.map((line, i) => {
        return (
          <div key={`slider${id}leftLine${i}`} className='slider-line' style={{width: line}}></div>
        )
      })}
      </div>
      <div className="sliderInnerContainer sliderHover" id={`${name}${id}`}></div>
      <div className="slider-lines-right" style={{height: height}}>
      {lineArray.map((line, i) => {
        return (
          <div key={`slider${id}rightLine${i}`} className='slider-line' style={{width: line}}></div>
        )
      })}
      </div>
      </div>
    </div>
  )
}

export default Slider
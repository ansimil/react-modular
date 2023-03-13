import { useEffect } from 'react'
import Nexus from 'nexusui'
import './Slider.css'

const Slider = ({ name, label, valueLabel, unit, min, max, step, values, valueMultiplier, sliderRef, id, changeFunction}) => {
    useEffect(()=>{
        let multislider = new Nexus.Multislider(`#${name}${id}`, {
            'size': [30,150],
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
      <div className="sliderInnerContainer sliderHover" id={`${name}${id}`}></div>
    </div>
  )
}

export default Slider
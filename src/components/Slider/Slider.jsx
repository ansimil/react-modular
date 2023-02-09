import { useEffect } from 'react'
import Nexus from 'nexusui'

const Slider = ({module, label, valueLabel, unit, min, max, step, values, sliderRef, id, changeFunction}) => {
    
    useEffect(()=>{
        
        let multislider = new Nexus.Multislider(`#${module}${id}`, {
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
        multislider.bars[0].attributes[5].value = "#dedede"
        multislider.caps[0].attributes[4].value = "#000"
        multislider.element.attributes[2].value = "background-color: rgb(255, 255, 255); cursor: pointer;"
        sliderRef.current = [...sliderRef.current, multislider]
        console.log(sliderRef.current)
    // eslint-disable-next-line
    },[])

  return (
    <div className={`sliderContainer ${id}`}>
    <label className="sliderLabel"><p>{label}</p></label>
    <p className="valueIndicator">{`${valueLabel}${unit}`}</p>
    <div id={`${module}${id}`}></div>
    </div>
  )
}

export default Slider
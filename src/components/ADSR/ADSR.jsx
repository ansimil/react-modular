import { useContext, useEffect } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'
import './ADSR.css'

export const ADSR = () => {
    const { stateHook, adsrRef } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const { adsrSettings } = appState
    const adsrArr = [
        [5, 0.001, adsrSettings.attack], 
        [5, 0.001, adsrSettings.decay], 
        [1, 0.001, adsrSettings.sustain], 
        [5, 0.001, adsrSettings.release]
    ]

    useEffect(()=>{
        if (adsrRef.current) {
            adsrRef.current.forEach(multislider => {
                multislider.destroy()
            })
        }
        let multsliderArr = []
        adsrArr.forEach((attr,i) => {
            let multislider = new Nexus.Multislider(`#multislider${i+1}`, {
                'size': [50,225],
                'numberOfSliders': 1,
                'min': 0,
                'max': attr[0],
                'step': attr[1],
                'values': [[attr[2]]],
                'smoothing': 0,
                'mode': 'bar'
            }) 
            multislider.setSlider(0, attr[2])
            multislider.on("change", (e)=>{console.log(e)})
            multislider.bars[0].attributes[5].value = "#dedede"
            multislider.caps[0].attributes[4].value = "#000"
            multislider.element.attributes[2].value = "background-color: rgb(255, 255, 255); cursor: pointer;"
            multsliderArr.push(multislider)
        })
        adsrRef.current = multsliderArr
    },[])
    

    const change = e => {
        let { id, value } = e.target;
        updateState({type: ACTIONS.ADSR.CHANGE_ADSR, payload: { id, value }})
    }
  return (
    <div className='adsrContainer'>
        <div className="sliderContainer">
            <label className="sliderLabel"><p>A</p></label>
            <p>{adsrSettings.attack}</p>
            <input
            className="adsrSlider slider"
            id="attack"
            type="range" 
            min={0.0001} 
            max={5} 
            step={0.001}
            value={adsrSettings.attack} 
            onChange={change}
            />
        </div>

        <div className="sliderContainer">
            <label className="sliderLabel"><p>D</p></label>
            <p>{adsrSettings.decay}</p>
            <input
            className="adsrSlider slider"
            id="decay"
            type="range" 
            min={0.00001} 
            max={5} 
            step={0.001}
            value={adsrSettings.decay} 
            onChange={change}
            />
        </div>

        <div className="sliderContainer">
            <label className="sliderLabel"><p>S</p></label>  
            <p>{adsrSettings.sustain}</p>
            <input
            className="adsrSlider slider"
            id="sustain"
            type="range" 
            min={0.00001} 
            max={1} 
            step={0.001}
            value={adsrSettings.sustain} 
            onChange={change}
            />
        </div>

        <div className="sliderContainer">
            <label className="sliderLabel"><p>R</p></label>
            <p>{adsrSettings.release}</p>
            <input
            className="adsrSlider slider"
            id="release"
            type="range" 
            min={0.00001} 
            max={5} 
            step={0.001}
            value={adsrSettings.release} 
            onChange={change}
            />
        </div>
       <div id="multislider1"></div>
       <div id="multislider2"></div>
       <div id="multislider3"></div>
       <div id="multislider4"></div>
    </div>
  )
}

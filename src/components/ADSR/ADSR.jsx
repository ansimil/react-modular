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
        [5, 0.001, adsrSettings.attack, "attack"], 
        [5, 0.001, adsrSettings.decay, "decay"], 
        [1, 0.001, adsrSettings.sustain, "sustain"], 
        [5, 0.001, adsrSettings.release, "release"]
    ]

    useEffect(()=>{
        if (adsrRef.current) {
            adsrRef.current.forEach(multislider => {
                multislider.destroy()
            })
        }
        let multsliderArr = []
        adsrArr.forEach((attr) => {
            let multislider = new Nexus.Multislider(`#${attr[3]}`, {
                'size': [60,150],
                'numberOfSliders': 1,
                'min': 0,
                'max': attr[0],
                'step': attr[1],
                'values': [[attr[2]]],
                'smoothing': 0,
                'mode': 'bar'
            }) 

            multislider.setSlider(0, attr[2])
            multislider.on("change", (e)=>{change(e, multislider.settings.target.split("#")[1])})
            multislider.bars[0].attributes[5].value = "#dedede"
            multislider.caps[0].attributes[4].value = "#000"
            multislider.element.attributes[2].value = "background-color: rgb(255, 255, 255); cursor: pointer;"
            multsliderArr.push(multislider)
        })
        adsrRef.current = multsliderArr
    },[])
    

    const change = (e, stage) => {
        let [ value ] = e;
        let id = stage
        console.log(adsrRef.current)
        updateState({type: ACTIONS.ADSR.CHANGE_ADSR, payload: { id, value }})
    }
  return (
    <div className='adsrContainer'>
        <div className="adsrContainerInner">
            <div className='adsrLabels'>
            <div><p>A</p></div>
            <div><p>D</p></div>
            <div><p>S</p></div>
            <div><p>R</p></div>
            </div>
            <div className='adsrLabels'>
            <div><p>{(appState.adsrSettings.attack).toFixed(2)}</p></div>
            <div><p>{(appState.adsrSettings.decay).toFixed(2)}</p></div>
            <div><p>{(appState.adsrSettings.sustain).toFixed(2)}</p></div>
            <div><p>{(appState.adsrSettings.release).toFixed(2)}</p></div>
            </div>
            <div className="adsrContainerLeft">
                <div id="attack" className="adsrSlider"></div>
                <div id="decay" className="adsrSlider"></div>
                <div id="sustain" className="adsrSlider"></div>
                <div id="release" className="adsrSlider"></div>
            </div>
        </div>
        <div className="moduleInfo">
            <h2>ENV_1</h2>
        </div>
    </div>
  )
}

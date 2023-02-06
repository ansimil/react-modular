import { createContext, useReducer, useRef } from "react";
import * as Tone from 'tone'
const ModularBusContext = createContext()

export const ACTIONS = {
    SYNTH: {
        start: "start_synth",
        stop: "stop_synth",
        outputGain: "change_synth_outputGain"
    },
    OSCILLATOR: {
        CHANGE_OSC1: {
            type: "change_osc1_type",
            detune: "change_osc1_detune",
            oscFMIntensity: "change_osc1_FMIntensity",
            oscADSRGain: "change_osc1_ADSR_gain",
            glide: "change_osc1_glide"
        },
        CHANGE_OSC2: {
            type: "change_osc2_type",
            detune: "change_osc2_detune",
            oscFMIntensity: "change_osc2_FMIntensity",
            oscADSRGain: "change_osc2_ADSR_gain",
            glide: "change_osc2_glide"
        }
    },
    FILTER: {
        CHANGE_FILTER: {
            type: "change_filter_type",
            frequency: "change_filter_frequency",
            detune: "change_filter_detune",
            Q: "change_filter_Q"
        }
    },
    ADSR: {
        CHANGE_ADSR: "change_adsr"
    },
    LFO: {
        CHANGE_LFO1: {
            type: "change_lfo1_type",
            frequency: "change_lfo1_detune"
        },
        CHANGE_LFO2: {
            type: "change_lfo2_type",
            frequency: "change_lfo2_frequency"
        }
    }
}

let midiToFreqArr = {}
let smoothing = 1.0

const actx = new AudioContext() 
const out = actx.destination
Tone.setContext(actx)
let oscillator1 = actx.createOscillator()
let oscillator2 = actx.createOscillator()
let lfo1 = actx.createOscillator()
let lfo2 = actx.createOscillator()
let filter = actx.createBiquadFilter()
let osc1ADSRGain = actx.createGain()
let osc2ADSRGain = actx.createGain()
let osc1FMIntensity = actx.createGain()
let osc2FMIntensity = actx.createGain()
let output = actx.createGain()
let outputGain = actx.createGain()

let adsr = new Tone.Envelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.2,
})



osc1ADSRGain.gain.setValueAtTime(0.00001, actx.currentTime)
output.gain.setValueAtTime(0.00001, actx.currentTime)
outputGain.gain.setValueAtTime(1.0, actx.currentTime)
lfo1.frequency.value = 2
lfo2.frequency.value = 2
filter.frequency.value = 15000
filter.Q.value = 0
osc1FMIntensity.gain.value = 0.0001
osc2FMIntensity.gain.value = 0.0001

// Connection chain //
oscillator1.start()
oscillator2.start()
lfo1.start()
osc1ADSRGain.gain.setValueAtTime(0.0001, actx.currentTime)
lfo1.connect(osc1FMIntensity)
osc1FMIntensity.connect(oscillator1.detune)
oscillator1.connect(osc1ADSRGain)
// dcSource.connect(osc1ADSRGain)
adsr.connect(osc1ADSRGain.gain)
osc1ADSRGain.connect(filter)    
filter.connect(outputGain)
outputGain.connect(output)
output.connect(out)





export function reducer(state, action){
    let { id, value } = action.payload
    switch (action.type) {
        case ACTIONS.SYNTH.start:
            output.gain.setValueAtTime(output.gain.value, actx.currentTime)
            output.gain.linearRampToValueAtTime(0.2, actx.currentTime + smoothing)
            return {...state, synthSettings: {...state.synthSettings, start: true, startCount: 1}}

        case ACTIONS.SYNTH.stop:
            output.gain.setValueAtTime(output.gain.value, actx.currentTime)
            output.gain.linearRampToValueAtTime(0.0001, actx.currentTime + smoothing)
            return {...state, synthSettings: {...state.synthSettings, start: false}}
        
        case ACTIONS.SYNTH.outputGain:
            outputGain.gain.linearRampToValueAtTime(value, actx.currentTime + 0.005)
            return {...state, synthSettings: {...state.synthSettings, [id]: value}}

        case ACTIONS.OSCILLATOR.CHANGE_OSC1.type:
            oscillator1.type = id
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, type: id}}};

        case ACTIONS.OSCILLATOR.CHANGE_OSC1.detune:
            oscillator1.detune.value = value
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: value}}};
        
        case ACTIONS.OSCILLATOR.CHANGE_OSC1.glide:
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};
        
        case ACTIONS.OSCILLATOR.CHANGE_OSC1.oscFMIntensity:
            osc1FMIntensity.gain.value = value
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: value}}};

        case ACTIONS.OSCILLATOR.CHANGE_OSC1.oscADSRGain:
            const { note, stateKey } = action.payload
            if (stateKey) {
                let glide = actx.currentTime + state.oscSettings.osc1.glide
                oscillator1.frequency.cancelScheduledValues(actx.currentTime)
                oscillator1.frequency.setValueAtTime(oscillator1.frequency.value, actx.currentTime)
                oscillator1.frequency.linearRampToValueAtTime(midiToFreqArr[note], glide)
                adsr.triggerAttack(actx.currentTime, 1)
            }
            if (!stateKey) {
                adsr.triggerRelease(actx.currentTime, 0.0001)
            }
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, frequency: midiToFreqArr[note], oscADSRGain: osc1ADSRGain.gain.value}}};

        case ACTIONS.OSCILLATOR.CHANGE_OSC2.type:
            oscillator2.type = id
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, type: id}}};

        case ACTIONS.OSCILLATOR.CHANGE_OSC2.detune:
            oscillator2.detune.value = value
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: value}}};

        case ACTIONS.OSCILLATOR.CHANGE_OSC2.oscFMIntensity:
            osc2FMIntensity.gain.value = value
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: value}}};
        
        case ACTIONS.LFO.CHANGE_LFO1.frequency:
            lfo1.frequency.value = value
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: value}}}
        
        case ACTIONS.LFO.CHANGE_LFO1.type:
            lfo1.type = id
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, type: id}}}
        
        case ACTIONS.LFO.CHANGE_LFO2.frequency:
            lfo2.frequency.value = value
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, [id]: value}}}
        
        case ACTIONS.FILTER.CHANGE_FILTER.type:
            filter.type = id
            return {...state, filterSettings: {...state.filterSettings, type: id}};

        case ACTIONS.FILTER.CHANGE_FILTER.frequency:
            filter.frequency.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: value }};
            
        case ACTIONS.FILTER.CHANGE_FILTER.detune:
            filter.detune.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: value}};

        case ACTIONS.FILTER.CHANGE_FILTER.Q:
            filter.Q.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: value}};
        
        case ACTIONS.ADSR.CHANGE_ADSR:
            state.adsrSettings[id] = value
            adsr[id] = value
            return {...state, adsrSettings: {...state.adsrSettings, [id]: Number(value)}};

        default:
            console.log('error', action)
            return {...state};
    }
}

function ModularBus (props) {
    
    for (let i = 24; i < 106; i++){
        let freq = (Math.pow(2, (i-69)/12)*440)
        midiToFreqArr = {...midiToFreqArr, [i]: freq}
    }

    let matrixRef = useRef(null)
    let keyboardRef = useRef(null)
    let adsrRef = useRef(null)
    let oscilloscopeRef = useRef(null)
    let sequencerRef = useRef(null)


    const connectToOscilloscope = () => {
        oscilloscopeRef.current.connect(osc1ADSRGain)
        
    }

    const stateHook = useReducer(reducer, {
        synthSettings: {
            start: false,
            startCount: 0,
            outputGain: outputGain.gain.value
        },
        oscSettings: {
            osc1: {
                frequency: oscillator1.frequency.value,
                detune: oscillator1.detune.value,
                type: oscillator1.type,
                oscFMIntensity: osc1FMIntensity.gain.value,
                oscADSRGain: osc1ADSRGain.gain.value,
                glide: 0.00
            },
            osc2: {
                frequency: oscillator2.frequency.value,
                detune: oscillator2.detune.value,
                type: oscillator2.type,
                oscFMIntensity: osc2FMIntensity.gain.value,
                oscADSRGain: osc2ADSRGain.gain.value,
                glide: 0.00
            },
        },
        filterSettings: {
            frequency: filter.frequency.value,
            detune: filter.detune.value,
            type: filter.type,
            Q: filter.Q.value,
        },
        adsrSettings: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.5,
            release: 0.2,
        },
        lfoSettings: {
            lfo1: {
                frequency: lfo1.frequency.value,
                detune: lfo1.detune.value,
                type: lfo1.type
            },
            lfo2: {
                frequency: lfo2.frequency.value,
                detune: lfo2.detune.value,
                type: lfo2.type
            }
        }
    })

    return (
        <ModularBusContext.Provider value={{stateHook, sequencerRef, keyboardRef, adsrRef, midiToFreqArr, oscilloscopeRef, connectToOscilloscope, matrixRef, adsr}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
import { createContext, useReducer, useRef } from "react";
import { updateMatrix } from "../services/matrix.services";
import { 
    updateOscType, 
    updateOscDetune, 
    updateOscPwm, 
    updateFMDepth, 
    updateOscADSR, 
    updateOscFrequency 
} from "../services/oscillator.services";
import * as Tone from 'tone'

const ModularBusContext = createContext()

export const ACTIONS = {
    SYNTH: {
        start: "start_synth",
        stop: "stop_synth",
        outputGain: "change_synth_outputGain",
        bpm: "change_synth_bpm"
    },
    OSCILLATOR: {
        OSC1: {
            type: "change_osc1_type",
            detune: "change_osc1_detune",
            oscFMDepth: "change_osc1_FMDepth",
            oscADSRGain: "change_osc1_ADSR_gain",
            glide: "change_osc1_glide",
            pwm: "change_osc1_pwm"
        },
        OSC2: {
            type: "change_osc2_type",
            detune: "change_osc2_detune",
            oscFMDepth: "change_osc2_FMDepth",
            oscADSRGain: "change_osc2_ADSR_gain",
            glide: "change_osc2_glide",
            pwm: "change_osc2_pwm"
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
            frequency: "change_lfo1_detune",
            lfoFMDepth: "change_lfo1_FMDepth",
            pwm: "change_lfo1_pwm"
        },
        CHANGE_LFO2: {
            type: "change_lfo2_type",
            frequency: "change_lfo2_frequency",
            lfoFMDepth: "change_lfo2_FMDepth",
            pwm: "change_lfo2_pwm"
        }
    }
}

let midiToFreqArr = {}
let smoothing = 1.0


const actx = new AudioContext() 
const out = actx.destination
Tone.setContext(actx)

let osc1 = new Tone.OmniOscillator({
    type:"sine",
})
let osc2 = new Tone.OmniOscillator({
    type:"sine",
})
let lfo1 = new Tone.OmniOscillator({
    type: "sine",
    frequency: 2,
})
let lfo2 = new Tone.OmniOscillator({
    type: "sine",
    frequency: 2,
})
let filter = new Tone.Filter({
    max: "10000",
    min: "0",
    frequency: "10000",
    rolloff: -24
})
let osc1ADSRGain = new Tone.Gain()
let osc2ADSRGain = new Tone.Gain()
let osc1FMDepth = new Tone.Gain()
let osc2FMDepth = new Tone.Gain()
let lfo1FMDepth = new Tone.Gain()
let lfo2FMDepth = new Tone.Gain()
let output = new Tone.Gain()
let outputGain = new Tone.Gain()

let adsr = new Tone.Envelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.2,
    attackCurve: "exponential",
    decayCurve: "linear",
    releaseCurve: "exponential"
})
const meter = new Tone.DCMeter();


osc1ADSRGain.gain.setValueAtTime(0.00001, actx.currentTime)
output.gain.setValueAtTime(0.00001, actx.currentTime)
outputGain.gain.setValueAtTime(1.0, actx.currentTime)
lfo1.frequency.value = 2
lfo2.frequency.value = 2
filter.frequency.value = 10000
filter.Q.value = 0
osc1FMDepth.gain.value = 0.0001
osc2FMDepth.gain.value = 0.0001
lfo1FMDepth.gain.value = 0.0001
lfo2FMDepth.gain.value = 0.0001

// Connection chain //
osc1.start()
osc2.start()
lfo1.start()
lfo2.start()
osc1ADSRGain.gain.setValueAtTime(0.0001, actx.currentTime)
lfo1.connect(osc1FMDepth)
lfo2.connect(lfo1FMDepth)
lfo1FMDepth.connect(lfo1.detune)
osc1FMDepth.connect(osc1.detune)
osc1.connect(osc1ADSRGain)
adsr.connect(osc1ADSRGain.gain)
osc1ADSRGain.connect(filter)    
filter.connect(outputGain)
outputGain.connect(output)
output.connect(out)
lfo1.connect(meter)
updateMatrix()


export function reducer(state, action){
    let { id, value, note, stateKey } = action.payload

    switch (action.type) {
        case ACTIONS.SYNTH.start:
            Tone.start()
            output.gain.setValueAtTime(output.gain.value, actx.currentTime)
            output.gain.linearRampToValueAtTime(0.2, actx.currentTime + smoothing)
            return {...state, synthSettings: {...state.synthSettings, start: true, startCount: 1}}

        case ACTIONS.SYNTH.stop:
            output.gain.setValueAtTime(output.gain.value, actx.currentTime)
            output.gain.linearRampToValueAtTime(0.0001, actx.currentTime + smoothing)
            return {...state, synthSettings: {...state.synthSettings, start: false}}
        
        case ACTIONS.SYNTH.outputGain:
            outputGain.gain.linearRampToValueAtTime(value, actx.currentTime + 0.005)
            return {...state, synthSettings: {...state.synthSettings, [id]: Number(value)}}

        case ACTIONS.SYNTH.bpm:
            state.synthSettings.bpm = value
            return {...state, synthSettings: {...state.synthSettings, [id]: Number(value)}}

        case ACTIONS.OSCILLATOR.OSC1.type: 
            updateOscType(id, osc1, state)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, type: id}}};

        case ACTIONS.OSCILLATOR.OSC1.detune:
            updateOscDetune(osc1, value)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};
        
        case ACTIONS.OSCILLATOR.OSC1.glide:
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC1.pwm:
            updateOscPwm(osc1, value)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}}
        
        case ACTIONS.OSCILLATOR.OSC1.oscFMDepth:
            updateFMDepth(osc1FMDepth, value)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC1.oscADSRGain:
            updateOscADSR(osc1, adsr, stateKey, actx.currentTime, state, midiToFreqArr, note, meter, state)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, frequency: midiToFreqArr[note], oscADSRGain: osc1ADSRGain.gain.value}}};

        case ACTIONS.OSCILLATOR.OSC2.type:
            updateOscType(id, osc2, state)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, type: id}}};

        case ACTIONS.OSCILLATOR.OSC2.detune:
            updateOscDetune(osc2, value)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC2.oscFMDepth:
            updateFMDepth(osc2FMDepth, value)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};
        
        case ACTIONS.LFO.CHANGE_LFO1.frequency:
            updateOscFrequency(lfo1, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}}
        
        case ACTIONS.LFO.CHANGE_LFO1.type:
            updateOscType(id, lfo1, state)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, type: id}}}

        case ACTIONS.LFO.CHANGE_LFO1.lfoFMDepth:
            updateFMDepth(lfo1FMDepth, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}};
        
        case ACTIONS.LFO.CHANGE_LFO1.pwm:
            updateOscPwm(lfo1, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}}    
        
        case ACTIONS.LFO.CHANGE_LFO2.frequency:
            updateOscFrequency(lfo2, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, [id]: Number(value)}}}

        case ACTIONS.LFO.CHANGE_LFO2.type:
            updateOscType(id, lfo2, state)
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, type: id}}}
        
        case ACTIONS.LFO.CHANGE_LFO2.lfoFMDepth:
            updateFMDepth(lfo2FMDepth, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, [id]: Number(value)}}};
        
        case ACTIONS.LFO.CHANGE_LFO2.pwm:
            updateOscPwm(lfo2, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}}
        
        case ACTIONS.FILTER.CHANGE_FILTER.type:
            filter.type = id
            return {...state, filterSettings: {...state.filterSettings, type: id}};

        case ACTIONS.FILTER.CHANGE_FILTER.frequency:
            filter.frequency.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value) }};
            
        case ACTIONS.FILTER.CHANGE_FILTER.detune:
            filter.detune.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value)}};

        case ACTIONS.FILTER.CHANGE_FILTER.Q:
            filter.Q.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value)}};
        
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
    let adsrRef = useRef([])
    let oscilloscopeRef = useRef(null)
    let sequencerRef = useRef(null)
    let seqSlidersRef = useRef(null)
    const oscRef = useRef([])
    const lfoRef = useRef([])
    const filterRef = useRef([])


    const connectToOscilloscope = () => {
        oscilloscopeRef.current.connect(outputGain)
    }

    const stateHook = useReducer(reducer, {
        synthSettings: {
            start: false,
            startCount: 0,
            outputGain: outputGain.gain.value,
            bpm: 120
        },
        oscSettings: {
            osc1: {
                frequency: osc1.frequency.value,
                detune: osc1.detune.value,
                type: osc1.type,
                oscFMDepth: osc1FMDepth.gain.value,
                oscADSRGain: osc1ADSRGain.gain.value,
                glide: 0.00,
                pwm: 0
            },
            osc2: {
                frequency: osc2.frequency.value,
                detune: osc2.detune.value,
                type: osc2.type,
                oscFMDepth: osc2FMDepth.gain.value,
                oscADSRGain: osc2ADSRGain.gain.value,
                glide: 0.00,
                pwm: 0
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
                type: lfo1.type,
                lfoFMDepth: lfo1FMDepth.gain.value,
                pwm: 0
            },
            lfo2: {
                frequency: lfo2.frequency.value,
                type: lfo2.type,
                lfoFMDepth: lfo2FMDepth.gain.value,
                pwm: 0
            }
        },
        sequencerSettings: {
            sliders: [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
            ]
        }
    })

    return (
        <ModularBusContext.Provider value={{stateHook, sequencerRef, seqSlidersRef, keyboardRef, adsrRef, midiToFreqArr, oscilloscopeRef, connectToOscilloscope, matrixRef, adsr, oscRef, lfoRef, filterRef}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
import { createContext, useReducer, useRef } from "react";

const ModularBusContext = createContext()



export const ACTIONS = {
    OSCILLATOR: {
        CHANGE_OSC1: {
            type: "change_osc1_type",
            detune: "change_osc1_detune",
            oscFMIntensity: "change_osc1_FMIntensity"
        },
        CHANGE_OSC2: {
            type: "change_osc2_type",
            detune: "change_osc2_detune",
            oscFMIntensity: "change_osc2_FMIntensity"
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

const actx = new AudioContext() 
const out = actx.destination
let oscillator1 = actx.createOscillator()
let oscillator2 = actx.createOscillator()
let lfo1 = actx.createOscillator()
let lfo2 = actx.createOscillator()
let filter = actx.createBiquadFilter()
let osc1FMIntensity = actx.createGain()
let osc2FMIntensity = actx.createGain()

let vca = actx.createGain()
let merger = actx.createChannelMerger()

lfo1.frequency.value = 5
lfo2.frequency.value = 5
filter.frequency.value = 15000
filter.Q.value = 0
osc1FMIntensity.gain.value = 0
osc2FMIntensity.gain.value = 0



export function reducer(state, action){
    let { id, value } = action.payload
    switch (action.type) {

        case ACTIONS.OSCILLATOR.CHANGE_OSC1.type:
            oscillator1.type = id
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, type: id}}};

        case ACTIONS.OSCILLATOR.CHANGE_OSC1.detune:
            oscillator1.detune.value = value
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: value}}};
        
        case ACTIONS.OSCILLATOR.CHANGE_OSC1.oscFMIntensity:
            osc1FMIntensity.gain.value = value
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: value}}};

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
            return {...state, adsrSettings: {...state.adsrSettings, [id]: value}};

        default:
            console.log('error', action)
            return {...state};
    }
}

function ModularBus (props) {
    let sequencerRef = useRef(null)
    const stateHook = useReducer(reducer, {
        oscSettings: {
            osc1: {
                frequency: oscillator1.frequency.value,
                detune: oscillator1.detune.value,
                type: oscillator1.type,
                oscFMIntensity: osc1FMIntensity.gain
            },
            osc2: {
                frequency: oscillator2.frequency.value,
                detune: oscillator2.detune.value,
                type: oscillator2.type,
                oscFMIntensity: osc2FMIntensity.gain
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
            release: 0.2
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
        <ModularBusContext.Provider value={{stateHook, sequencerRef}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
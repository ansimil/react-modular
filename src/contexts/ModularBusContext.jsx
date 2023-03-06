import { createContext, useReducer, useRef } from "react";
import { 
    setConnections,
    setDisconnections 
} from "../services/matrix.services";
import { 
    updateOscType, 
    updateOscDetune, 
    updateOscPwm, 
    updateFMDepth,
    updateLfoFrequency,
    updateOscFrequency
} from "../services/oscillator.services";
import { 
    updateADSRGain 
} from "../services/adsr.services";
import { 
    step,
} from "../services/sequencer.services";
import { 
    startContext 
} from "../services/context.services";
import { 
    Oscillator,
    Filter,
    VCA,
    ADSR
} from "../classes/classes";
import { 
    ACTIONS
} from "../utils/ACTIONS";
import * as Tone from 'tone'

const ModularBusContext = createContext()

let midiToFreqArr = {}
let smoothing = 1.0

const actx = new Tone.Context() 
const out = actx.destination
Tone.setContext(actx)

let oscillatorsArr = []
let lfosArr = []
let filtersArr = []

let osc1 = new Oscillator(440, `osc${oscillatorsArr.length+1}`)
oscillatorsArr.push(osc1)
let osc2 = new Oscillator(440, `osc${oscillatorsArr.length+1}`)
oscillatorsArr.push(osc2)

let lfo1 = new Oscillator(2, `lfo${lfosArr.length+1}`)
lfosArr.push(lfo1)
let lfo2 = new Oscillator(2)
lfosArr.push(lfo2, `lfo${lfosArr.length+1}`)

let filter1 = new Filter(`filter${filtersArr.length+1}`)
filtersArr.push(filter1)

let adsr = new ADSR()
let vca = new VCA()
let reverb = new Tone.Reverb(2)
reverb.wet.value = 0
let reverbWetGainBuffer = new Tone.Gain(1)
let reverbAudioGainBuffer = new Tone.Gain(1)
reverbWetGainBuffer.connect(reverb.wet)
reverbAudioGainBuffer.connect(reverb)

let output = new Tone.Gain()
let outputGain = new Tone.Gain()
output.gain.setValueAtTime(0.00001, actx.currentTime)
outputGain.gain.setValueAtTime(1.0, actx.currentTime)
outputGain.connect(output)
output.connect(out)

// Connection chain //
const initialConnection = [
    [4,0],
    [6,4],
    [10,6],
    [0,2],
    [2,3],
    [7,5]
]

let connectionChain = []

const midiToFreqConverter = () => {
    for (let i = 0; i < 106; i++){
        let freq = (Math.pow(2, (i-69)/12)*440)
        midiToFreqArr = {...midiToFreqArr, [i]: freq}
    }
}

export function reducer(state, action){
    let { id, value, note, stateKey, i, time, module } = action.payload
    console.log(action)
    switch (action.type) {
        // SYNTH SETTINGS //
        case ACTIONS.SYNTH.start:
            startContext(osc1.osc, osc2.osc, lfo1.osc, lfo2.osc)
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
            Tone.Transport.bpm.rampTo(value, 0.05)
            return {...state, synthSettings: {...state.synthSettings, [id]: Number(value)}}


        // osc SETTINGS //

        case ACTIONS.osc.type:
            updateOscType(id, oscillatorsArr[i].osc, state)
            console.log(module)
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], type: id}}};

        case ACTIONS.osc.detune:
            updateOscDetune(oscillatorsArr[i].osc, value)
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], [id]: Number(value)}}};
        
        case ACTIONS.osc.glide:
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], [id]: Number(value)}}};

        case ACTIONS.osc.pwm:
            updateOscPwm(oscillatorsArr[i].osc, value)
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], [id]: Number(value)}}}
        
        case ACTIONS.osc.oscFMDepth:
            updateFMDepth(oscillatorsArr[i].FMDepth, value)
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], [id]: Number(value)}}};

        case ACTIONS.osc.frequency:
            console.log(module)
            let newFreq = updateOscFrequency(oscillatorsArr[i].osc, state, actx.currentTime, midiToFreqArr, note, module)
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], frequency: newFreq}}};
            
        case ACTIONS.osc.offset:
            let newValue
            if (value === "inc") {
                newValue = state.oscSettings[module][id] + 1
            }
            else {
                newValue = state.oscSettings[module][id] - 1
            }
            return {...state, oscSettings: {...state.oscSettings, [module]: {...state.oscSettings[module], [id]: Number(newValue)}}};

        // case ACTIONS.osc.osc2.type:
        //     updateOscType(id, osc2.osc, state)
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, type: id}}};

        // case ACTIONS.osc.osc2.detune:
        //     updateOscDetune(osc2.osc, value)
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        // case ACTIONS.osc.osc2.glide:
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        // case ACTIONS.osc.osc2.pwm:
        //     updateOscPwm(osc2.osc, value)
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}}

        // case ACTIONS.osc.osc2.oscFMDepth:
        //     updateFMDepth(osc2.FMDepth, value)
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        // case ACTIONS.osc.osc2.frequency:
        //     let newFreq2 = updateOscFrequency(osc2.osc, state, actx.currentTime, midiToFreqArr, note, "osc2")
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, frequency: newFreq2}}};
            
        // case ACTIONS.osc.osc2.offset:
        //     let newValue2
        //     if (value === "inc") {
        //         newValue2 = state.oscSettings.osc2[id] + 1
        //     }
        //     else {
        //         newValue2 = state.oscSettings.osc2[id] - 1
        //     }
        //     return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(newValue2)}}};

        // LFO SETTINGS //

        case ACTIONS.LFO.CHANGE_LFO1.frequency:
            updateLfoFrequency(lfo1.osc, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}}
        
        case ACTIONS.LFO.CHANGE_LFO1.type:
            updateOscType(id, lfo1.osc, state)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, type: id}}}

        case ACTIONS.LFO.CHANGE_LFO1.lfoFMDepth:
            updateFMDepth(lfo1.FMDepth, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}};
        
        case ACTIONS.LFO.CHANGE_LFO1.pwm:
            updateOscPwm(lfo1.osc, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}}    
        
        case ACTIONS.LFO.CHANGE_LFO2.frequency:
            updateLfoFrequency(lfo2.osc, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, [id]: Number(value)}}}

        case ACTIONS.LFO.CHANGE_LFO2.type:
            updateOscType(id, lfo2.osc, state)
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, type: id}}}
        
        case ACTIONS.LFO.CHANGE_LFO2.lfoFMDepth:
            updateFMDepth(lfo2.FMDepth, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo2: {...state.lfoSettings.lfo2, [id]: Number(value)}}};
        
        case ACTIONS.LFO.CHANGE_LFO2.pwm:
            updateOscPwm(lfo2.osc, value)
            return {...state, lfoSettings: {...state.lfoSettings, lfo1: {...state.lfoSettings.lfo1, [id]: Number(value)}}}
        

        // FILTER SETTINGS //

        case ACTIONS.filter.filter1.type:
            filter1.filter.type = id
            return {...state, filterSettings: {...state.filterSettings, filter1: {...state.filterSettings.filter1, type: id}}};

        case ACTIONS.filter.filter1.frequency:
            filter1.filter.frequency.value = value
            return {...state, filterSettings: {...state.filterSettings, filter1: {...state.filterSettings.filter1, [id]: Number(value) }}};
            
        case ACTIONS.filter.filter1.detune:
            filter1.filter.detune.value = value
            return {...state, filterSettings: {...state.filterSettings, filter1: {...state.filterSettings.filter1, [id]: Number(value)}}};

        case ACTIONS.filter.filter1.Q:
            filter1.filter.Q.value = value
            return {...state, filterSettings: {...state.filterSettings, filter1: {...state.filterSettings.filter1, [id]: Number(value)}}};

        case ACTIONS.filter.filter1.freqFMDepth:
            filter1.FMDepth.gain.value = value
            return {...state, filterSettings: {...state.filterSettings, filter1: {...state.filterSettings.filter1, [id]: Number(value)}}};
        

        // ADSR SETTINGS //

        case ACTIONS.ADSR.CHANGE_ADSR.time:
            state.adsrSettings[id] = value
            adsr.adsr[id] = value
            return {...state, adsrSettings: {...state.adsrSettings, [id]: Number(value)}};
        
        case ACTIONS.ADSR.CHANGE_ADSR.gain:
            updateADSRGain(adsr.adsr, stateKey, actx.currentTime, state)
            return {...state, adsrSettings: {...state.adsrSettings, [id]: Number(value)}};
    
        

        // SEQUENCER SETTINGS //
        case ACTIONS.SEQUENCER.player:
            return {...state, sequencerSettings: {...state.sequencerSettings, player: value}}
            
        case ACTIONS.SEQUENCER.direction:
            return {...state, sequencerSettings: {...state.sequencerSettings, direction: value}}

        case ACTIONS.SEQUENCER.octave:
            return {...state, sequencerSettings: {...state.sequencerSettings, sliders: {...state.sequencerSettings.sliders, [i]: {...state.sequencerSettings.sliders[i], octave: value}}}}
        
        case ACTIONS.SEQUENCER.note:
            return {...state, sequencerSettings: {...state.sequencerSettings, sliders: {...state.sequencerSettings.sliders, [i]: {...state.sequencerSettings.sliders[i], note: value}}}}
        
        case ACTIONS.SEQUENCER.updateStepValue:
            return {...state, sequencerSettings: {...state.sequencerSettings, step: value}}

        case ACTIONS.SEQUENCER.random:
            return {...state, sequencerSettings: {...state.sequencerSettings, random: value}}
            
        case ACTIONS.SEQUENCER.step:
            const stepNote = state.sequencerSettings.sliders[value].note + 24 + (12 * state.sequencerSettings.sliders[value].octave)
            const bpmForClockWidth = (60 / state.synthSettings.bpm) / 16
            const oscillators = [
                {
                    node: osc1.osc,
                    name: "osc1"
                },
                {
                    node: osc2.osc,
                    name: "osc2"
                }
            ]
            step(oscillators, adsr.adsr, time, state, midiToFreqArr, stepNote, bpmForClockWidth)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, frequency: midiToFreqArr[note], oscADSRGain: vca.vca.gain.value}}};
        
        case ACTIONS.SEQUENCER.length:
            return {...state, sequencerSettings: {...state.sequencerSettings, length: value}}

        case ACTIONS.EFFECTS.reverb[id]:
            if (id === 'decay'){
            reverb.decay = value
            }
            else if (id === 'preDelay'){
                reverb.preDelay = value
            }
            else {
                reverb[id].value = value
            } 
            return {...state, effectsSettings: {...state.effectsSettings, reverb: {...state.effectsSettings.reverb, [id]: Number(value)}}}

        // MATRIX SETTINGS //    
        case ACTIONS.MATRIX.connections:
            const {row:outputs, column:inputs, state:cellState} = value
            const tuple = [inputs,outputs]
            let connectionsResponse
            if (cellState) {
                connectionChain.push(tuple)
                connectionsResponse = setConnections(tuple, state, output, out)
            }
            else {
                connectionsResponse = setDisconnections(tuple, state)
                let leftoverConnections = connectionChain.filter(connection => {
                        return (connection[0] !== tuple[0] || connection[1] !== tuple[1])
                })
                connectionChain = leftoverConnections
            }
            return {...state, matrixSettings: {...state.matrixSettings, 
                currentConnections: [connectionChain],
                inputs: {...state.matrixSettings.inputs,
                    [inputs]: {...state.matrixSettings.inputs[inputs],
                        connectedNodes: connectionsResponse
                    }
                }
            }}

        default:
            console.log('error', action)
            return {...state};
    }
}

function ModularBus (props) {
    
    let matrixRef = useRef(null)
    let keyboardRef = useRef(null)
    
    let oscilloscopeRef = useRef(null)
    let sequencerRef = useRef(null)
    let seqSlidersRef = useRef(null)
    const oscRef = useRef([])
    const lfoRef = useRef([])
    const filterRef = useRef([])
    let adsrRef = useRef([])
    let reverbRef = useRef([])
    
    midiToFreqConverter()

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
                frequency: osc1.osc.frequency.value,
                detune: osc1.osc.detune.value,
                type: osc1.osc.type,
                oscFMDepth: osc1.FMDepth.gain.value,
                oscADSRGain: vca.vca.gain.value,
                glide: 0.00,
                pwm: 0,
                octave: 0,
                semitone: 0
            },
            osc2: {
                frequency: osc2.osc.frequency.value,
                detune: osc2.osc.detune.value,
                type: osc2.osc.type,
                oscFMDepth: osc2.FMDepth.gain.value,
                glide: 0.00,
                pwm: 0,
                octave: 0,
                semitone: 0
            },
        },
        filterSettings: {
            filter1: {
                frequency: filter1.filter.frequency.value,
                detune: filter1.filter.detune.value,
                type: filter1.filter.type,
                Q: filter1.filter.Q.value,
                freqFMDepth: filter1.FMDepth.gain.value
            }
        },
        adsrSettings: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.5,
            release: 0.2,
            gain: vca.vca.gain.value
        },
        lfoSettings: {
            lfo1: {
                frequency: lfo1.osc.frequency.value,
                type: lfo1.osc.type,
                lfoFMDepth: lfo1.FMDepth.gain.value,
                pwm: 0
            },
            lfo2: {
                frequency: lfo2.osc.frequency.value,
                type: lfo2.osc.type,
                lfoFMDepth: lfo2.FMDepth.gain.value,
                pwm: 0
            }
        },
        effectsSettings: {
            reverb: {
                decay: 2,
                wet: 0,
                preDelay: 0
            }
        },
        sequencerSettings: {
            sliders: {
                0:{note:0,octave:4},
                1:{note:0,octave:4},
                2:{note:0,octave:4},
                3:{note:0,octave:4},
                4:{note:0,octave:4},
                5:{note:0,octave:4},
                6:{note:0,octave:4},
                7:{note:0,octave:4},
                8:{note:0,octave:4},
                9:{note:0,octave:4},
                10:{note:0,octave:4},
                11:{note:0,octave:4},
                12:{note:0,octave:4},
                13:{note:0,octave:4},
                14:{note:0,octave:4},
                15:{note:0,octave:4},
            },
            step: -1,
            player: "stopped",
            direction: "up",
            length: 16,
            random: false
        },
        matrixSettings: {
            outputs: {
                0: {
                    name: "osc1",
                    node: osc1.osc,
                    type: "audio source",
                    converter: osc1.converter
                },
                1: {
                    name: "osc2",
                    node: osc2.osc,
                    type: "audio source",
                    converter: osc2.converter
                },
                2: {
                    name: "lfo1",
                    node: lfo1.osc,
                    type: "audio source"
                },
                3: {
                    name: "lfo2",
                    node: lfo2.osc,
                    type: "audio source"
                },
                4: {
                    name: "filter",
                    node: filter1.filter,
                    type: "audio source"
                },
                5: {
                    name: "adsr",
                    node: adsr.adsr,
                    type: "gain source",
                    converter: adsr.converter
                },
                6: {
                    name: "vca output",
                    node: vca.vca,
                    type: "audio source"
                },
                7: {
                    name: "reverb",
                    node: reverb,
                    type: "audio source"
                }
            },
            inputs: {
                0: {
                    name: "osc1 FM",
                    node: osc1.FMDepth,
                    type: "audio param",
                    connectedNodes: 0
                },
                1: {
                    name: "osc2 FM",
                    node: osc2.FMDepth,
                    type: "audio param",
                    connectedNodes: 0
                },
                2: {
                    name: "lfo1 FM",
                    node: lfo1.FMDepth,
                    type: "audio param",
                    connectedNodes: 0
                },
                3: {
                    name: "lfo2 FM",
                    node: lfo2.FMDepth,
                    type: "audio param",
                    connectedNodes: 0
                },
                4: {
                    name: "filter audio",
                    node: filter1.gainAdjust,
                    type: "audio param",
                    connectedNodes: 0
                },
                5: {
                    name: "filter FM",
                    node: filter1.FMDepth,
                    type: "audio param",
                    connectedNodes: 0
                },
                6: {
                    name: "vca audio",
                    node: vca.audioGainAdjust,
                    type: "audio param",
                    connectedNodes: 0,
                },
                7: {
                    name: "vca ctrl",
                    node: vca.ctrlGainAdjust,
                    type: "audio gain",
                    connectedNodes: 0 
                },
                8: {
                    name: "reverb audio",
                    node: reverbAudioGainBuffer,
                    type: "audio param",
                    connectedNodes: 0 
                },
                9: {
                    name: "reverb wet",
                    node: reverbWetGainBuffer,
                    type: "audio gain",
                    connectedNodes: 0 
                },
                10: {
                    name: "output",
                    node: outputGain,
                    type: "audio param",
                    connectedNodes: 0
                }
            },
            initialConnections: [
                ...initialConnection
            ],
            currentConnections: []
        }
    })

    return (
        <ModularBusContext.Provider value={{oscillatorsArr, filtersArr, stateHook, sequencerRef, seqSlidersRef, keyboardRef, adsrRef, midiToFreqArr, oscilloscopeRef, connectToOscilloscope, matrixRef, adsr, oscRef, lfoRef, filterRef, reverbRef, initialConnection}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
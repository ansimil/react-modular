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
    ADSR,
    LFO,
    Reverb
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
let adsrArr = []
let effectsArr = []

let osc1 = new Oscillator(440, `osc${oscillatorsArr.length+1}`)
oscillatorsArr.push(osc1)
let osc2 = new Oscillator(440, `osc${oscillatorsArr.length+1}`)
oscillatorsArr.push(osc2)

let lfo1 = new LFO(2, `lfo${lfosArr.length+1}`)
lfosArr.push(lfo1)
let lfo2 = new LFO(2, `lfo${lfosArr.length+1}`)
lfosArr.push(lfo2)
console.log(lfosArr)

let filter1 = new Filter(`filter${filtersArr.length+1}`)
filtersArr.push(filter1)

let adsr1 = new ADSR(`adsr${adsrArr.length+1}`)
adsrArr.push(adsr1)

let vca = new VCA()
let reverb1 = new Reverb(2, 'reverb1')
effectsArr.push(reverb1)
// let reverb = new Tone.Reverb(2)
// reverb.wet.value = 0
// let reverbWetGainBuffer = new Tone.Gain(1)
// let reverbAudioGainBuffer = new Tone.Gain(1)
// reverbWetGainBuffer.connect(reverb.wet)
// reverbAudioGainBuffer.connect(reverb)

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
    let { id, value, note, stateKey, i, time, moduleName, subtype } = action.payload
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
            console.log(moduleName)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], type: id}}};

        case ACTIONS.osc.detune:
            console.log(moduleName, id, value)
            updateOscDetune(oscillatorsArr[i].osc, value)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}};
        
        case ACTIONS.osc.glide:
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.osc.pwm:
            updateOscPwm(oscillatorsArr[i].osc, value)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}}
        
        case ACTIONS.osc.oscFMDepth:
            updateFMDepth(oscillatorsArr[i].FMDepth, value)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.osc.frequency:
            let newFreq = updateOscFrequency(oscillatorsArr[i].osc, state, actx.currentTime, midiToFreqArr, note, moduleName)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], frequency: newFreq}}};
            
        case ACTIONS.osc.offset:
            let newValue
            if (value === "inc") {
                newValue = state.oscSettings[moduleName][id] + 1
            }
            else {
                newValue = state.oscSettings[moduleName][id] - 1
            }
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(newValue)}}};

        // LFO SETTINGS //

        case ACTIONS.lfo.frequency:
            updateLfoFrequency(lfosArr[i].osc, value)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], [id]: Number(value)}}}
        
        case ACTIONS.lfo.type:
            updateOscType(id, lfosArr[i].osc, state)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], type: id}}}

        case ACTIONS.lfo.oscFMDepth:
            updateFMDepth(lfosArr[i].FMDepth, value)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], [id]: Number(value)}}};
        
        case ACTIONS.lfo.pwm:
            updateOscPwm(lfosArr[i].osc, value)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], [id]: Number(value)}}}    
        

        // FILTER SETTINGS //

        case ACTIONS.filter.type:
            filtersArr[i].filter.type = id
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], type: id}}};

        case ACTIONS.filter.frequency:
            filtersArr[i].filter.frequency.value = value
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value) }}};
            
        case ACTIONS.filter.detune:
            filtersArr[i].filter.detune.value = value
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.filter.Q:
            filtersArr[i].filter.Q.value = value
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.filter.freqFMDepth:
            filtersArr[i].FMDepth.gain.value = value
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value)}}};
        

        // ADSR SETTINGS //

        case ACTIONS.adsr.time:
            state.adsrSettings[module][id] = value
            adsrArr[i].adsr[id] = value
            return {...state, adsrSettings: {...state.adsrSettings, [moduleName]: {...state.adsrSettings[moduleName], [id]: Number(value)}}};
        
        case ACTIONS.adsr.gain:
            updateADSRGain(adsrArr[i].adsr, stateKey, actx.currentTime, state)
            return {...state, adsrSettings: {...state.adsrSettings, [moduleName]: {...state.adsrSettings[moduleName], [id]: Number(value)}}};
    
        

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
            step(oscillatorsArr, adsrArr[i].adsr, time, state, midiToFreqArr, stepNote, bpmForClockWidth)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, frequency: midiToFreqArr[note], oscADSRGain: vca.vca.gain.value}}};
        
        case ACTIONS.SEQUENCER.length:
            return {...state, sequencerSettings: {...state.sequencerSettings, length: value}}

        case ACTIONS.effects[subtype]?.[id]:
            const [ destructuredValue ] = value
            if (subtype === 'reverb'){
                if (id === 'decay'){
                    effectsArr[i].effect.decay = destructuredValue
                }
                else if (id === 'preDelay'){
                    effectsArr[i].effect.preDelay = destructuredValue
                }
                else {
                    effectsArr[i].effect[id].value = value
                }
            }
            return {...state, effectsSettings: {...state.effectsSettings, [moduleName]: {...state.effectsSettings[moduleName], [id]: Number(value)}}}

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
    let effectsRef = useRef([])
    
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
            adsr1: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.5,
                release: 0.2,
                gain: vca.vca.gain.value
            }
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
            reverb1: {
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
                    node: adsr1.adsr,
                    type: "gain source",
                    converter: adsr1.converter
                },
                6: {
                    name: "vca output",
                    node: vca.vca,
                    type: "audio source"
                },
                7: {
                    name: "reverb",
                    node: reverb1.effect,
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
                    node: reverb1.reverbAudioGainBuffer,
                    type: "audio param",
                    connectedNodes: 0 
                },
                9: {
                    name: "reverb wet",
                    node: reverb1.reverbWetGainBuffer,
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
        <ModularBusContext.Provider value={{oscillatorsArr, filtersArr, lfosArr, adsrArr, effectsArr, stateHook, sequencerRef, seqSlidersRef, keyboardRef, adsrRef, midiToFreqArr, oscilloscopeRef, connectToOscilloscope, matrixRef, adsr1, oscRef, lfoRef, filterRef, effectsRef, initialConnection}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
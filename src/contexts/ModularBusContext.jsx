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

let osc1 = new Oscillator(440)
let osc2 = new Oscillator(440)
let lfo1 = new Oscillator(2)
let lfo2 = new Oscillator(2)
let filter = new Filter()
let adsr = new ADSR()
let vca = new VCA()
// let convolverGain = new Tone.Gain(0)
// adsr.adsr.connect(convolverGain.gain)


// // const convolver = new Tone.Convolver("https://res.cloudinary.com/dpkg7rmxr/video/upload/v1677229967/Audio/Freeze-1-Audio_zkpjmi.wav", () => {
// //     console.log(convolver)
// //     output.connect(convolver)
// //     convolver.connect(convolverGain)
// //     convolverGain.connect(out)
// // });
// const reverb = new Tone.Reverb(2)


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
    [8,6],
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
    let { id, value, note, stateKey, i, time } = action.payload

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


        // OSCILLATOR SETTINGS //

        case ACTIONS.OSCILLATOR.OSC1.type: 
            updateOscType(id, osc1.osc, state)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, type: id}}};

        case ACTIONS.OSCILLATOR.OSC1.detune:
            updateOscDetune(osc1.osc, value)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};
        
        case ACTIONS.OSCILLATOR.OSC1.glide:
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC1.pwm:
            updateOscPwm(osc1.osc, value)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}}
        
        case ACTIONS.OSCILLATOR.OSC1.oscFMDepth:
            updateFMDepth(osc1.FMDepth, value)
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC1.frequency:
            let newFreq = updateOscFrequency(osc1.osc, state, actx.currentTime, midiToFreqArr, note, "osc1")
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, frequency: newFreq}}};
            
        case ACTIONS.OSCILLATOR.OSC1.offset:
            let newValue
            if (value === "inc") {
                newValue = state.oscSettings.osc1[id] + 1
            }
            else {
                newValue = state.oscSettings.osc1[id] - 1
            }
            return {...state, oscSettings: {...state.oscSettings, osc1: {...state.oscSettings.osc1, [id]: Number(newValue)}}};

        case ACTIONS.OSCILLATOR.OSC2.type:
            updateOscType(id, osc2.osc, state)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, type: id}}};

        case ACTIONS.OSCILLATOR.OSC2.detune:
            updateOscDetune(osc2.osc, value)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC2.glide:
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC2.pwm:
            updateOscPwm(osc2.osc, value)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}}

        case ACTIONS.OSCILLATOR.OSC2.oscFMDepth:
            updateFMDepth(osc2.FMDepth, value)
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(value)}}};

        case ACTIONS.OSCILLATOR.OSC2.frequency:
            let newFreq2 = updateOscFrequency(osc2.osc, state, actx.currentTime, midiToFreqArr, note, "osc2")
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, frequency: newFreq2}}};
            
        case ACTIONS.OSCILLATOR.OSC2.offset:
            let newValue2
            if (value === "inc") {
                newValue2 = state.oscSettings.osc2[id] + 1
            }
            else {
                newValue2 = state.oscSettings.osc2[id] - 1
            }
            return {...state, oscSettings: {...state.oscSettings, osc2: {...state.oscSettings.osc2, [id]: Number(newValue2)}}};

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

        case ACTIONS.FILTER.CHANGE_FILTER.type:
            filter.filter.type = id
            return {...state, filterSettings: {...state.filterSettings, type: id}};

        case ACTIONS.FILTER.CHANGE_FILTER.frequency:
            filter.filter.frequency.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value) }};
            
        case ACTIONS.FILTER.CHANGE_FILTER.detune:
            filter.filter.detune.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value)}};

        case ACTIONS.FILTER.CHANGE_FILTER.Q:
            filter.filter.Q.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value)}};

        case ACTIONS.FILTER.CHANGE_FILTER.filterFMDepth:
            filter.FMDepth.gain.value = value
            return {...state, filterSettings: {...state.filterSettings, [id]: Number(value) }};
        

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
    let adsrRef = useRef([])
    let oscilloscopeRef = useRef(null)
    let sequencerRef = useRef(null)
    let seqSlidersRef = useRef(null)
    const oscRef = useRef([])
    const lfoRef = useRef([])
    const filterRef = useRef([])
    
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
            frequency: filter.filter.frequency.value,
            detune: filter.filter.detune.value,
            type: filter.filter.type,
            Q: filter.filter.Q.value,
            filterFMDepth: filter.FMDepth.gain.value
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
                    node: filter.filter,
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
                    node: filter.gainAdjust,
                    type: "audio param",
                    connectedNodes: 0
                },
                5: {
                    name: "filter FM",
                    node: filter.FMDepth,
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
        <ModularBusContext.Provider value={{stateHook, sequencerRef, seqSlidersRef, keyboardRef, adsrRef, midiToFreqArr, oscilloscopeRef, connectToOscilloscope, matrixRef, adsr, oscRef, lfoRef, filterRef, initialConnection}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
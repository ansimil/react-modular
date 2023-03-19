import { createContext, useReducer, useRef } from "react";
import { 
    setConnections,
    setDisconnections,
    setInitialIOState 
} from "../services/matrix.services";
import { 
    updateOscFrequency
} from "../services/oscillator.services";
import { 
    step,
} from "../services/sequencer.services";
import { 
    startContext 
} from "../services/context.services";
import {
    setModuleInitialState
} from "../services/general.services"
import { 
    Oscillator,
    Filter,
    VCA,
    ADSR,
    LFO,
    Reverb,
    Output
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

let modulesArr = []
let oscillatorsArr = []
let lfosArr = []
let filtersArr = []
let adsrArr = []
let vcasArr = []
let effectsArr = []
let outputsArr = []

let osc1 = new Oscillator(440, `osc${oscillatorsArr.length+1}`)
oscillatorsArr.push(osc1)
let osc2 = new Oscillator(440, `osc${oscillatorsArr.length+1}`)
oscillatorsArr.push(osc2)
modulesArr.push(oscillatorsArr)

let lfo1 = new LFO(2, `lfo${lfosArr.length+1}`)
lfosArr.push(lfo1)
let lfo2 = new LFO(2, `lfo${lfosArr.length+1}`)
lfosArr.push(lfo2)
modulesArr.push(lfosArr)


let filter1 = new Filter(`filter${filtersArr.length+1}`)
filtersArr.push(filter1)
modulesArr.push(filtersArr)

let adsr1 = new ADSR(`adsr${adsrArr.length+1}`)
adsrArr.push(adsr1)
let adsr2 = new ADSR(`adsr${adsrArr.length+1}`)
adsrArr.push(adsr2)
modulesArr.push(adsrArr)

let vca1 = new VCA(`vca${vcasArr.length+1}`)
vcasArr.push(vca1)
let vca2 = new VCA(`vca${vcasArr.length+1}`)
vcasArr.push(vca2)
let vca3 = new VCA(`vca${vcasArr.length+1}`)
vcasArr.push(vca3)
let vca4 = new VCA(`vca${vcasArr.length+1}`)
vcasArr.push(vca4)
modulesArr.push(vcasArr)

function counter(){
    let count = 0
    if (effectsArr.length === 0){
        return 1
    }
    effectsArr.forEach(effect => {
        if (effect.subtype === 'reverb'){
            count++
        }
    })

    return count + 1
    
}
let reverb1 = new Reverb(2, `reverb${counter()}`)
effectsArr.push(reverb1)
modulesArr.push(effectsArr)

let output1 = new Output(`output${outputsArr.length+1}`)
outputsArr.push(output1)
modulesArr.push(outputsArr)

output1.output.connect(out)


const IOs = setInitialIOState(modulesArr)
const inputs = IOs[0]
const outputs = IOs[1]




const initialOscState = setModuleInitialState(oscillatorsArr)
const initialFilterState = setModuleInitialState(filtersArr)
const initialLfoState = setModuleInitialState(lfosArr)
const initialVcaState = setModuleInitialState(vcasArr)
const initialEffectsState = setModuleInitialState(effectsArr)
const initialAdsrState = setModuleInitialState(adsrArr)


// Connection chain //
const initialConnection = [
    [4,0],
    [6,4],
    [14,7],
    [0,2],
    [2,3],
    [7,5],
    [16,11]
]

let connectionChain = []

const midiToFreqConverter = () => {
    for (let i = 0; i < 106; i++){
        let freq = (Math.pow(2, (i-69)/12)*440)
        midiToFreqArr = {...midiToFreqArr, [i]: freq}
    }
}

export function reducer(state, action){
    let { id, value, note, stateKey, i, time, moduleName, subtype, highSteps } = action.payload
    switch (action.type) {
        // SYNTH SETTINGS //
        case ACTIONS.SYNTH.start:
            startContext(osc1.osc, osc2.osc, lfo1.osc, lfo2.osc)
            output1.output.gain.setValueAtTime(output1.output.gain.value, actx.currentTime)
            output1.output.gain.linearRampToValueAtTime(1, actx.currentTime + smoothing)
            return {...state, synthSettings: {...state.synthSettings, start: true, startCount: 1}}

        case ACTIONS.SYNTH.stop:
            output1.output.gain.setValueAtTime(output1.output.gain.value, actx.currentTime)
            output1.output.gain.linearRampToValueAtTime(0.0001, actx.currentTime + smoothing)
            return {...state, synthSettings: {...state.synthSettings, start: false}}
        
        case ACTIONS.SYNTH.outputGain:
            output1.gain.linearRampToValueAtTime(value, actx.currentTime + 0.005)
            return {...state, synthSettings: {...state.synthSettings, [id]: Number(value)}}

        case ACTIONS.SYNTH.bpm:
            state.synthSettings.bpm = value
            Tone.Transport.bpm.rampTo(value, 0.05)
            return {...state, synthSettings: {...state.synthSettings, [id]: Number(value)}}


        // osc SETTINGS //

        case ACTIONS.osc.type:
            oscillatorsArr[i].updateOscType(id, state)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], type: id}}};

        case ACTIONS.osc.detune:
            oscillatorsArr[i].updateOscDetune(value)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}};
        
        case ACTIONS.osc.glide:
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.osc.pwm:
            oscillatorsArr[i].updateOscPwm(value)
            return {...state, oscSettings: {...state.oscSettings, [moduleName]: {...state.oscSettings[moduleName], [id]: Number(value)}}}
        
        case ACTIONS.osc.oscFMDepth:
            oscillatorsArr[i].updateFMDepth(value)
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
            lfosArr[i].updateLfoFrequency(value)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], [id]: Number(value)}}}
        
        case ACTIONS.lfo.type:
            lfosArr[i].updateOscType(id, state)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], type: id}}}

        case ACTIONS.lfo.lfoFMDepth:
            lfosArr[i].updateFMDepth(value)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], [id]: Number(value)}}};
        
        case ACTIONS.lfo.pwm:
            lfosArr[i].updateOscPwm(value)
            return {...state, lfoSettings: {...state.lfoSettings, [moduleName]: {...state.lfoSettings[moduleName], [id]: Number(value)}}}    
        

        // FILTER SETTINGS //

        case ACTIONS.filter.type:
            filtersArr[i].filter.type = id
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], type: id}}};

        case ACTIONS.filter.frequency:
            filtersArr[i].filter.frequency.rampTo(value, 0.1, actx.currentTime)
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value) }}};
            
        case ACTIONS.filter.detune:
            filtersArr[i].filter.detune.rampTo(value, 0.1, actx.currentTime)
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.filter.Q:
            filtersArr[i].filter.Q.rampTo(value, 0.1, actx.currentTime)
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value)}}};

        case ACTIONS.filter.freqFMDepth:
            filtersArr[i].FMDepth.gain.rampTo(value, 0.1, actx.currentTime)
            return {...state, filterSettings: {...state.filterSettings, [moduleName]: {...state.filterSettings[moduleName], [id]: Number(value)}}};
        

        // ADSR SETTINGS //

        case ACTIONS.adsr[id]:
            state.adsrSettings[moduleName][id] = value
            adsrArr[i].adsr[id] = value
            console.log(adsrArr[i].adsr)
            return {...state, adsrSettings: {...state.adsrSettings, [moduleName]: {...state.adsrSettings[moduleName], [id]: Number(value)}}};
        
        case ACTIONS.adsr.trigger:    
            adsrArr[i].updateADSRGain(stateKey, actx.currentTime, state)
            return {...state}

        // VCA SETTINGS //    

        case ACTIONS.vca.gain:
            vcasArr[i].vca.gain.rampTo(value, 0.1, actx.currentTime)
            return {...state, vcaSettings: {...state.vcaSettings, [moduleName]: {...state.vcaSettings[moduleName], [id]: Number(value)}}};
    
        

        // SEQUENCER SETTINGS //
        case ACTIONS.SEQUENCER.player:
            return {...state, sequencerSettings: {...state.sequencerSettings, player: value}}
            
        case ACTIONS.SEQUENCER.direction:
            return {...state, sequencerSettings: {...state.sequencerSettings, direction: value}}

        case ACTIONS.SEQUENCER.octave:
            return {...state, sequencerSettings: {...state.sequencerSettings, tracks: {...state.sequencerSettings.tracks, [`track${state.sequencerSettings.currentTrack}`]: {...state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`], sliders: {...state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`].sliders, [i]: {...state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`].sliders[i], octave: value}}}}}} 
        
        case ACTIONS.SEQUENCER.note:
            return {...state, sequencerSettings: {...state.sequencerSettings, tracks: {...state.sequencerSettings.tracks, [`track${state.sequencerSettings.currentTrack}`]: {...state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`], sliders: {...state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`].sliders, [i]: {...state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`].sliders[i], note: value}}}}}}
        
        case ACTIONS.SEQUENCER.updateStepValue:
            return {...state, sequencerSettings: {...state.sequencerSettings, step: value}}

        case ACTIONS.SEQUENCER.random:
            return {...state, sequencerSettings: {...state.sequencerSettings, random: value}}

        case ACTIONS.SEQUENCER.currentTrack: 
            return {...state, sequencerSettings: {...state.sequencerSettings, currentTrack: value}}
        
        case ACTIONS.SEQUENCER.assignNoteGate:
            console.log(value, id, i)
            let noteGateMap = {
                note: "assignedNotes",
                gate: "assignedGates"
            }
            let newTrackValue
            let trackState
            let tracksObj = {}
            Object.keys(state.sequencerSettings.tracks).forEach(track => {
                if (track === `track${i}`) {
                    newTrackValue = [...state.sequencerSettings.tracks[track][noteGateMap[id]], value]
                    trackState = {...state.sequencerSettings.tracks[track], [noteGateMap[id]]: newTrackValue}
                    if (Object.keys(tracksObj).length === 0){
                        tracksObj = {...state.sequencerSettings.tracks, [track]: trackState}
                    }
                    else {
                        tracksObj = {...tracksObj, [track]: trackState}
                    }  
                }
                else {
                    newTrackValue = [...state.sequencerSettings.tracks[track][noteGateMap[id]]].filter(noteGate => {
                        return noteGate !== value
                    })
                    trackState = {...state.sequencerSettings.tracks[track], [noteGateMap[id]]: newTrackValue}
                    if (Object.keys(tracksObj).length === 0){
                        tracksObj = {...state.sequencerSettings.tracks, [track]: trackState}
                    }
                    else {
                        tracksObj = {...tracksObj, [track]: trackState}
                    }   
                }   
            })
            return {...state, sequencerSettings: {...state.sequencerSettings, tracks: {...tracksObj}}}

        case ACTIONS.SEQUENCER.randomNotes.notes:
            return {...state, sequencerSettings: {...state.sequencerSettings, [`track${state.sequencerSettings.currentTrack}`]: {...state.sequencerSettings[`track${state.sequencerSettings.currentTrack}`], sliders: {...state.sequencerSettings[`track${state.sequencerSettings.currentTrack}`].sliders, [i]: {...state.sequencerSettings[`track${state.sequencerSettings.currentTrack}`].sliders[i], note: value}}}}}
        
        case ACTIONS.SEQUENCER.randomNotes.scale:
            return {...state, sequencerSettings: {...state.sequencerSettings, randomNotes: {...state.sequencerSettings.randomNotes, scale: id}}}
        
        case ACTIONS.SEQUENCER.randomNotes.root:
            return {...state, sequencerSettings: {...state.sequencerSettings, randomNotes: {...state.sequencerSettings.randomNotes, root: id}}}    
            
        case ACTIONS.SEQUENCER.trigger:
            const stepNote = state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`].sliders[value].note + 24 + (12 * state.sequencerSettings.tracks[`track${state.sequencerSettings.currentTrack}`].sliders[value].octave)
            const bpmForClockWidth = (60 / state.synthSettings.bpm) / 16
            highSteps.forEach((track, i) => {
                if (track) {
                    step(oscillatorsArr, adsrArr, time, state, midiToFreqArr, stepNote, bpmForClockWidth, i+1)
                }
            })

            return {...state, oscSettings: {...state.oscSettings, 
                osc1: {...state.oscSettings.osc1, frequency: midiToFreqArr[note]}},
            vcaSettings: {...state.vcaSettings, vca1: {...state.vcaSettings.vca1, gain: vca1.vca.gain.value}}
            };
        
        case ACTIONS.SEQUENCER.length:
            return {...state, sequencerSettings: {...state.sequencerSettings, length: value}}

        case ACTIONS.effects[subtype]?.[id]:
            if (subtype === 'reverb'){
                if (id === 'decay'){
                    effectsArr[i].effect.decay = value
                }
                else if (id === 'preDelay'){
                    effectsArr[i].effect.preDelay = value
                }
                else {
                    effectsArr[i].effect[id].rampTo(value, 0.1, actx.currentTime)
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
                connectionsResponse = setConnections(tuple, state, output1.output, out)
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
    const vcaRef = useRef([])
    let adsrRef = useRef([])
    let effectsRef = useRef([])
    

    midiToFreqConverter()

    const connectToOscilloscope = () => {
        oscilloscopeRef.current.connect(output1.output)
    }

    const stateHook = useReducer(reducer, {
        synthSettings: {
            start: false,
            startCount: 0,
            outputGain: output1.output.gain.value,
            bpm: 120
        },
        oscSettings: {...initialOscState},
        filterSettings: {...initialFilterState},
        adsrSettings: {...initialAdsrState},
        lfoSettings: {...initialLfoState},
        vcaSettings: {...initialVcaState},
        effectsSettings: {...initialEffectsState},
        sequencerSettings: {
            tracks: {
                track1: {
                    sliders: {
                        0:{note:0,octave:3, active: false},
                        1:{note:0,octave:3, active: false},
                        2:{note:0,octave:3, active: false},
                        3:{note:0,octave:3, active: false},
                        4:{note:0,octave:3, active: false},
                        5:{note:0,octave:3, active: false},
                        6:{note:0,octave:3, active: false},
                        7:{note:0,octave:3, active: false},
                        8:{note:0,octave:3, active: false},
                        9:{note:0,octave:3, active: false},
                        10:{note:0,octave:3, active: false},
                        11:{note:0,octave:3, active: false},
                        12:{note:0,octave:3, active: false},
                        13:{note:0,octave:3, active: false},
                        14:{note:0,octave:3, active: false},
                        15:{note:0,octave:3, active: false},
                    },
                    assignedNotes: ["osc1"],
                    assignedGates: ["adsr1"]
                },
                track2: {
                    sliders: {
                        0:{note:0,octave:3, active: false},
                        1:{note:0,octave:3, active: false},
                        2:{note:0,octave:3, active: false},
                        3:{note:0,octave:3, active: false},
                        4:{note:0,octave:3, active: false},
                        5:{note:0,octave:3, active: false},
                        6:{note:0,octave:3, active: false},
                        7:{note:0,octave:3, active: false},
                        8:{note:0,octave:3, active: false},
                        9:{note:0,octave:3, active: false},
                        10:{note:0,octave:3, active: false},
                        11:{note:0,octave:3, active: false},
                        12:{note:0,octave:3, active: false},
                        13:{note:0,octave:3, active: false},
                        14:{note:0,octave:3, active: false},
                        15:{note:0,octave:3, active: false},
                    },
                    assignedNotes: ["osc2"],
                    assignedGates: ["adsr2"]
                },
            },
            currentTrack: 1,
            step: -1,
            player: "stopped",
            direction: "up",
            length: 16,
            random: false,
            randomNotes: {
                root: "c",
                scale: "all"
            }
        },
        matrixSettings: {
            outputs: {...outputs},
            inputs: {...inputs},
            initialConnections: [
                ...initialConnection
            ],
            currentConnections: []
        }
    })


    return (
        <ModularBusContext.Provider value={{oscillatorsArr, filtersArr, lfosArr, adsrArr, vcasArr, effectsArr, stateHook, sequencerRef, seqSlidersRef, keyboardRef, adsrRef, midiToFreqArr, oscilloscopeRef, connectToOscilloscope, matrixRef, adsr1, oscRef, lfoRef, filterRef, vcaRef, effectsRef, initialConnection}}>
        {props.children}
        </ModularBusContext.Provider>
    )

}

export { ModularBusContext, ModularBus }
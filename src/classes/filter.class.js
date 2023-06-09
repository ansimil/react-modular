import * as Tone from 'tone'
import { Slider, Selector } from './classes'

export class Filter {
    constructor(actionsSelector){
        this.type = "filter"
        this.name = actionsSelector
        this.filter = new Tone.Filter({
            max: "10000",
            min: "0",
            frequency: "10000",
            rolloff: -24
        })
        this.FMDepth = new Tone.Gain(0)
        this.QDepth = new Tone.Gain(0)
        this.gainAdjust = new Tone.Gain(1)
        this.gainAdjust.connect(this.filter)
        this.FMDepth.connect(this.filter.detune)
        this.QDepth.connect(this.filter.Q)
        this.filter.Q.value = 0
        this.converter = new Tone.AudioToGain()
        this.settings = {
            matrixIOs: {
                inputs: [
                    {
                        name: `${actionsSelector} audio`,
                        parentModule: this.name,
                        moduleType: this.type,
                        node: this.gainAdjust,
                        type: "audio param",
                        connectedNodes: 0
                    },
                    {
                        name: `${actionsSelector} FM`,
                        parentModule: this.name,
                        moduleType: this.type,
                        stateName: "freqFMDepth",
                        node: this.FMDepth,
                        type: "audio param",
                        subType: "attenuator",
                        connectedNodes: 0,
                        
                    },
                    {
                        name: `${actionsSelector} Q`,
                        parentModule: this.name,
                        moduleType: this.type,
                        stateName: "QDepth",
                        node: this.QDepth,
                        type: "gain param",
                        subType: "attenuator",
                        connectedNodes: 0, 
                    }
                ],
                outputs: [
                    {
                        name: actionsSelector,
                        parentModule: this.name,
                        moduleType: this.type,
                        node: this.filter,
                        type: "audio source",
                        converter: this.converter
                    }
            ]
            },
            slidersArr: [
                new Slider("frequency", "filter", "CUTOFF", 10, 10000, 0.001, "Hz", 1),
                new Slider("detune", "filter", "FINE", 0, 100, 0.001, "cts", 1),
                new Slider("Q", "filter", "RES", 0, 10, 0.001, "", 1),
                new Slider("freqFMDepth", "filter", "FM DEPTH", 0, 2500, 0.001, "", 1),
                new Slider("QDepth", "filter", "RES DEPTH", 0, 10, 0.001, "", 1)
            ],
            selectorsArr: [
                new Selector("lowpass", "LP", "type"),
                new Selector("highpass", "HP", "type"),
                new Selector("bandpass", "BP", "type")
            ]
        }
        this.initialState = {
            frequency: this.filter.frequency.value,
            detune: this.filter.detune.value,
            type: this.filter.type,
            Q: this.filter.Q.value,
            freqFMDepth: this.FMDepth.gain.value,
            QDepth: this.QDepth.gain.value
        }   
    }
    updateFilterType(id){
        this.filter.type = id
    }
    updateFilterFreq(value, startTime, currentTime) {
        this.filter.frequency.rampTo(value, startTime, currentTime)
    }
    updateFilterDetune(value, startTime, currentTime){
        this.filter.detune.rampTo(value, startTime, currentTime)
    }
    updateFilterQ(value, startTime, currentTime){
        this.filter.Q.rampTo(value, startTime, currentTime)
    }
    updateFilterFMDepth(value, startTime, currentTime){
        this.FMDepth.gain.rampTo(value, startTime, currentTime)
    }
    updateFilterQDepth(value, startTime, currentTime){
        this.QDepth.gain.rampTo(value, startTime, currentTime)
    }
}


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
        this.settings = {
            slidersArr: [
                new Slider("frequency", "filter", "CUTOFF", 10, 10000, 0.001, "Hz"),
                new Slider("detune", "filter", "FINE", 0, 100, 0.001, "cts"),
                new Slider("Q", "filter", "RES", 0, 10, 0.001, ""),
                new Slider("freqFMDepth", "filter", "FM Depth", 0, 2500, 0.001, "")
            ],
            selectorsArr: [
                new Selector("lowpass", "LP", "type"),
                new Selector("highpass", "HP", "type"),
                new Selector("bandpass", "BP", "type")
            ]
        }
    }
}


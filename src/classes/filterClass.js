import * as Tone from 'tone'

export class Filter {
    constructor(){
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
    }
}
import * as Tone from 'tone'

export class VCA {
    constructor(){
        this.vca = new Tone.Gain(0)
        this.ctrlGainAdjust = new Tone.Gain(1)
        this.audioGainAdjust = new Tone.Gain(1)
        this.audioGainAdjust.connect(this.vca)
        this.ctrlGainAdjust.connect(this.vca.gain)
    }
}
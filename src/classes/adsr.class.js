import * as Tone from 'tone'

export class ADSR {
    constructor(){
        this.adsr = new Tone.Envelope({
            attack: 0.01,
            decay: 0.2,
            sustain: 0.5,
            release: 0.2,
            attackCurve: "exponential",
            decayCurve: "linear",
            releaseCurve: "exponential"
        })
        this.converter = new Tone.GainToAudio()
    }
}
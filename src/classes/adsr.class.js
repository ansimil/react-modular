import * as Tone from 'tone'
import { Slider } from './slider.class'

export class ADSR {
    constructor(name){
        this.type = "adsr"
        this.name = name
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
        this.settings = {
            slidersArr: [
                new Slider("attack", this.type, "A", 0, 5, 0.001, "s"),
                new Slider("decay", this.type, "D", 0.01, 5, 0.001, "s"),
                new Slider("sustain", this.type, "S", 0, 1, 0.001, ""),
                new Slider("release", this.type, "R", 0.01, 5, 0.001, "s")
            ]
        }
    }
}
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
            matrixIOs: {
                inputs: [
                    {
                        name: `${name} input`,
                        node: this.adsr,
                        type: "gain param"
                    }
                ],
                outputs: [
                    {
                        name: this.name,
                        node: this.adsr,
                        type: "gain source",
                        converter: this.converter
                    }
                ]
            },
            slidersArr: [
                new Slider("attack", this.type, "A", 0.01, 5, 0.001, "s", 1),
                new Slider("decay", this.type, "D", 0.01, 5, 0.001, "s", 1),
                new Slider("sustain", this.type, "S", 0, 1, 0.001, "", 1),
                new Slider("release", this.type, "R", 0.01, 5, 0.001, "s", 1)
            ]
        }
        this.initialState = {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.5,
            release: 0.2,
        }
    }

    updateADSRGain(stateKey, timeNow){
        if (stateKey) {  
            this.adsr.triggerAttack(timeNow, 1)
        }
        if (!stateKey) {
            // let multiplier = (meter.getValue() + 1) / 2
            // let currentRelease = state.adsrSettings.release
            // let newRelease = currentRelease * multiplier
            this.adsr.triggerRelease(timeNow+0.05, 0.0001)
        }
    }
}
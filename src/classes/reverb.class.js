import * as Tone from 'tone'
import { Slider } from './slider.class'

export class Reverb {
    constructor(decay, name){
        this.type = "effects"
        this.subtype = "reverb"
        this.name = name
        this.effect = new Tone.Reverb(decay)
        this.effect.wet.value = 0.001
        this.reverbWetGainBuffer = new Tone.Gain(1)
        this.reverbAudioGainBuffer = new Tone.Gain(1)
        this.reverbWetGainBuffer.connect(this.effect.wet)
        this.reverbAudioGainBuffer.connect(this.effect)
        this.settings = {
            matrixIOs: {
                inputs: [
                    {
                        name: `${name} audio`,
                        node: this.reverbAudioGainBuffer,
                        type: "audio param",
                        connectedNodes: 0 
                    },
                    {
                        name: `${name} wet`,
                        node: this.reverbWetGainBuffer,
                        type: "audio gain",
                        connectedNodes: 0 
                    }
                ],
                outputs: [
                    {
                        name: name,
                        node: this.effect,
                        type: "audio source"
                    }
                ]
            },
            slidersArr: [
                new Slider("decay", this.type, "DECAY", 0, 5, 0.001, "s"),
                new Slider("preDelay", this.type, "DELAY", 0, 2, 0.001, "s"),
                new Slider("wet", this.type, "WET", 0, 1, 0.001, "%"),
            ]
        }
    }
}

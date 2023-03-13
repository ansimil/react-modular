import * as Tone from 'tone'
import { Slider } from './slider.class'

export class VCA {
    constructor(actionsSelector){
        this.type = "vca"
        this.name = actionsSelector
        this.vca = new Tone.Gain(0)
        this.ctrlGainAdjust = new Tone.Gain(1)
        this.audioGainAdjust = new Tone.Gain(1)
        this.audioGainAdjust.connect(this.vca)
        this.ctrlGainAdjust.connect(this.vca.gain)
        this.settings = {
            matrixIOs: {
                inputs: [
                    {
                        name: `${actionsSelector} audio`,
                        node: this.audioGainAdjust,
                        type: "audio param",
                        connectedNodes: 0,
                    },
                    {
                        name: `${actionsSelector} ctrl`,
                        node: this.ctrlGainAdjust,
                        type: "audio gain",
                        connectedNodes: 0 
                    }
                ],
                outputs: [
                    {
                        name: `${actionsSelector}`,
                        node: this.vca,
                        type: "audio source"
                    }
                ]
            },
            slidersArr: [
                new Slider("gain", actionsSelector, "LEVEL", 0, 1, 0.001, "", 100)
            ]

        }
        this.initialState = {
            gain: this.vca.gain.value
        }
    }
    
}
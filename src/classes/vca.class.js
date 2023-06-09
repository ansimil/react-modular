import * as Tone from 'tone'
import { Slider } from './slider.class'

export class VCA {
    constructor(actionsSelector){
        this.type = "vca"
        this.name = actionsSelector
        this.vca = new Tone.Gain(0)
        this.converter = new Tone.AudioToGain()
        this.ctrlGainAdjust = new Tone.Gain(1)
        this.audioGainAdjust = new Tone.Gain(1)
        this.audioGainAdjust.connect(this.vca)
        this.ctrlGainAdjust.connect(this.vca.gain)
        this.settings = {
            matrixIOs: {
                inputs: [
                    {
                        name: `${actionsSelector} audio`,
                        parentModule: this.name,
                        moduleType: this.type,
                        node: this.audioGainAdjust,
                        type: "audio param",
                        connectedNodes: 0,
                    },
                    {
                        name: `${actionsSelector} ctrl`,
                        parentModule: this.name,
                        moduleType: this.type,
                        stateName: "gain",
                        node: this.ctrlGainAdjust,
                        type: "gain param",
                        connectedNodes: 0 
                    }
                ],
                outputs: [
                    {
                        name: `${actionsSelector}`,
                        parentModule: this.name,
                        moduleType: this.type,
                        node: this.vca,
                        type: "audio source",
                        converter: this.converter
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
    updateVcaGain(value, startTime, currentTime){
        this.vca.gain.rampTo(value, startTime, currentTime)
    }
    
}
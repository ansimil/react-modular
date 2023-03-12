import * as Tone from 'tone'

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
                        name: `${actionsSelector} output`,
                        node: this.vca,
                        type: "audio source"
                    }
                ]
            }

        }
    }
    
}
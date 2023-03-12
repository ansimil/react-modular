import * as Tone from 'tone'

export class Output{
    constructor(name){
        this.type = "output"
        this.name = name
        this.output = new Tone.Gain(1)
        this.settings = {
            matrixIOs: {
                inputs: [
                    {
                        name: name,
                        node: this.output,
                        type: "audio param",
                        connectedNodes: 0
                    }
                ]
            }
        }
    }
}
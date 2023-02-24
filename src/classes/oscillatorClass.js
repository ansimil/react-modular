import * as Tone from 'tone'
// import { updateOscFrequency } from '../services/oscillator.services'

export class Oscillator {
    constructor(initFreq){
        this.osc = new Tone.OmniOscillator({
            type:"sine",
            frequency: initFreq
        })
        this.FMDepth = new Tone.Gain(0)
        this.converter = new Tone.AudioToGain()
    }

    initialConnections(){
        this.FMDepth.connect(this.osc.detune)
    }
}
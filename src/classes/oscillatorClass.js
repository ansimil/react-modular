import * as Tone from 'tone'
import { Slider, Selector } from './classes'
// import { updateOscFrequency } from '../services/oscillator.services'

export class Oscillator {
    constructor(initFreq, actionsSelector){
        this.type = "osc"
        this.name = actionsSelector
        this.osc = new Tone.OmniOscillator({
            type:"sine",
            frequency: initFreq
        })
        this.FMDepth = new Tone.Gain(0)
        this.converter = new Tone.AudioToGain()
        this.FMDepth.connect(this.osc.detune)
        this.settings = {
            slidersArr: [
                new Slider("detune", actionsSelector, "DETUNE", 0, 100, 0.001, "cts"),
                new Slider("pwm", actionsSelector, "PWM", 0, 40, 0.001, "Hz"),
                new Slider("glide", actionsSelector, "GLIDE", 0, 5, 0.001, "s"),
                new Slider("oscFMDepth", actionsSelector, "FM DEPTH", 0, 2500, 0.001, "")   
            ],
            selectorsArr: [
                new Selector("sine", "SINE", "type"),
                new Selector("triangle", "TRI", "type"),
                new Selector("pwm", "PULS", "type"),
                new Selector("sawtooth", "SAW", "type")
            ],
        incDecArr: [
            {
                name: "octave"
            },
            {
                name: "semitone"
            }
        ]
        }
    }
}
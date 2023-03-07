import * as Tone from 'tone'
import { Slider, Selector } from './classes'

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
        this.initialState = {
            
        }
    }

    updateOscDetune(value){
        this.osc.detune.value = value
    }

    updateOscType(id, state){
        if (id === "pwm"){
            this.osc.type = id
            this.osc.modulationFrequency.value = state.oscSettings[this.name].pwm
        }
        this.osc.type = id
    }

    updateOscPwm(value){
        if (value === "0" && this.osc.width) {
            this.osc.width.value = 0.5
        }
        if (this.osc.type === "pwm") {
            this.osc.modulationFrequency.value = value
        }
    }

    updateFMDepth(value){
        this.FMDepth.gain.value = value
    }
}
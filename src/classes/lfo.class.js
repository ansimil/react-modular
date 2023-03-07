import * as Tone from 'tone'
import { Slider, Selector } from './classes'

export class LFO {
    constructor(initFreq, actionsSelector){
        this.type = "lfo"
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
                new Slider("frequency", actionsSelector, "COARSE", 0.10, 40, 0.001, "Hz"),
                new Slider("pwm", actionsSelector, "PWM", 0, 40, 0.001, "Hz"),
                new Slider("lfoFMDepth", actionsSelector, "FM DEPTH", 0, 2500, 0.001, "")   
            ],
            selectorsArr: [
                new Selector("sine", "SINE", "type"),
                new Selector("triangle", "TRI", "type"),
                new Selector("pwm", "PULS", "type"),
                new Selector("sawtooth", "SAW", "type")
            ]
        }
    }

    updateLfoFrequency(value) {
        this.osc.frequency.value = value
    }

    updateOscType(id, state){
        if (id === "pwm"){
            this.osc.type = id
            this.osc.modulationFrequency.value = state.lfoSettings[this.name].pwm
        }
        this.osc.type = id
    }

    updateFMDepth(value){
        this.FMDepth.gain.value = value
    }

    updateOscPwm(value){
        if (value === "0" && this.osc.width) {
            this.osc.width.value = 0.5
        }
        if (this.osc.type === "pwm") {
            this.osc.modulationFrequency.value = value
        }
    }
}
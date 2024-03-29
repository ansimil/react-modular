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
            matrixIOs: {
                inputs: [
                    {
                        name: `${actionsSelector} FM`,
                        parentModule: this.name,
                        moduleType: this.type,
                        node: this.FMDepth,
                        stateName: "lfoFMDepth",
                        type: "audio param",
                        subType: "attenuator",
                        connectedNodes: 0
                    }
                ],
                outputs: [
                    {
                        name: actionsSelector,
                        parentModule: this.name,
                        moduleType: this.type,
                        node: this.osc,
                        type: "audio source",
                        converter: this.converter
                    }
                ]
            },
            slidersArr: [
                new Slider("frequency", actionsSelector, "COARSE", 0.10, 40, 0.001, "Hz", 1),
                new Slider("pwm", actionsSelector, "PWM", 0, 40, 0.001, "Hz", 1),
                new Slider("lfoFMDepth", actionsSelector, "FM DEPTH", 0, 2500, 0.001, "", 1)   
            ],
            selectorsArr: [
                new Selector("sine", "SINE", "type"),
                new Selector("triangle", "TRI", "type"),
                new Selector("pwm", "PULS", "type"),
                new Selector("sawtooth", "SAW", "type")
            ]
        }
        this.initialState = {
            frequency: this.osc.frequency.value,
            type: this.osc.type,
            lfoFMDepth: this.FMDepth.gain.value,
            pwm: 0
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
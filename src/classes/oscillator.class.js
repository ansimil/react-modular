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
        this.FMDepth = new Tone.Gain({
            gain: 0
        })
        this.converter = new Tone.AudioToGain()
        this.FMDepth.connect(this.osc.frequency)
        this.settings = {
            matrixIOs: {
                    inputs: [
                        {
                            name: `${actionsSelector} FM`,
                            parentModule: this.name,
                            moduleType: this.type,
                            node: this.FMDepth,
                            stateName: "oscFMDepth",
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
                        },
                    ]
            },
            slidersArr: [
                new Slider("detune", actionsSelector, "DETUNE", 0, 100, 0.001, "cts", 1),
                new Slider("pwm", actionsSelector, "PWM", 0, 40, 0.001, "Hz", 1),
                new Slider("glide", actionsSelector, "GLIDE", 0, 5, 0.001, "s", 1),
                new Slider("oscFMDepth", actionsSelector, "FM DEPTH", 0, 2500, 0.001, "", 0.004)   
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
            frequency: this.osc.frequency.value,
            detune: this.osc.detune.value,
            type: this.osc.type,
            oscFMDepth: this.FMDepth.gain.value,
            glide: 0.00,
            pwm: 0,
            octave: 0,
            semitone: 0
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
        if ((value === "0" || value === 0) && this.osc.type === "pwm") {
            this.osc.set({
                width: 0.5,
            })            
        }
        if (this.osc.type === "pwm") {
            this.osc.modulationFrequency.rampTo(value, 0.01, 0)
        }
    }

    updateFMDepth(value){
        this.FMDepth.gain.rampTo(value, 0.01, 0)
    }
}
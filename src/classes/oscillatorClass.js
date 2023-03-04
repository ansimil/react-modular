import * as Tone from 'tone'
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
            slidersArr: [{
                id: "detune",
                module: actionsSelector,
                label: "DETUNE",
                min: 0,
                max: 5,
                step: 0.001,
                unit: "cts"
            },
            {
                id: "pwm",
                module: actionsSelector,
                label: "PWM",
                min: 0,
                max: 40,
                step: 0.001,
                unit: "Hz"
            },
            {
                id: "glide",
                module: actionsSelector,
                label: "GLIDE",
                min: 0,
                max: 5,
                step: 0.001,
                unit: "s"
            },
            {
                id: "oscFMDepth",
                module: actionsSelector,
                label: "FM DEPTH",
                min: 0,
                max: 5,
                step: 0.001,
                unit: ""
            }],
            selectorsArr: [
            {
                id: "sine",
                label: "SINE",
                type: "type"
            },
            {
                id: "triangle",
                label: "TRI",
                type: "type"
            },
            {
                id: "pwm",
                label: "PULS",
                type: "type"
            },
            {
                id: "sawtooth",
                label: "SAW",
                type: "type"
            }
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
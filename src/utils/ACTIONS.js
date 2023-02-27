export const ACTIONS = {
    SYNTH: {
        start: "start_synth",
        stop: "stop_synth",
        outputGain: "change_synth_outputGain",
        bpm: "change_synth_bpm"
    },
    OSCILLATOR: {
        OSC1: {
            type: "change_osc1_type",
            detune: "change_osc1_detune",
            frequency: "change_osc1_frequency",
            oscFMDepth: "change_osc1_FMDepth",
            oscADSRGain: "change_osc1_ADSR_gain",
            glide: "change_osc1_glide",
            pwm: "change_osc1_pwm",
            offset: "change_osc1_offset"
        },
        OSC2: {
            type: "change_osc2_type",
            detune: "change_osc2_detune",
            frequency: "change_osc2_frequency",
            oscFMDepth: "change_osc2_FMDepth",
            oscADSRGain: "change_osc2_ADSR_gain",
            glide: "change_osc2_glide",
            pwm: "change_osc2_pwm",
            offset: "change_osc2_offset"
        }
    },
    FILTER: {
        CHANGE_FILTER: {
            type: "change_filter_type",
            frequency: "change_filter_frequency",
            detune: "change_filter_detune",
            Q: "change_filter_Q",
            filterFMDepth: "change_filterFMDepth"
        }
    },
    ADSR: {
        CHANGE_ADSR: {
            time:"change_adsr_time",
            gain: "change_adsr_gain"
        }
    },
    LFO: {
        CHANGE_LFO1: {
            type: "change_lfo1_type",
            frequency: "change_lfo1_detune",
            lfoFMDepth: "change_lfo1_FMDepth",
            pwm: "change_lfo1_pwm"
        },
        CHANGE_LFO2: {
            type: "change_lfo2_type",
            frequency: "change_lfo2_frequency",
            lfoFMDepth: "change_lfo2_FMDepth",
            pwm: "change_lfo2_pwm"
        }
    },
    SEQUENCER: {
        note: "change_step_note",
        octave: "change_step_octave",
        step: "trigger_step",
        player: "change_sequencer_player",
        direction: "change_sequencer_direction",
        length: "change_sequencer_length",
        updateStepValue: "update_sequencer_step_value",
        random: "change_sequencer_random"
    },
    MATRIX: {
        connections: "change_connections",
        setConnections: "set_connections"
    },
    EFFECTS: {
        reverb: {
            decay: "change_reverb_decay",
            wet: "change_reverb_wet",
            preDelay: "change_reverb_preDelay"
        }
    }
}
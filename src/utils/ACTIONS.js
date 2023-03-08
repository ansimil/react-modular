export const ACTIONS = {
    SYNTH: {
        start: "start_synth",
        stop: "stop_synth",
        outputGain: "change_synth_outputGain",
        bpm: "change_synth_bpm"
    },
    osc: {
            type: "change_osc_type",
            detune: "change_osc_detune",
            frequency: "change_osc_frequency",
            oscFMDepth: "change_osc_FMDepth",
            glide: "change_osc_glide",
            pwm: "change_osc_pwm",
            offset: "change_osc_offset"
    },
    filter: {
        type: "change_filter_type",
        frequency: "change_filter_frequency",
        detune: "change_filter_detune",
        Q: "change_filter_Q",
        freqFMDepth: "change_freqFMDepth"
    },
    adsr: {
        attack:"change_adsr_attack",
        decay:"change_adsr_decay",
        sustain:"change_adsr_sustain",
        release:"change_adsr_release",
        gain: "change_adsr_gain"
    },
    lfo: {
        type: "change_lfo_type",
        frequency: "change_lfo_detune",
        lfoFMDepth: "change_lfo_FMDepth",
        pwm: "change_lfo_pwm"
    },
    SEQUENCER: {
        currentTrack: "change_current_track",
        note: "change_step_note",
        octave: "change_step_octave",
        step: "trigger_step",
        player: "change_sequencer_player",
        direction: "change_sequencer_direction",
        length: "change_sequencer_length",
        updateStepValue: "update_sequencer_step_value",
        random: "change_sequencer_random",
        randomNotes: {
            notes: "change_sequencer_random_notes",
            scale: "change_sequencer_random_notes_scale",
            root: "change_sequencer_random_notes_root"
        }
    },
    MATRIX: {
        connections: "change_connections",
        setConnections: "set_connections"
    },
    effects: {
        reverb: {
            decay: "change_reverb_decay",
            wet: "change_reverb_wet",
            preDelay: "change_reverb_preDelay"
        }
    }
}
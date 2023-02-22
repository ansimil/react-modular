const updateOscDetune = (osc, value) => {
    osc.detune.value = value
}

const updateOscFrequency = (osc, state, timeNow, midiToFreqArr, note, name) => {
    let glide = timeNow + state.oscSettings[name].glide
    let newNote = note + state.oscSettings[name].semitone + (state.oscSettings[name].octave * 12)
    if (newNote >= 127){
        newNote = 127
    }
    else if (newNote <= 24){
        newNote = 24
    }
    osc.frequency.cancelScheduledValues(timeNow)
    osc.frequency.setValueAtTime(osc.frequency.value, timeNow)
    osc.frequency.linearRampToValueAtTime(midiToFreqArr[newNote], glide) 
    return newNote 
}

const updateLfoFrequency = (lfo, value) => {
    lfo.frequency.value = value
}

const updateOscType = (id, osc, state) => {
    if (id === "pwm"){
        osc.type = id
        osc.modulationFrequency.value = state.oscSettings.osc1.pwm
    }
    osc.type = id
}

const updateOscPwm = (osc, value) => {
    if (value === "0" && osc.width) {
        osc.width.value = 0.5
    }
    if (osc.type === "pwm") {
        osc.modulationFrequency.value = value
    }
}

const updateFMDepth = (FMDepth, value) => {
    FMDepth.gain.value = value
}



export {
    updateOscType,
    updateOscDetune,
    updateOscPwm,
    updateFMDepth,
    updateLfoFrequency,
    updateOscFrequency
}
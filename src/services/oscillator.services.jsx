const updateOscDetune = (osc, value) => {
    osc.detune.value = value
}

const updateOscFrequency = (osc, value) => {
    osc.frequency.value = value
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

const updateOscADSR = (osc, adsr, stateKey, timeNow, state, midiToFreqArr, note, meter,) => {
    if (stateKey) {
        let glide = timeNow + state.oscSettings.osc1.glide
        osc.frequency.cancelScheduledValues(timeNow)
        osc.frequency.setValueAtTime(osc.frequency.value, timeNow)
        osc.frequency.linearRampToValueAtTime(midiToFreqArr[note], glide)
        console.log(adsr)
        adsr.triggerAttack(timeNow, 1)
    }
    if (!stateKey) {
        // let multiplier = (meter.getValue() + 1) / 2
        // let currentRelease = state.adsrSettings.release
        // let newRelease = currentRelease * multiplier
        adsr.triggerRelease(timeNow+0.05, 0.0001)
    }
}


export {
    updateOscType,
    updateOscDetune,
    updateOscPwm,
    updateFMDepth,
    updateOscADSR,
    updateOscFrequency
}
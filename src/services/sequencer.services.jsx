const step = (oscillatorsArr, adsr, timeNow, state, midiToFreqArr, note, bpmForClockWidth) => {
    let glideValue
    let newNote
    oscillatorsArr.forEach(osc =>{
        glideValue = timeNow + state.oscSettings[osc.name].glide
        newNote = note + state.oscSettings[osc.name].semitone + (state.oscSettings[osc.name].octave * 12)
        osc.osc.frequency.cancelScheduledValues(timeNow)
        osc.osc.frequency.setValueAtTime(osc.osc.frequency.value, timeNow)
        osc.osc.frequency.linearRampToValueAtTime(midiToFreqArr[newNote], glideValue)
    })
    adsr.triggerAttackRelease(bpmForClockWidth, timeNow, 1)
}

export {
    step,
}
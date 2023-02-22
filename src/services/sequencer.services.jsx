const step = (oscillators, adsr, timeNow, state, midiToFreqArr, note, bpmForClockWidth) => {
    let glideValue
    let newNote
    oscillators.forEach(osc =>{
        glideValue = timeNow + state.oscSettings[osc.name].glide
        newNote = note + state.oscSettings[osc.name].semitone + (state.oscSettings[osc.name].octave * 12)
        osc.node.frequency.cancelScheduledValues(timeNow)
        osc.node.frequency.setValueAtTime(osc.node.frequency.value, timeNow)
        osc.node.frequency.linearRampToValueAtTime(midiToFreqArr[newNote], glideValue)
    })
    adsr.triggerAttackRelease(bpmForClockWidth, timeNow, 1)
}

export {
    step,
}
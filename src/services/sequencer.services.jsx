const step = (osc, adsr, timeNow, state, midiToFreqArr, note) => {
    let glide = timeNow + state.oscSettings.osc1.glide
    osc.frequency.cancelScheduledValues(timeNow)
    osc.frequency.setValueAtTime(osc.frequency.value, timeNow)
    osc.frequency.linearRampToValueAtTime(midiToFreqArr[note], glide)
    adsr.triggerAttackRelease(0.5, timeNow, 1)
}

export {
    step
}
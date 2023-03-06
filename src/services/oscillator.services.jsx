const updateOscFrequency = (osc, state, timeNow, midiToFreqArr, note, moduleName) => {
    let glide = timeNow + state.oscSettings[moduleName].glide
    let newNote = note + state.oscSettings[moduleName].semitone + (state.oscSettings[moduleName].octave * 12)
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



export {
    updateOscFrequency
}
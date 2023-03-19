const step = (oscillatorsArr, adsrArr, timeNow, state, midiToFreqArr, note, bpmForClockWidth, trackTriggering) => {
    let glideValue
    let newNote
    Object.keys(state.sequencerSettings.tracks).forEach(track => {
        state.sequencerSettings.tracks[track].assignedNotes.forEach(assignedOsc => {
            oscillatorsArr.forEach(osc => {
                if (osc.name === assignedOsc) {
                    glideValue = timeNow + state.oscSettings[osc.name].glide
                    newNote = note + state.oscSettings[osc.name].semitone + (state.oscSettings[osc.name].octave * 12)
                    osc.osc.frequency.cancelScheduledValues(timeNow)
                    osc.osc.frequency.setValueAtTime(osc.osc.frequency.value, timeNow)
                    osc.osc.frequency.linearRampToValueAtTime(midiToFreqArr[newNote], glideValue)
                }
            })
        })
        
    })
    state.sequencerSettings.tracks[`track${trackTriggering}`].assignedGates.forEach(assignedAdsr => {
            adsrArr.forEach(adsr => {
                if (adsr.name === assignedAdsr) {
                    console.log(`track${trackTriggering}`, adsr.name)
                    adsr.adsr.triggerAttackRelease(bpmForClockWidth, timeNow, 1)
                }
            })
    })
}

export {
    step,
}
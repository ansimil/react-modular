const step = (oscillatorsArr, adsrArr, timeNow, state, midiToFreqArr, step, bpmForClockWidth, trackTriggering) => {
    let glideValue
    let newNote
    Object.keys(state.sequencerSettings.tracks).forEach(track => {
        state.sequencerSettings.tracks[track].assignedNotes.forEach(assignedOsc => {
            const note = state.sequencerSettings.tracks[track].sliders[step].note + 24 + (12 * state.sequencerSettings.tracks[track].sliders[step].octave)
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
                    adsr.adsr.triggerAttackRelease(bpmForClockWidth, timeNow, 1)
                }
            })
    })
}

export {
    step,
}
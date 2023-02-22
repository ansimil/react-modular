const updateADSRGain = (adsr, stateKey, timeNow) => {
    if (stateKey) {  
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
    updateADSRGain
}
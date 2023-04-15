import * as Tone from 'tone'

const startContext = async (oscillatorsArr, lfosArr) => {
    if (Tone.context.state === "suspended"){
        await Tone.context.resume()
        oscillatorsArr.forEach(osc => {
            osc.osc.start()
        })
        lfosArr.forEach(lfo => {
            lfo.osc.start()
        })
    }
    else if (Tone.context.state === "running") {
        oscillatorsArr.forEach(osc => {
            osc.osc.start()
        })
        lfosArr.forEach(lfo => {
            lfo.osc.start()
        })
    }
}

export {
    startContext
}
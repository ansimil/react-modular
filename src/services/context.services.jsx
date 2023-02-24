import * as Tone from 'tone'

const startContext = async (osc1, osc2, lfo1, lfo2) => {
    if (Tone.context.state === "suspended"){
        await Tone.context.resume()
        osc1.start()
        osc2.start()
        lfo1.start()
        lfo2.start()
    }
    else if (Tone.context.state === "running") {
        osc1.start()
        osc2.start()
        lfo1.start()
        lfo2.start()
    }
}

export {
    startContext
}
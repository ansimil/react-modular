const setConnections = (tuple, state, output, out) => {
        if (tuple.indexOf(6) === 0){
            (state.matrixSettings.inputs[tuple[0]].node).connect(output)
            output.connect(out)
        }
        state.matrixSettings.outputs[tuple[1]].node.connect(state.matrixSettings.inputs[tuple[0]].node)

}

const setDisconnections = (tuple, state) => {
            state.matrixSettings.outputs[tuple[1]].node.disconnect(state.matrixSettings.inputs[tuple[0]].node)
}

export {
    setConnections,
    setDisconnections
}
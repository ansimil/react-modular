const setConnections = (tuple, state, output, out) => {
        let nodeToConnectTo = state.matrixSettings.inputs[tuple[0]]
        let nodeToConnect = state.matrixSettings.outputs[tuple[1]]
        if (tuple[0] === 7){
            nodeToConnect.node.connect(nodeToConnectTo.node)
            nodeToConnectTo.node.connect(output)
            output.connect(out)
        }
        else {
            nodeToConnect.node.connect(nodeToConnectTo.node)
        }

}

const setDisconnections = (tuple, state) => {
        let nodeToDisconnectFrom = state.matrixSettings.inputs[tuple[0]].node
        let nodeToDisconnect = state.matrixSettings.outputs[tuple[1]].node

        nodeToDisconnect.disconnect(nodeToDisconnectFrom)
            
}

export {
    setConnections,
    setDisconnections
}
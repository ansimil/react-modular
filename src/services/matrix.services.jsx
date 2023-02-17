const setConnections = (tuple, state, output, out) => {
        let nodeToConnectTo = state.matrixSettings.inputs[tuple[0]]
        let nodeToConnect = state.matrixSettings.outputs[tuple[1]]
        if (tuple[0] === 6){
            nodeToConnect.node.connect(nodeToConnectTo.node)
            nodeToConnectTo.node.connect(output)
            output.connect(out)
        }
        else if (tuple[0] === 5 && (tuple[1] === 5 || tuple[1] === 0 || tuple[1] === 1 || tuple[1] === 2 || tuple[1] === 3)){
            console.log('firing 5', nodeToConnect, nodeToConnectTo)
            nodeToConnect.node.connect(nodeToConnectTo.node.gain)
        }
        else {
            console.log('firing rest', nodeToConnect, nodeToConnectTo)
            nodeToConnect.node.connect(nodeToConnectTo.node)
        }

}

const setDisconnections = (tuple, state) => {
        let nodeToDisconnectFrom = state.matrixSettings.inputs[tuple[0]].node
        let nodeToDisconnect = state.matrixSettings.outputs[tuple[1]].node

        if (tuple[0] === 5 && (tuple[1] === 5 || tuple[1] === 0 || tuple[1] === 1 || tuple[1] === 2 || tuple[1] === 3)){
            nodeToDisconnect.disconnect(nodeToDisconnectFrom.gain)
            return
        }
        else {
            nodeToDisconnect.disconnect(nodeToDisconnectFrom)
        }
            
}

export {
    setConnections,
    setDisconnections
}
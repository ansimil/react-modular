const setConnections = (tuple, state, output, out) => {
        let nodeToConnectTo = state.matrixSettings.inputs[tuple[0]]
        let nodeToConnect = state.matrixSettings.outputs[tuple[1]]
        if (nodeToConnectTo.name === 'output'){
            console.log(nodeToConnect.name, 'connects to', nodeToConnectTo.name)
            console.log(nodeToConnectTo.name, 'connects to output')
            nodeToConnect.node.connect(nodeToConnectTo.node)
            nodeToConnectTo.node.connect(output)
            output.connect(out)
        }
        else {
            console.log(nodeToConnect.name, 'connects to', nodeToConnectTo.name)
            nodeToConnect.node.connect(nodeToConnectTo.node)
        }

}

const setDisconnections = (tuple, state) => {
        let nodeToDisconnectFrom = state.matrixSettings.inputs[tuple[0]]
        let nodeToDisconnect = state.matrixSettings.outputs[tuple[1]]
        console.log(nodeToDisconnect.name, 'discconnects from', nodeToDisconnectFrom.name)

        nodeToDisconnect.node.disconnect(nodeToDisconnectFrom.node)
            
}

export {
    setConnections,
    setDisconnections
}
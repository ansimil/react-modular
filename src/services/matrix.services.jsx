const setConnections = (tuple, state, output, out) => {
        let nodeToConnectTo = state.matrixSettings.inputs[tuple[0]]
        let nodeToConnect = state.matrixSettings.outputs[tuple[1]]
       
        if ((nodeToConnect.type === "gain source" && nodeToConnectTo.type === "audio param") || (nodeToConnect.type === "audio source" && nodeToConnectTo.type === "gain param")) {
            nodeToConnect.node.connect(nodeToConnect.converter)
            nodeToConnect.converter.connect(nodeToConnectTo.node)
            console.log(nodeToConnect.name, 'connects to converter, connects to', nodeToConnectTo.name)
        }
        else {
            console.log(nodeToConnect.name, 'connects to', nodeToConnectTo.name)
            nodeToConnect.node.connect(nodeToConnectTo.node)
        }

}

const setDisconnections = (tuple, state) => {
        let nodeToDisconnectFrom = state.matrixSettings.inputs[tuple[0]]
        let nodeToDisconnect = state.matrixSettings.outputs[tuple[1]]

        if ((nodeToDisconnect.type === "gain source" && nodeToDisconnectFrom.type === "audio param") || (nodeToDisconnect.type === "audio source" && nodeToDisconnectFrom.type === "gain param")){
            nodeToDisconnect.node.disconnect(nodeToDisconnect.converter)
            nodeToDisconnect.converter.disconnect(nodeToDisconnectFrom.node)
        }

        else {
            console.log(nodeToDisconnect.name, 'disconnects from', nodeToDisconnectFrom.name)
            nodeToDisconnect.node.disconnect(nodeToDisconnectFrom.node)
         }   
            
}

export {
    setConnections,
    setDisconnections
}
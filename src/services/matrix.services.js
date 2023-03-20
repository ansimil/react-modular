const setConnections = (tuple, state) => {
        let nodeToConnectTo = state.matrixSettings.inputs[tuple[0]]
        let nodeToConnect = state.matrixSettings.outputs[tuple[1]]
        let updateConnectionCount

        if ((nodeToConnect.type === "gain source" && nodeToConnectTo.type === "audio param") || (nodeToConnect.type === "audio source" && nodeToConnectTo.type === "gain param")) {
            console.log(nodeToConnect.name, 'connects to converter, connects to', nodeToConnectTo.name)
            nodeToConnect.node.output.output.rampTo(0,0.01,0)
            nodeToConnect.node.connect(nodeToConnect.converter)
            nodeToConnect.converter.connect(nodeToConnectTo.node)
            nodeToConnect.node.output.output.rampTo(1,0.01,0)
            updateConnectionCount = (nodeToConnectTo.connectedNodes) + 1
        }
        else {
            updateConnectionCount = (nodeToConnectTo.connectedNodes) + 1 
            if (updateConnectionCount === 0) {
                nodeToConnectTo.node.gain.value = 0
            }
            else {
                nodeToConnectTo.node.gain.value = 1 / updateConnectionCount
            }
            console.log(nodeToConnect.name, 'connects to', nodeToConnectTo.name)
            nodeToConnect.node.connect(nodeToConnectTo.node)
        }

        return updateConnectionCount

}

const setDisconnections = (tuple, state) => {
        let nodeToDisconnectFrom = state.matrixSettings.inputs[tuple[0]]
        let nodeToDisconnect = state.matrixSettings.outputs[tuple[1]]
        let updateConnectionCount

        if ((nodeToDisconnect.type === "gain source" && nodeToDisconnectFrom.type === "audio param") || (nodeToDisconnect.type === "audio source" && nodeToDisconnectFrom.type === "gain param")){
            updateConnectionCount = (nodeToDisconnectFrom.connectedNodes) - 1 
            nodeToDisconnect.node.disconnect(nodeToDisconnect.converter)
            nodeToDisconnect.converter.disconnect(nodeToDisconnectFrom.node)
        }
        else {
            updateConnectionCount = (nodeToDisconnectFrom.connectedNodes) - 1
            if (updateConnectionCount === 0) {
                nodeToDisconnectFrom.node.gain.value = 1
            }
            else {
                nodeToDisconnectFrom.node.gain.value = 1 / updateConnectionCount
            }
            console.log(nodeToDisconnect.name, 'disconnects from', nodeToDisconnectFrom.name)
            nodeToDisconnect.node.disconnect(nodeToDisconnectFrom.node)
         } 
         
         return updateConnectionCount
            
}

const setInitialIOState = (modulesArr) => {
    let inputs = []
    let outputs = []

    modulesArr.forEach((moduleSet, i) => {
        moduleSet.forEach(module => {
            module.settings.matrixIOs.inputs.forEach(input => {
            inputs.push(input)
        })
        })
        moduleSet.forEach(module => {
            module.settings.matrixIOs.outputs?.forEach(output => {
            outputs.push(output)
        })
        })
    })
    return [inputs, outputs]
}

export {
    setConnections,
    setDisconnections,
    setInitialIOState
}
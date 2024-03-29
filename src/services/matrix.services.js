const setConnections = (tuple, state) => {
        let nodeToConnectTo = state.matrixSettings.inputs[tuple[0]]
        let nodeToConnect = state.matrixSettings.outputs[tuple[1]]
        let updateConnectionCount

        if ((nodeToConnect.type === "gain source" && nodeToConnectTo.type === "audio param") || (nodeToConnect.type === "audio source" && nodeToConnectTo.type === "gain param")) {
            updateConnectionCount = (nodeToConnectTo.connectedNodes) + 1
            nodeToConnect.node.connect(nodeToConnect.converter)
            nodeToConnect.converter.connect(nodeToConnectTo.node)
            console.log(nodeToConnect.name, 'connects to converter, connects to', nodeToConnectTo.name)
        }
        else if (nodeToConnectTo.subType === 'attenuator'){
            updateConnectionCount = (nodeToConnectTo.connectedNodes) + 1
            const value = state[`${nodeToConnectTo.moduleType}Settings`][nodeToConnectTo.parentModule][nodeToConnectTo.stateName]
            nodeToConnect.node.connect(nodeToConnectTo.node)
            nodeToConnectTo.node.gain.rampTo(value, 0.01, 0)
            console.log(nodeToConnect.name, 'connects to', nodeToConnectTo.name)
        }
        else {
            updateConnectionCount = (nodeToConnectTo.connectedNodes) + 1
            nodeToConnect.node.connect(nodeToConnectTo.node)
            if (updateConnectionCount === 0) {
                nodeToConnectTo.node.gain.value = 0
            }
            else {
                nodeToConnectTo.node.gain.rampTo(1 / updateConnectionCount, 0.01, 0) 
            }
            console.log(nodeToConnect.name, 'connects to', nodeToConnectTo.name)
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
                console.log('fire disconnection gain', updateConnectionCount)
                nodeToDisconnectFrom.node.gain.rampTo(1 / updateConnectionCount, 0.01, 0)
                console.log(nodeToDisconnectFrom.node.gain)
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
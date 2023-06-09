let updateConnectionCount


const setConnections = (tuple, state, IOs) => {
        let nodeToConnectTo = IOs[0][tuple[0]]
        let nodeToConnect = IOs[1][tuple[1]]

        if ((nodeToConnect.type === "gain source" && nodeToConnectTo.type === "audio param") || (nodeToConnect.type === "audio source" && nodeToConnectTo.type === "gain param")) {
            updateConnectionCount = (nodeToConnectTo.connectedNodes) + 1
            nodeToConnect.node.connect(nodeToConnect.converter)
            nodeToConnect.converter.connect(nodeToConnectTo.node)
            console.log(nodeToConnect.name, 'connects to converter, connects to', nodeToConnectTo.name)
            console.log(nodeToConnectTo.name, nodeToConnectTo.connectedNodes)
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
        // console.log(updateConnectionCount)
        return updateConnectionCount

}

const setDisconnections = (tuple, IOs) => {
        let nodeToDisconnectFrom = IOs[0][tuple[0]]
        let nodeToDisconnect = IOs[1][tuple[1]]
        
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
                console.log(nodeToDisconnectFrom.node.gain.value)
            }
            console.log(nodeToDisconnect.name, 'disconnects from', nodeToDisconnectFrom.name)
            nodeToDisconnect.node.disconnect(nodeToDisconnectFrom.node)
            console.log("disconnect2")
         } 
         console.log(updateConnectionCount)
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
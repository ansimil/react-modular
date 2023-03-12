import { useContext, useEffect } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import Nexus from 'nexusui'
import './Matrix.css'

const Matrix = ( { matrixLocationRef } ) => {
    const { matrixRef, initialConnection, stateHook } = useContext(ModularBusContext)
    // eslint-disable-next-line
    const [appState, updateState] = stateHook

    const changeConnections = e => {
        updateState({type: ACTIONS.MATRIX.connections, payload: {value: e} })
    }
    let sqSize = 40
    let rows = Object.keys(appState.matrixSettings.outputs).length
    let columns = Object.keys(appState.matrixSettings.inputs).length
    let width = sqSize * columns
    let height = sqSize * rows
    
    useEffect(()=>{
        let matrix = new Nexus.Sequencer("#matrix", {
            "size": [width, height],
            "rows": rows,
            "columns": columns 
        })
        matrix.on("change", (e) => {
            changeConnections(e)
        })
        matrix.colors.accent = "#000"
        matrix.element.id = "matrix"
        matrix.type = 'Matrix'
        matrix.mode = 'toggle'
        initialConnection.forEach(connection => {
            matrix.matrix.toggle.cell(...connection)
        })
        matrixRef.current = matrix
        // eslint-disable-next-line
    },[])

   

  return (
    <div ref={matrixLocationRef} className='matrixContainer'>
        <div className='matrixContainerInner'>
        <div className="inputsLabel"><p>inputs</p></div>
            <table>
                <thead>
                
                        <tr className="horizontal-labels">
                            <th></th> 
                            <th></th>
                            <th style={{display: "flex"}}>
                            {Object.keys(appState.matrixSettings.inputs).map((input, i) => {
                                const name = appState.matrixSettings.inputs[input].name
                                return (
                                        <div key={i} className="horizontal-label"><span className="horizontal-span">{name}</span></div>
                                )
                            })
                            }
                            </th>
                        </tr>
                
                </thead>
                <tbody>
                    <tr>
                        <td className="outputsLabel"><p>outputs</p></td>
                            
                        <td className='verticalLabels' style={{"height": `${height}px`}}>
                            {Object.keys(appState.matrixSettings.outputs).map((output, i) => {
                                const name = appState.matrixSettings.outputs[output].name
                                return (
                                    <div key={i} className="vertical-label"><span className="vertical-span">{name}</span></div> 
                                )
                            })
                            }
                        </td>
                            
                        <td>
                            <div id="matrix"></div>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
      
    </div>
  )
}

export default Matrix
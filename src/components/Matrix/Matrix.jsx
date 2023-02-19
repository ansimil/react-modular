import { useContext, useEffect } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'
import './Matrix.css'

const Matrix = () => {
    const { matrixRef, initialConnection, stateHook } = useContext(ModularBusContext)
    // eslint-disable-next-line
    const [appState, updateState] = stateHook

    const changeConnections = e => {
        updateState({type: ACTIONS.MATRIX.connections, payload: {value: e} })
    }

    useEffect(()=>{
        let matrix = new Nexus.Sequencer("#matrix", {
            "size": [300, 300],
            "rows": 7,
            "columns": 8 
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
    <div className='matrixContainer'>
        <div className='matrixContainerInner'>
        <div className="inputsLabel"><p>inputs</p></div>
            <div className="horizontalLabels">
                <div className="horizontalLabel"><p>osc1FM</p></div>
                <div className="horizontalLabel"><p>osc2FM</p></div>
                <div className="horizontalLabel"><p>lfo1FM</p></div>
                <div className="horizontalLabel"><p>lfo2FM</p></div>
                <div className="horizontalLabel"><p>filter</p></div>
                <div className="horizontalLabel"><p>vca audio</p></div> 
                <div className="horizontalLabel"><p>vca ctrl.</p></div> 
                <div className="horizontalLabel"><p>output</p></div>
            </div>
            <div className="matrixInner">
            <div className="outputsLabel"><p>outputs</p></div>
            <div className='verticalLabels'>
                <div className="verticalLabel">osc1</div>
                <div className="verticalLabel">osc2</div>
                <div className="verticalLabel">lfo1</div>
                <div className="verticalLabel">lfo2</div>
                <div className="verticalLabel">filter</div>
                <div className="verticalLabel">env</div>
                <div className="verticalLabel">vca</div> 
            </div>
            <div id="matrix"></div>
    
            </div>
        </div>
    </div>
  )
}

export default Matrix
import { useContext, useEffect } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'
import './Matrix.css'

const Matrix = () => {
    const { matrixRef, initialConnection, stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

    const changeConnections = e => {
        updateState({type: ACTIONS.MATRIX.connections, payload: {value: e} })
    }

    const setConnections = () => {
        updateState({type: ACTIONS.MATRIX.setConnections, payload: "setConnections" })
    }

    useEffect(()=>{
        let matrix = new Nexus.Sequencer("#matrix", {
            "size": [300, 300],
            "rows": 7,
            "columns": 7 
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
        updateState({type: ACTIONS.MATRIX.setConnections, payload: "setConnections" })
    },[])

   

  return (
    <div className='matrixContainer'>
        <div className='matrixContainerInner'>
            <div className="horizontalLabels">
                <div className="horizontalLabel">osc1FM</div>
                <div className="horizontalLabel">osc2FM</div>
                <div className="horizontalLabel">lfo1FM</div>
                <div className="horizontalLabel">lfo2FM</div>
                <div className="horizontalLabel">filter</div>
                <div className="horizontalLabel">vca</div> 
                <div className="horizontalLabel">output</div>
            </div>
            <div className="matrixInner">
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
            <div>
                <button
                onClick={()=>{
                    setConnections()
                }}
                >
                Set Connections
                </button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Matrix
import { useContext, useEffect } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import Nexus from 'nexusui'
import './Matrix.css'

const Matrix = ( { matrixLocationRef } ) => {
    const { matrixRef, stateHook, IOs } = useContext(ModularBusContext)
    // eslint-disable-next-line
    const [appState, updateState] = stateHook
    const { matrixSettings } = appState

    const changeConnections = e => {
        matrixRef.current?.cells.forEach(cell => {
            if (cell.row === e.row && cell.column === e.column && e.state) {
                cell.element.children[0].style.fill = "#000"
            }
            if (cell.row === e.row && cell.column === e.column && !e.state){
                cell.element.children[0].style.fill = "#ffffff"
                highlightRowsColumns(e)
            }
        })
        updateState({type: ACTIONS.MATRIX.connections, payload: {value: e} })
    }
    let sqSize = 400/Object.keys(IOs[1]).length
    let rows = Object.keys(IOs[1]).length
    let columns = Object.keys(IOs[0]).length
    let width = sqSize * columns
    let height = sqSize * rows

    const highlightRowsColumns = (cell) => {
        let row = cell.row
        let column = cell.column
        const verticalLabels = document.getElementsByClassName('verticalLabels')[0].childNodes
        const horizontalLabels = Array.from(document.getElementsByClassName('horizontal-label'))
        matrixRef.current.cells.forEach(cell => {
            if (!cell._state.state) {
                cell.element.children[0].style.fill = "#fff"
            }
            else if (cell._state.state) {
                cell.element.children[0].style.fill = "#000"
            }
        })
        verticalLabels.forEach((label, i) => {
            if (i === cell.row) {
                label.children[0].style.borderBottom = "solid black 1px"
            }
            else {
                label.children[0].style.borderBottom = "none"
            }
        })
        horizontalLabels.forEach((label, i) => {
            if (i === cell.column) {
                label.children[0].style.borderBottom = "solid black 1px"
            }
            else {
                label.children[0].style.borderBottom = "none"
            }
        })
        matrixRef.current.cells.forEach(cell => {
            if ((cell.row === row || cell.column === column) && !cell._state.state) {
                cell.element.children[0].style.fill = "#fafdd1" 
            }
        })
        if (cell.element) {
            if (!cell._state?.state || !cell.state) {
                cell.element.children[0].style.fill = "#f7ff61"
            }
            if (cell._state?.state || cell.state) {
                cell.element.children[0].style.fill = "#393939"
            }
        }
        
    }
    
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
        matrixSettings.currentConnections.forEach(connection => {
            matrix.matrix.toggle.cell(...connection)
        })
        matrix.cells.forEach(cell => {
            cell.element.addEventListener("mouseover", (e) => {
                highlightRowsColumns(cell)
            })
        })
        matrixRef.current = matrix
        // eslint-disable-next-line
    },[])

   

  return (
    <div 
    ref={matrixLocationRef} 
    className='matrixContainer' 
    onMouseOver={(e) => {
        const verticalLabels = document.getElementsByClassName('verticalLabels')[0].childNodes
        const horizontalLabels = Array.from(document.getElementsByClassName('horizontal-label'))
        
        if (e.target.nodeName !== "rect") {
        matrixRef.current?.cells.forEach(cell => {
            if (cell._state.state) {
                cell.element.children[0].style.fill = "#000"
            }
            else {
                cell.element.children[0].style.fill = "#fff"
            }
        })
        }
        if (e.target.nodeName !== "rect" && e.target.nodeName !== "svg"){
            verticalLabels.forEach((label) => {
            label.style.color = "#000"
            label.children[0].style.borderBottom = "none"
        })
        horizontalLabels.forEach((label) => {
            label.style.color = "#000"
            label.children[0].style.borderBottom = "none"
        })
        }
    }}
    >
        <div className='matrixContainerInner'>
        <div className="inputsLabel"><p>inputs</p></div>
            <table>
                <thead>
                
                        <tr className="horizontal-labels">
                            <th></th> 
                            <th></th>
                            <th style={{display: "flex"}}>
                            {Object.keys(IOs[0]).map((input, i) => {
                                const name = IOs[0][input].name
                                return (
                                        <div key={i} className="horizontal-label" style={{"width": `${sqSize}px`}}><span className="horizontal-span" style={{fontSize: `${0.025*sqSize}rem`}}>{name}</span></div>
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
                            {Object.keys(IOs[1]).map((output, i) => {
                                const name = IOs[1][output].name
                                return (
                                    <div key={i} className="vertical-label" style={{height: sqSize}}><span className="vertical-span" style={{fontSize: `${0.025*sqSize}rem`}}>{name}</span></div> 
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
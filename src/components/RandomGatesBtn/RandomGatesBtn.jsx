import React from 'react'
import { handleMouseEvent } from '../../services/general.services'

const RandomGatesBtn = ({randomizeFunc}) => {
  return (
    <div className="random-gatesbtn-container sequencer-settings-small settings-container settings-container-dark settings-container-dark-inlay">
        <div className="seq-settings-label-div">
            <p className="seq-settings-label">RANDOMIZE GATES</p>
        </div>
        <div className="randomize-gates-btn-container">
          <button 
          className="randomize-gates-btn bt btn-light"
          onClick={randomizeFunc}
          onMouseDown={()=>{
            handleMouseEvent("randomize-gates-btn", true)
          }}
          onMouseUp={()=>{
            handleMouseEvent("randomize-gates-btn", false)
          }}
          >
          <p>RANDOMIZE</p>
          </button>
        </div>
    </div>
  )
}

export default RandomGatesBtn
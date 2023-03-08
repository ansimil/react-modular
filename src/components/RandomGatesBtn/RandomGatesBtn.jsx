import React from 'react'

const RandomGatesBtn = ({randomizeFunc}) => {
  return (
    <div className="random-gatesbtn-container sequencer-settings-small">
        <div className="seq-settings-label-div">
            <p className="seq-settings-label">RANDOMIZE GATES</p>
        </div>
        <div className="randomize-gates-btn-container">
          <button 
          className="randomize-gates-btn btn"
          onClick={randomizeFunc}
          >
          <p>RANDOMIZE</p>
          </button>
        </div>
    </div>
  )
}

export default RandomGatesBtn
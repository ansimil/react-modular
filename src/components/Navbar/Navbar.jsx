import React from 'react'
import './Navbar.css'

const Navbar = ({keysAndSeqRef, oscillatorsRef, lfosRef, filterRef, envelopeRef, oscilloscopeRef, matrixLocationRef}) => {

    const scrollTo = (ref) => {
        const { current } = ref
        const {offsetLeft:x, offsetTop: y} = current
        window.scrollTo({
            top: y-85,
            left: x,
            behavior: "smooth",
        })
    }

  return (
    <div className="navbar-container">
        <button onClick={()=>{scrollTo(matrixLocationRef)}}>_matrix</button>
        <button onClick={()=>{scrollTo(keysAndSeqRef)}}>_keys + _seq</button>
        <button onClick={()=>{scrollTo(oscillatorsRef)}}>_oscillators</button>
        <button onClick={()=>{scrollTo(lfosRef)}}>_lfos</button>
        <button onClick={()=>{scrollTo(filterRef)}}>_filter</button>
        <button onClick={()=>{scrollTo(envelopeRef)}}>_envelope</button>
        <button onClick={()=>{scrollTo(oscilloscopeRef)}}>_oscilloscope</button>
    </div>
  )
}

export default Navbar
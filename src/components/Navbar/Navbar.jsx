import { handleMouseEvent } from '../../services/general.services'
import React from 'react'
import './Navbar.css'

const Navbar = ({seqRef, oscillatorsRef, lfosRef, filterRef, envelopeRef, oscilloscopeRef, matrixLocationRef, effectsLocationRef, keysRef, vcaRef}) => {

    const scrollTo = (ref) => {
        const { current } = ref
        const {offsetLeft:x, offsetTop: y} = current
        window.scrollTo({
            top: y-95,
            left: x,
            behavior: "smooth",
        })
    }

    const NavbarBtn = React.forwardRef( (props, ref) => {
        return (
        <button 
        className={`btn navbar-btn ${props.name}-navbar-btn`}
        onClick={()=>{
            scrollTo(ref)}
        }
        onMouseDown={()=>{
            handleMouseEvent(`${props.name}-navbar-btn`, true)
        }}
        onMouseUp={()=>{
            handleMouseEvent(`${props.name}-navbar-btn`, false)
        }}
        >
        {`_${props.name}`}
        </button>
        )
    })

  return (
    <div className="navbar-container">
        <p className="navbar-title">navigation:</p>
        <NavbarBtn name="matrix" ref={matrixLocationRef} />
        <NavbarBtn name="seq" ref={seqRef} />
        <NavbarBtn name="oscillators" ref={oscillatorsRef} />
        <NavbarBtn name="lfos" ref={lfosRef} />
        <NavbarBtn name="filter" ref={filterRef} />
        <NavbarBtn name="envelopes" ref={envelopeRef} />
        <NavbarBtn name="effects" ref={effectsLocationRef} />
        <NavbarBtn name="oscilloscope" ref={oscilloscopeRef} />
        <NavbarBtn name="keys" ref={keysRef} />
    </div>
  )
}

export default Navbar
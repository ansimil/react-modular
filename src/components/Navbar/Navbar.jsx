import { handleMouseEvent } from '../../services/general.services'
import './Navbar.css'

const Navbar = ({keysAndSeqRef, oscillatorsRef, lfosRef, filterRef, envelopeRef, oscilloscopeRef, matrixLocationRef}) => {

    const scrollTo = (ref) => {
        const { current } = ref
        const {offsetLeft:x, offsetTop: y} = current
        window.scrollTo({
            top: y-95,
            left: x,
            behavior: "smooth",
        })
    }

  return (
    <div className="navbar-container">
        <p className="navbar-title">navigation:</p>
        <button 
        className="btn navbar-btn matrix-navbar-btn" 
        onClick={()=>{
            scrollTo(matrixLocationRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("matrix-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("matrix-navbar-btn", false)
        }}
        >
        _matrix
        </button>

        <button 
        className="btn navbar-btn keys-seq-navbar-btn" 
        onClick={
            ()=>{scrollTo(keysAndSeqRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("keys-seq-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("keys-seq-navbar-btn", false)
        }}
        >
        _keys + _seq
        </button>

        <button 
        className="btn navbar-btn oscillators-navbar-btn" 
        onClick={
            ()=>{scrollTo(oscillatorsRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("oscillators-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("oscillators-navbar-btn", false)
        }}
        >
        _oscillators
        </button>

        <button 
        className="btn navbar-btn lfos-navbar-btn" 
        onClick={
            ()=>{scrollTo(lfosRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("lfos-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("lfos-navbar-btn", false)
        }}
        >
        _lfos
        </button>

        <button 
        className="btn navbar-btn filter-navbar-btn" 
        onClick={
            ()=>{scrollTo(filterRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("filter-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("filter-navbar-btn", false)
        }}
        >
        _filter
        </button>

        <button 
        className="btn navbar-btn envelope-navbar-btn" 
        onClick={
            ()=>{scrollTo(envelopeRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("envelope-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("envelope-navbar-btn", false)
        }}
        >
        _envelope
        </button>

        <button 
        className="btn navbar-btn oscilloscope-navbar-btn" 
        onClick={
            ()=>{scrollTo(oscilloscopeRef)}
        }
        onMouseDown={()=>{
            handleMouseEvent("oscilloscope-navbar-btn", true)
        }}
        onMouseUp={()=>{
            handleMouseEvent("oscilloscope-navbar-btn", false)
        }}
        >
        _oscilloscope
        </button>
    </div>
  )
}

export default Navbar
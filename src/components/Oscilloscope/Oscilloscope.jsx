import { useEffect, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'

const Oscilloscope = () => {
    const { oscilloscopeRef, connectToOscilloscope } = useContext(ModularBusContext)
    useEffect(()=>{
        let oscilloscope = new Nexus.Oscilloscope("#oscilloscope", {
            'size': [500,225],
        })
        oscilloscope.colors.accent = "#000"
        oscilloscopeRef.current = oscilloscope
        connectToOscilloscope()
    // eslint-disable-next-line     
    },[])
  return (
    <div className="oscilloscopeContainer">
        <div id="oscilloscope"></div>
    </div>
  )
}

export default Oscilloscope
import { useEffect, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'

const Oscilloscope = () => {
    const { oscilloscopeRef, connectToOscilloscope } = useContext(ModularBusContext)
    useEffect(()=>{
        let oscilloscope = new Nexus.Oscilloscope("#oscilloscope", {
            'size': [300,150],
        })
        oscilloscope.colors.accent = "#000"
        oscilloscopeRef.current = oscilloscope
        connectToOscilloscope()
    },[])
  return (
    <div>
        <div id="oscilloscope"></div>
    </div>
  )
}

export default Oscilloscope
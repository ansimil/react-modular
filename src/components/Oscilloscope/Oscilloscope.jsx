import { useEffect, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'

const Oscilloscope = ({size, id}) => {
    const { oscilloscopeRef, connectToOscilloscope } = useContext(ModularBusContext)
    useEffect(()=>{
        let oscilloscope = new Nexus.Oscilloscope(`${id}#oscilloscope`, {
            'size': size,
        })
        oscilloscope.colors.accent = "#000"
        oscilloscopeRef.current = oscilloscope
        connectToOscilloscope()
    // eslint-disable-next-line     
    },[])
  return (
    <div className="oscilloscopeContainer">
        <div id={`${id}oscilloscope`}></div>
    </div>
  )
}

export default Oscilloscope
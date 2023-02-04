import { useContext, useState, useEffect } from 'react'
import { ACTIONS } from '../../contexts/ModularBusContext'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import Nexus from 'nexusui'

const Sequencer = () => {
  const { stateHook, sequencerRef } = useContext(ModularBusContext)
  const [appState, updateState] = stateHook


  useEffect(()=>{
    let sequencer = new Nexus.Sequencer('#sequencer')
    console.log(sequencer)
  },[])

  return (
    <div>
    <div id="sequencer"></div>
    </div>
  )
}

export default Sequencer
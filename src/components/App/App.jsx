import './App.css';
import { useRef, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext';
import Matrix from '../Matrix/Matrix';
import Keyboard from '../Keyboard/Keyboard';
import Oscilloscope from '../Oscilloscope/Oscilloscope';
import ControlBar from '../ControlBar/ControlBar';
import Sequencer from '../Sequencer/Sequencer';
import ModuleContainer from '../ModuleContainer/ModuleContainer';
import Navbar from '../Navbar/Navbar';
import ModuleComp from '../ModuleComp/ModuleComp';



function App() {
  const { oscillatorsArr, filtersArr, lfosArr, adsrArr, vcasArr, effectsArr } = useContext(ModularBusContext)
  let seqRef = useRef(null)
  let keysRef = useRef(null)
  let oscillatorsRef = useRef(null)
  let lfosRef = useRef(null)
  let filterRef = useRef(null)
  let envelopeRef = useRef(null)
  let vcaRef = useRef(null)
  let oscilloscopeRef = useRef(null)
  let matrixLocationRef = useRef(null)
  let effectsLocationRef = useRef(null)


  return (
    <div className="App">
      <ControlBar />
      <Navbar seqRef={seqRef} oscillatorsRef={oscillatorsRef} lfosRef={lfosRef} filterRef={filterRef} envelopeRef={envelopeRef} oscilloscopeRef={oscilloscopeRef} matrixLocationRef={matrixLocationRef} effectsLocationRef={effectsLocationRef} keysRef={keysRef} vcaRef={vcaRef}/>
      <Matrix matrixLocationRef={matrixLocationRef}/>   
      
      <ModuleContainer name={'_seq'} moduleClass={'seq'} locationRef={seqRef}>
        <Sequencer />
      </ModuleContainer>
      
      <ModuleContainer name={'_oscillators'} moduleClass={'oscillator'} locationRef={oscillatorsRef}>
        {oscillatorsArr.map((oscillator, i) => { 
          return (
            <ModuleComp key={oscillator.name} module={oscillator} i={i} /> 
          )
        })}
      </ModuleContainer>
    
      <ModuleContainer name={'_lfos'} moduleClass={'lfos'} locationRef={lfosRef}>
        {lfosArr.map((lfo, i) => {
          return (
            <ModuleComp key={lfo.name} module={lfo} i={i} /> 
          )
        })}
      </ModuleContainer>
      
      <ModuleContainer name={'_filters'} moduleClass={'filter'} locationRef={filterRef}>
        {filtersArr.map((filter, i) => {          
            return (
              <ModuleComp key={filter.name} module={filter} i={i} /> 
            )
          })}
      </ModuleContainer>
        
      <ModuleContainer name={'_envelopes'} moduleClass={'envelope'} locationRef={envelopeRef}>
      {adsrArr.map((adsr, i) => {          
            return (
              <ModuleComp key={adsr.name} module={adsr} i={i} /> 
            )
      })}
      </ModuleContainer>

      <ModuleContainer name={'vcas'} moduleClass={'vca'} locationRef={vcaRef}>
      {vcasArr.map((vca, i) => {          
            return (
              <ModuleComp key={vca.name} module={vca} i={i} /> 
            )
      })}
      </ModuleContainer>

      <ModuleContainer name={'_effects'} moduleClass={'effects'} locationRef={effectsLocationRef}>
        {/* <Reverb/> */}
      {effectsArr.map((effect, i) => {          
          return (
            <ModuleComp key={effect.name} module={effect} i={i} /> 
          )
       })}
      </ModuleContainer>
      
      <ModuleContainer name={'_oscilloscope'} moduleClass={'oscilloscope'} locationRef={oscilloscopeRef}>
        <Oscilloscope size={[500,225]} id={"large"} />
      </ModuleContainer>

      <ModuleContainer name={'_keys'} moduleClass={'keys'} locationRef={keysRef}>
       <Keyboard/>
      </ModuleContainer>
      
    </div>
  );
}

export default App;

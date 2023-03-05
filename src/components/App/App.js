import './App.css';
import { useRef, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext';
import Oscillator from '../Oscillator/Oscillator';
import Filter from '../Filter/Filter';
import { ADSR } from '../ADSR/ADSR';
import LFO from '../LFO/LFO'
import Matrix from '../Matrix/Matrix';
import Keyboard from '../Keyboard/Keyboard';
import Oscilloscope from '../Oscilloscope/Oscilloscope';
import ControlBar from '../ControlBar/ControlBar';
import Sequencer from '../Sequencer/Sequencer';
import ModuleContainer from '../ModuleContainer/ModuleContainer';
import Navbar from '../Navbar/Navbar';
import Reverb from '../Reverb/Reverb';
import ModuleComp from '../ModuleComp/ModuleComp';



function App() {
  const { oscillatorsArr } = useContext(ModularBusContext)
  let keysAndSeqRef = useRef(null)
  let oscillatorsRef = useRef(null)
  let lfosRef = useRef(null)
  let filterRef = useRef(null)
  let envelopeRef = useRef(null)
  let oscilloscopeRef = useRef(null)
  let matrixLocationRef = useRef(null)
  let effectsLocationRef = useRef(null)


  return (
    <div className="App">
      <ControlBar />
      <Navbar keysAndSeqRef={keysAndSeqRef} oscillatorsRef={oscillatorsRef} lfosRef={lfosRef} filterRef={filterRef} envelopeRef={envelopeRef} oscilloscopeRef={oscilloscopeRef} matrixLocationRef={matrixLocationRef} effectsLocationRef={effectsLocationRef}/>
      <Matrix matrixLocationRef={matrixLocationRef}/>   
      
      <ModuleContainer name={'_keys + _seq'} moduleClass={'keysAndSeq'} locationRef={keysAndSeqRef}>
        <Keyboard />
        <Sequencer />
      </ModuleContainer>
      
      <ModuleContainer name={'_oscillators'} moduleClass={'oscillators'} locationRef={oscillatorsRef}>
        <Oscillator oscNum={1}/>
        <Oscillator oscNum={2}/>
      </ModuleContainer>
      <ModuleContainer name={'oscillators2'} moduleClass={'oscillator'}>
        {oscillatorsArr.map(oscillator => {          
          return (
            <ModuleComp key={oscillator.name} module={oscillator}/> 
          )
        })}
      </ModuleContainer>
    
      <ModuleContainer name={'_lfos'} moduleClass={'lfos'} locationRef={lfosRef}>
        <LFO lfoNum={1} />
        <LFO lfoNum={2} />
      </ModuleContainer>

      <ModuleContainer name={'_filter'} moduleClass={'filter'} locationRef={filterRef}>
        <Filter />
      </ModuleContainer>
        
      <ModuleContainer name={'_envelope'} moduleClass={'envelope'} locationRef={envelopeRef}>
      <ADSR />
      </ModuleContainer>

      <ModuleContainer name={'_effects'} moduleClass={'effects'} locationRef={effectsLocationRef}>
        <Reverb/>
      </ModuleContainer>
      
      <ModuleContainer name={'_oscilloscope'} moduleClass={'oscilloscope'} locationRef={oscilloscopeRef}>
        <Oscilloscope size={[500,225]} id={"large"} />
      </ModuleContainer>
      
      
    </div>
  );
}

export default App;

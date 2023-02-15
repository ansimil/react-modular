import './App.css';
import Oscillator from '../Oscillator/Oscillator';
import Filter from '../Filter/Filter';
import { ADSR } from '../ADSR/ADSR';
import LFO from '../LFO/LFO'
import Matrix from '../Matrix/Matrix';
import Keyboard from '../Keyboard/Keyboard';
import Oscilloscope from '../Oscilloscope/Oscilloscope';
import ControlBar from '../ControlBar/ControlBar';
import Sequencer from '../Sequencer/Sequencer';
import ModuleContainer from '../OscillatorContainer/ModuleContainer';



function App() {
  return (
    <div className="App">
      <ControlBar />
      <Matrix/>   
      
      <ModuleContainer name={'_keys + _seq'} moduleClass={'keysAndSeq'}>
        <Keyboard />
        <Sequencer />
      </ModuleContainer>
      
      <ModuleContainer name={'_oscillators'} moduleClass={'oscillators'}>
        <Oscillator oscNum={1}/>
        <Oscillator oscNum={2}/>
      </ModuleContainer>
    
      <ModuleContainer name={'_lfos'} moduleClass={'lfos'}>
        <LFO lfoNum={1} />
        <LFO lfoNum={2} />
      </ModuleContainer>

      <ModuleContainer name={'_filter'} moduleClass={'filter'}>
        <Filter />
      </ModuleContainer>
        
      <ModuleContainer name={'_envelope'} moduleClass={'envelope'}>
      <ADSR />
      </ModuleContainer>
      
      <ModuleContainer name={'_oscilloscope'} moduleClass={'oscilloscope'}>
        <Oscilloscope size={[500,225]} id={"large"} />
      </ModuleContainer>
      
      
    </div>
  );
}

export default App;

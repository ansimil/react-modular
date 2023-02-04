import './App.css';
import Oscillator from './components/Oscillator/Oscillator';
import Filter from './components/Filter/Filter';
import { ADSR } from './components/ADSR/ADSR';
import LFO from './components/LFO/LFO'
import Matrix from './components/Matrix/Matrix';
import StartBtn from './components/StartBtn/StartBtn';
import Keyboard from './components/Keyboard/Keyboard';
import Oscilloscope from './components/Oscilloscope/Oscilloscope';
import Sequencer from './components/Sequencer/Sequencer';


function App() {

  return (
    <div className="App">
      <StartBtn />
      <Matrix/>
      <Oscillator oscNum={1} />
      <Oscillator oscNum={2} />
      <LFO lfoNum={1} />
      <LFO lfoNum={2} />
      <Filter />
      <ADSR />
      <Keyboard />
      <Oscilloscope />
      <Sequencer />
    </div>
  );
}

export default App;

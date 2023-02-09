import './App.css';
import Oscillator from '../Oscillator/Oscillator';
import Filter from '../Filter/Filter';
import { ADSR } from '../ADSR/ADSR';
import LFO from '../LFO/LFO'
// import Matrix from '../Matrix/Matrix';
import StartBtn from '../StartBtn/StartBtn';
import Keyboard from '../Keyboard/Keyboard';
import Oscilloscope from '../Oscilloscope/Oscilloscope';
// import Sequencer from '../Sequencer/Sequencer';



function App() {
  return (
    <div className="App">
      <StartBtn />
      <Matrix/>
      <Keyboard />
      <Oscillator oscNum={1} />
      {/* <Oscillator oscNum={2} /> */}
      <LFO lfoNum={1} />
      <LFO lfoNum={2} />
      <Filter />
      <ADSR />
      <Oscilloscope />
      <Sequencer />
    </div>
  );
}

export default App;

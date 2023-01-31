import './App.css';
import Oscillator from './components/Oscillator/Oscillator';
import Filter from './components/Filter/Filter';
import { ADSR } from './components/ADSR/ADSR';
import LFO from './components/LFO/LFO'
import Matrix from './components/Matrix/Matrix';
import { useContext } from 'react';
import { ModularBusContext } from './contexts/ModularBusContext';

function App() {
  const stateHook = useContext(ModularBusContext)
  console.log(stateHook)
  return (
    <div className="App">
      <Matrix/>
      <Oscillator oscNum={1} />
      <Oscillator oscNum={2} />
      <LFO lfoNum={1} />
      <LFO lfoNum={2} />
      <Filter />
      <ADSR />
    </div>
  );
}

export default App;

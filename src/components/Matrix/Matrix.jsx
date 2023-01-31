import { useContext } from 'react'
import { Sequencer } from 'react-nexusui'
import { ModularBusContext } from '../../contexts/ModularBusContext'

const Matrix = () => {
    const { sequencerRef} = useContext(ModularBusContext)

    const change = e => {
        console.log(e)
    }

  return (
    <div className='matrixContainer'>
    <div className="horizontalLabels">
        <div className="horizontalLabel">O1</div>
        <div className="horizontalLabel">O3</div>
        <div className="horizontalLabel">t</div>
        <div className="horizontalLabel">t</div>
        <div className="horizontalLabel">t</div>
        <div className="horizontalLabel">t</div> 
    </div>
    <div className="matrixInner">
    <div className='verticalLabels'>
        <div className="verticalLabel">t</div>
        <div className="verticalLabel">t</div>
        <div className="verticalLabel">t</div>
        <div className="verticalLabel">t</div>
        <div className="verticalLabel">t</div>
        <div className="verticalLabel">t</div>
    </div>
    <Sequencer
        size={[200, 150]}
        rows={6}
        columns={6}
        onChange={change}
        onReady={sequencer => {
            sequencer.colors.accent = "#000"
            sequencer.element.id = "matrix"
            sequencer.type = 'Matrix'
            sequencer.mode = 'toggle'
            sequencerRef.current = sequencer  
        }}
    />
    {/* <button 
    onClick={() => {
        sequencerRef.current.interval.rate = 100;
        console.log(sequencerRef.current.start())
        }}
        >
        click
        </button> */}
    </div>
    </div>
  )
}

export default Matrix
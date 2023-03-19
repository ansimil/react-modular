import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'
import './TrackAssignmentComp.css'

const TrackAssignmentComp = ({sequencerRef}) => {
    const { stateHook, oscillatorsArr, adsrArr } = useContext(ModularBusContext)
    const [, updateState] = stateHook

    const change = (e, i, trackIdx) => {
        const { value, id } = e.target
        updateState({type: ACTIONS.SEQUENCER.assignNoteGate, payload: {value, id, i: trackIdx } })
    }

  return (
    <div className="track-assignment-container">
    {sequencerRef.current.map((track, i) => {
        let trackIdx = i
        return (
            <div key={`TRACK${i+1}`} className="track-assignments">
                <p className='seq-settings-label'>{`TRACK${i+1}`}</p>
                <div className="note-selector-options">
                    <p>NOTE:</p>
                    {oscillatorsArr.map((osc, i) => {
                        return (
                            <div key={`${osc.name}note`}>
                            <label htmlFor="note">{(osc.name).toUpperCase()}</label>
                            <input 
                            onChange={(e)=>{
                                change(e, i+1, trackIdx+1)
                            }}
                            type="radio" 
                            id="note" 
                            name={`note${i+1}`} 
                            value={(osc.name)} 
                            defaultChecked={trackIdx === i ? true: false}/>
                            </div>   
                        )  
                    })
                    }
                </div>
                <div className="gate-selector-options">
                    <p>GATE:</p>
                    {adsrArr.map((adsr, i) => {
                        return (
                            <div key={`${adsr.name}gate`}>
                            <label htmlFor="gate">{(adsr.name).toUpperCase()}</label>
                            <input 
                            onChange={(e)=>{
                                change(e, i+1, trackIdx+1)
                            }}
                            type="radio" 
                            id="gate" 
                            name={`gate${i+1}`} 
                            value={(adsr.name)} 
                            defaultChecked={trackIdx === i ? true: false}/>
                            </div>   
                        )
                        })
                        }
                </div>
            </div>
        )
    })}
    </div>
  )
}

export default TrackAssignmentComp
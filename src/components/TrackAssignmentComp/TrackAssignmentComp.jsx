import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import SelectorBtn from '../SelectorBtn/SelectorBtn'
import { ACTIONS } from '../../utils/ACTIONS'
import './TrackAssignmentComp.css'

const TrackAssignmentComp = ({sequencerRef}) => {
    const { stateHook, oscillatorsArr, adsrArr } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook

    const change = (e, toChange, trackIdx) => {
        const { id } = e.target
        updateState({type: ACTIONS.SEQUENCER.assignNoteGate, payload: {id: toChange, value: id, i: trackIdx } })
    }

  return (
    <div className="track-assignment-container">
    {sequencerRef.current.map((track, i) => {
        let trackIdx = i+1
        return (
            <div key={`TRACK${i+1}`} className="track-assignments">
                <p className='seq-settings-label'>{`TRACK${i+1}`}</p>
                <div className='track-notes-gates-selectors'>
                    <div className="note-selector-options">
                        <p className='seq-settings-label'>NOTE</p>
                        {oscillatorsArr.map((osc, i) => {
                            let activeType
                            appState.sequencerSettings.tracks[`track${trackIdx}`].assignedNotes.forEach(note => {
                                if (note === osc.name){
                                    activeType = osc.name
                                }
                            })
                            return (
                                <div className='note-selector-btns' key={`${osc.name}note`}>
                                    <SelectorBtn label={osc.name} change={change} id={osc.name} toChange={"note"} i={trackIdx} activeType={activeType} />
                                </div>   
                            )  
                        })
                        }
                    </div>
                    <div className="gate-selector-options">
                        <p className='seq-settings-label'>GATE</p>
                        {adsrArr.map((adsr, i) => {
                            let activeType
                            appState.sequencerSettings.tracks[`track${trackIdx}`].assignedGates.forEach(gate => {
                                if (gate === adsr.name){
                                    activeType = adsr.name
                                }
                            })
                            return (
                                <div className='gate-selector-btns' key={`${adsr.name}gate`}>
                                    <SelectorBtn label={adsr.name} change={change} id={adsr.name} toChange={"gate"} i={trackIdx} activeType={activeType} />
                                </div>   
                            )
                            })
                            }
                    </div>
                </div>
            </div>
        )
    })}
    </div>
  )
}

export default TrackAssignmentComp
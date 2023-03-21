import { useContext } from "react"
import { ModularBusContext } from "../../contexts/ModularBusContext"
import './ShowTrackNotes.css'

const ShowTrackNotes = ({changeCurrentTrack, loadTrackSliders, currentTrack}) => {
    const { stateHook } = useContext(ModularBusContext)
    const [ appState ] = stateHook

  return (
    <div className='showtracknotes-container'>
        <p className="seq-settings-label">SHOW NOTES</p>
        {Object.keys(appState.sequencerSettings.tracks).map((track, i) => {
            return (
                <div key={`tracknote${i+1}`} className="showtracknotes-btn-container">
                    <button
                    className={Number(appState.sequencerSettings.currentTrack) === i+1 ? "btn selector-btn activeBtn" : "btn selector-btn"}
                    id={i+1}
                    onClick={(e) => {
                    changeCurrentTrack(e)
                    loadTrackSliders(e)
                    }}
                    >
                    {`Track ${i+1}`}
                    </button>
                </div>
            )
        })
        }
    </div>
  )
}

export default ShowTrackNotes
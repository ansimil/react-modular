import { useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext'
import { ACTIONS } from '../../utils/ACTIONS'

const RandomizeNotes = ({seqSlidersRef}) => {
    // const [scale, setScale] = useState("all")
    const { stateHook } = useContext(ModularBusContext)
    const [appState, updateState] = stateHook
    const { sequencerSettings } = appState

    const notesMapper = {
        "all": [0,1,2,3,4,5,6,7,8,9,10,11],
        "major": [0,2,4,5,7,9,11],
        "minor": [0,2,3,5,7,8,10]
    }
    const noteOffset = {
        "c": 0,
        "c#": 1,
        "d": 2,
        "d#": 3,
        "e": 4,
        "f": 5,
        "f#": 6,
        "g": 7,
        "g#": 8,
        "a": 9,
        "a#": 10,
        "b": 11
    }
    const randArr = []

    const setRoot = (root) => {
        updateState({type: ACTIONS.SEQUENCER.randomNotes.root, payload: {id: root}})
    }

    const pickNotes = (scale) => {
        seqSlidersRef.current.forEach(()=>{
            randArr.push(Math.floor(Math.random() * notesMapper[scale].length))
        })

        return scale  
    }

    const setSliders = (scale) => {
        randArr.forEach((value, i) => {
            let finalNote = notesMapper[scale][value] + noteOffset[sequencerSettings.randomNotes.root]
            if (finalNote > 11) {
                finalNote = finalNote - 12
            }
            seqSlidersRef.current[i].setSlider(0, finalNote)
            seqSlidersRef.current[i].render()
            updateState({type: ACTIONS.SEQUENCER.randomNotes.notes, payload: {value: finalNote, id: i}})
        })
    }

    const changeScale = (scaleToChangeTo) => {
        updateState({type: ACTIONS.SEQUENCER.randomNotes.scale, payload: {id: scaleToChangeTo}})
    }

  return (
    <div className="randomize-notes-container sequencer-settings-medium">
        <div className="seq-settings-label-div">
            <p className="seq-settings-label">RANDOMIZE NOTES</p>
        </div>
        <div className='randomize-notes-inner'>
        <div className='scale-btns'>
            <button 
            className={sequencerSettings.randomNotes.scale === "all" ? "btn activeBtn selector-btn" : "btn selector-btn"}
            onClick={() => {
                changeScale("all")
            }}>
            all
            </button>
            <button 
            className={sequencerSettings.randomNotes.scale === "major" ? "btn activeBtn selector-btn" : "btn selector-btn"}
            onClick={()=>{
                changeScale("major")
            }}>
            major
            </button>
            <button 
            className={sequencerSettings.randomNotes.scale === "minor" ? "btn activeBtn selector-btn" : "btn selector-btn"}
            onClick={()=>{
                changeScale("minor")
            }}>
            minor
            </button>
        </div>
        <div className="root-btns">
        {Object.keys(noteOffset).map((note, i) => {
            return (
                <button 
                onClick={()=>{
                    setRoot(note)
                }}
                key={i}
                className={sequencerSettings.randomNotes.root === note ? "btn activeBtn selector-btn root-note-btn" : "btn selector-btn root-note-btn"}
                >
                {note.toUpperCase()}
                </button>
            )
        })}
        </div>
        <button
        className="btn endBtnLeft endBtnRight set-random-notes"
        onClick={()=>{
            let scale = pickNotes(sequencerSettings.randomNotes.scale)
            setSliders(scale)
        }}
        >
            APPLY
        </button>
    </div>
    </div>
  )
}

export default RandomizeNotes
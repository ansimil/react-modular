import { useEffect, useState, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext';
import Rodal from 'rodal';
import { useForm } from 'react-hook-form'
import './PresetsModal.css'
import { ACTIONS } from '../../utils/ACTIONS';
import toast from 'react-hot-toast'
import { handleMouseEvent } from '../../services/general.services';

const PresetsModal = ({ showSaveModal, setShowSaveModal, setCurrentPatch } ) => {
    const [ savedPatches, setSavedPatches ] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const { register, handleSubmit, reset } = useForm()
    const { register: register2, handleSubmit: handleLoadSubmit } = useForm()
    const { register: register3, handleSubmit: handleOverwriteSubmit } = useForm()
    const { register: register4, handleSubmit: handleDeleteSubmit } = useForm()
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook

    const PresetOptions = ({ presetSection, registerId }) => {
        return (
            <select 
            name={presetSection} 
            id={presetSection}
            {...registerId(presetSection)}
            >
                <option value="" selected disabled hidden>-- select a patch --</option>
                    {savedPatches && savedPatches.map((patch, i) => {
                        return (
                            <option 
                            key={`#presetOption${i+1} ${presetSection}`}
                            value={Object.keys(patch)}
                            >
                            {Object.keys(patch)}
                            </option>
                        )
                    })}  
            </select>
        )
    }

    const handleSaveNewPreset = async (e) => {
        const existingPresets = await JSON.parse(localStorage.getItem("savedPatches"))
        let matchingPreset
        if (e.newPresetName.length === 0) {
            setErrorMessage("Preset name cannot be empty") 
            return
        }
        else {
            if (existingPresets) {
                existingPresets.forEach(preset => {
                    if (Object.keys(preset)[0] === e.newPresetName) {
                        setErrorMessage("Preset name already exists, please choose a different name") 
                        matchingPreset = true 
                    }
                    else {
                        setErrorMessage("") 
                        matchingPreset = false
                    }
                })
            }
           
            if (!matchingPreset){
                await localStorage.setItem("presetToLoad", e.newPresetName)
                await updateState({type: ACTIONS.SYNTH.saveNewPreset, payload: {value: e.newPresetName}})
                getSavedPatches()
                setCurrentPatch(e.newPresetName)
                reset()
                setShowSaveModal(!showSaveModal)
                toast.success(`'${e.newPresetName}' has been successfully saved`, {
                    style: {
                        marginTop: "5rem",
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        fontFamily: "mainFont"
                    },
                  })
            }
        }
        
        
    }

    const handleLoadPreset = (e) => {
        localStorage.setItem("presetToLoad", e.loadPreset)
        window.location.reload(false)
        
    }

    const handleOverwritePreset = async (e) => {
        if (!e.overwritePreset){
            toast.error(`No patch selected. Please select the patch you wish to overwrite`, {
                style: {
                    marginTop: "5rem",
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    fontFamily: "mainFont",
                    zIndex: "20000"
                },
            })
            return
        }
        await localStorage.setItem("presetToLoad", e.overwritePreset)
        await updateState({type: ACTIONS.SYNTH.overwritePreset, payload: {value: e.overwritePreset}})
        setShowSaveModal(!showSaveModal)
        toast.success(`'${e.overwritePreset}' has been successfully saved`, {
            style: {
                marginTop: "5rem",
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontFamily: "mainFont"
            },
        })
        getSavedPatches()
    }

    const handleDeletePreset = async (e) => {
        await localStorage.setItem("presetToLoad", "")
        await updateState({type: ACTIONS.SYNTH.deletePreset, payload: {value: e.deletePreset}})
        setCurrentPatch("")
        setShowSaveModal(!showSaveModal)
        toast.success(`'${e.deletePreset}' has been successfully deleted`, {
            style: {
                marginTop: "5rem",
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontFamily: "mainFont"
            },
        })  
        getSavedPatches()
    }

    const getSavedPatches = async () => {
        const patches = await JSON.parse(localStorage.getItem("savedPatches"))
        setSavedPatches(patches)
    }

    useEffect(()=>{
        getSavedPatches()
    },[])

  return (
    <Rodal
    onClose={()=>{setShowSaveModal(!showSaveModal)}}
    visible={showSaveModal}
    width={600}
    height={450}
    animation={"slideDown"}
    customStyles={{
            "backgroundColor": "rgb(57, 57, 57)"
    }}
    >               
        <div className='presets-modal-container'>
            <div className='save-presets-container'>
                <div className='new-preset-container'>
                <label className='sliderLabel save-new-patch-label' htmlFor="saveNewPreset">Save New Patch</label>
                    <form action="saveNewPreset">
                    {errorMessage && <p className="preset-error-message">{errorMessage}</p>}
                        <input
                        placeholder='enter patch name' 
                        type="text" 
                        id="presetName" 
                        {...register("newPresetName")}
                        />
                        <button 
                        className='btn save-preset-btn'
                        type="submit"
                        onClick={handleSubmit(handleSaveNewPreset)}
                        onMouseDown={
                            () => handleMouseEvent(`save-preset-btn`, true)
                        }
                        onMouseUp={
                            () => handleMouseEvent(`save-preset-btn`, false)
                        }
                        >
                        Save patch
                        </button>
                    </form>
                    
                </div>
                <div className='existing-preset-container'>
                    <label className='sliderLabel save-new-patch-label' htmlFor="overwritePresets">Overwrite Patch</label>
                    <form action="submit">
                        <PresetOptions presetSection={"overwritePreset"} registerId={register3}/>
                        <button 
                        className='btn overwrite-preset-btn'
                        type="submit"
                        onClick={handleOverwriteSubmit(handleOverwritePreset)}
                        onMouseDown={
                            () => handleMouseEvent(`overwrite-preset-btn`, true)
                        }
                        onMouseUp={
                            () => handleMouseEvent(`overwrite-preset-btn`, false)
                        }
                        >
                        Overwrite Patch
                        </button>
                    </form>
                </div>
            </div>
            <div className='load-delete-presets-container'>
                <div className='load-presets-container'>
                    <form
                    action="submit"
                    >
                        <label className='sliderLabel save-new-patch-label' htmlFor="loadPresets">Load Patch</label>
                        <PresetOptions presetSection={"loadPreset"} registerId={register2}/>
                        <button 
                        className='btn load-preset-btn'
                        type="submit"
                        onClick={handleLoadSubmit(handleLoadPreset)}
                        onMouseDown={
                            () => handleMouseEvent(`load-preset-btn`, true)
                        }
                        onMouseUp={
                            () => handleMouseEvent(`load-preset-btn`, false)
                        }
                        >
                        Load patch
                        </button>
                    </form>
                </div>
                
                <div className='delete-presets-container'>
                <form
                    action="submit"
                    >
                        <label className='sliderLabel save-new-patch-label' htmlFor="deletePreset">Delete Patch</label>
                        <PresetOptions presetSection={"deletePreset"} registerId={register4}/>
                        <button 
                        className='btn delete-preset-btn'
                        type="submit"
                        onClick={handleDeleteSubmit(handleDeletePreset)}
                        onMouseDown={
                            () => handleMouseEvent(`delete-preset-btn`, true)
                        }
                        onMouseUp={
                            () => handleMouseEvent(`delete-preset-btn`, false)
                        }
                        >
                        Delete patch
                        </button>
                    </form>
                </div>
            </div>
            
        </div>
    </Rodal>
  )
}

export default PresetsModal
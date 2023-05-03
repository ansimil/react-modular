import { useEffect, useState, useContext } from 'react'
import { ModularBusContext } from '../../contexts/ModularBusContext';
import Rodal from 'rodal';
import { useForm } from 'react-hook-form'
import './PresetsModal.css'
import { ACTIONS } from '../../utils/ACTIONS';

const PresetsModal = ({ showSaveModal, setShowSaveModal, setCurrentPatch } ) => {
    const [ savedPatches, setSavedPatches ] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const { register, handleSubmit, reset } = useForm()
    const { register: register2, handleSubmit: handleLoadSubmit } = useForm()
    const { register: register3, handleSubmit: handleOverwriteSubmit } = useForm()
    const { stateHook } = useContext(ModularBusContext)
    const [ , updateState ] = stateHook

    const handleSaveNewPreset = async (e) => {
        const existingPresets = await JSON.parse(localStorage.getItem("savedPatches"))
        let matchingPreset
        if (existingPresets) {
            existingPresets.forEach(preset => {
                if (Object.keys(preset)[0] === e.newPresetName) {
                    setErrorMessage("Preset name already exists, please choose a different name") 
                    matchingPreset = true 
                }
            })
        }
       
        if (!matchingPreset){
            await localStorage.setItem("presetToLoad", e.newPresetName)
            await updateState({type: ACTIONS.SYNTH.saveNewPreset, payload: {value: e.newPresetName}})
            getSavedPatches()
            setCurrentPatch(e.newPresetName)
            reset()
        }
        
    }

    const handleLoadPreset = (e) => {
        localStorage.setItem("presetToLoad", e.loadPreset)
        window.location.reload(false)
        
    }

    const handleOverwritePreset = async (e) => {
        console.log(e)
        await localStorage.setItem("presetToLoad", e.overwritePreset)
        await updateState({type: ACTIONS.SYNTH.overwritePreset, payload: {value: e.overwritePreset}})
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
                <label htmlFor="saveNewPreset">Save New Patch</label>
                    <form action="saveNewPreset">
                    {errorMessage && <p>{errorMessage}</p>}
                        <input 
                        type="text" 
                        id="presetName" 
                        {...register("newPresetName")}
                        />
                        <button 
                        className='btn'
                        type="submit"
                        onClick={handleSubmit(handleSaveNewPreset)}
                        >
                        Save patch
                        </button>
                    </form>
                    
                </div>
                <div className='existing-preset-container'>
                    <label htmlFor="overwritePresets">Overwrite Patch</label>
                    <form action="submit">
                        <select 
                        name="overwritePreset" 
                        id="overwritePreset"
                        {...register3('overwritePreset')}
                        >
                        <option value="select a patch" selected disabled hidden>-- select a patch --</option>
                            {savedPatches && savedPatches.map((patch, i) => {
                                return (
                                    <option
                                    key={`#overwritePresetOption${i+1}`}
                                    value={Object.keys(patch)}
                                    >
                                    {Object.keys(patch)}
                                    </option>
                                )
                            })}  
                        </select>
                        <button 
                        className='btn'
                        type="submit"
                        onClick={handleOverwriteSubmit(handleOverwritePreset)}
                        >
                        Overwrite Patch
                        </button>
                    </form>
                </div>
            </div>
            <div className='load-presets-container'>
                <form
                onSubmit={(e)=> handleLoadPreset(e)} 
                action="submit"
                >
                    <label htmlFor="loadPresets">Load Patch</label>
                    <select 
                    name="loadPresets" 
                    id="loadPresets"
                    {...register2('loadPreset')}
                    >
                    <option value="" selected disabled hidden>-- select a patch --</option>
                        {savedPatches && savedPatches.map((patch, i) => {
                            return (
                                <option 
                                key={`#presetOption${i+1}`}
                                value={Object.keys(patch)}
                                >
                                {Object.keys(patch)}
                                </option>
                            )
                        })}  
                    </select>
                    <button 
                    className='btn'
                    type="submit"
                    onClick={handleLoadSubmit(handleLoadPreset)}
                    >
                    Load patch
                    </button>
                </form>
            </div>
        </div>
    </Rodal>
  )
}

export default PresetsModal
import React from 'react'
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import './HelpModal.css'

const HelpModal = ({showModal, setShowModal}) => {
  return (
    
        <Rodal 
        visible={showModal} 
        onClose={()=>{setShowModal(!showModal)}}
        width={"600"}
        height={"400"}
        animation={"slideDown"}
        customStyles={{
            "background-color": "rgb(57, 57, 57)"
        }}
        >
            <div className="modalContainer">
                <h2>How to use the synth</h2>
                <h3>Turn on the synth</h3>
                <p>In the top left corner there is an on/off switch. Simply switch the synth on</p>
                <h3>Playing the synth</h3>
                <p>You can play the synth with your computer keyboard. The corresponding keys are:<br/><br/>a,w,s,e,d,f,t,g,y,h,u,j,k</p>
            </div>
        </Rodal>
    
  )
}

export default HelpModal
import React from 'react'
import Rodal from 'rodal';
import StartBtn from '../StartBtn/StartBtn'
import 'rodal/lib/rodal.css';
import './HelpModal.css'

const HelpModal = ({showModal, setShowModal}) => {
  return (
    
        <Rodal 
        visible={showModal} 
        onClose={()=>{setShowModal(!showModal)}}
        width={800}
        height={600}
        animation={"slideDown"}
        customStyles={{
            "backgroundColor": "rgb(57, 57, 57)"
        }}
        >
            <div className="modalContainer">
                <h2>How to use the synth</h2>
                <h3>Turn the synth on</h3>
                <p>(click on here)</p>
                <StartBtn/>
                <h3>Connection Matrix</h3>
                <p>At the top of the synth is a connection matrix. This allows you to connect the individual modules together as you please. It will be loaded with some initial connections that allow you to play the synth straight away.
                <br/><br/>
                Feel free to play around with the connections to get a sound you like.
                <br/><br/>
                </p>
                <h3>Playing the synth</h3>
                <p>You can play the synth with your computer keyboard. The corresponding keys are:<br/><br/>a,w,s,e,d,f,t,g,y,h,u,j,k
                <br/><br/>
                To switch octaves you can use: up: "." down: ","
                </p>
            </div>
        </Rodal>
    
  )
}

export default HelpModal
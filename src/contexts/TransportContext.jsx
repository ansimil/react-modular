import { createContext, useState } from "react";

const TransportContext = createContext()

const TransportContextWrapper = (props) => {
    const [transportState, setTransportState] = useState({
        player: "stopped",
        synthState: {
            start: false,
            startCount: 0,
        }
    })
    return (
        <TransportContext.Provider value={{ transportState, setTransportState }}>
            {props.children}
        </TransportContext.Provider>
    )
}

export {
    TransportContext,
    TransportContextWrapper
}
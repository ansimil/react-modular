import { createContext } from "react";

const ModularBusContext = createContext()

function ModularBus (props) {

    return (
        <ModularBusContext.Provider>
        {props.children}
        </ModularBusContext.Provider>

    )

}

export { ModularBusContext, ModularBus }
const handleMouseEvent = (classname, down) => {
    const el = document.getElementsByClassName(classname)
        if (down) {
            el[0].classList.add("activeBtn")
        }
        else {
            el[0].classList.remove("activeBtn") 
        }
}

const setModuleInitialState = (modulesArr) => {
    let modules = {}
    modulesArr.forEach(module => {
        modules = {...modules, [module.name]: module.initialState}
    })
    return modules
}


export {
    handleMouseEvent,
    setModuleInitialState
}
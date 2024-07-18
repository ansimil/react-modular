const makeModule = (Module, moduleArr, additionalSetting) => {
    let module
    if (additionalSetting) {
        module = new Module(`osc${moduleArr.length+1}`, additionalSetting)
    }
    else {
        module = new Module(`osc${moduleArr.length+1}`) 
    }
    moduleArr.push(module)
    return module
}

const addModules = (modulesArr, moduleArr) => {
    modulesArr.push(moduleArr)
}

export {
    makeModule,
    addModules
}
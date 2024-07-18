const makeModule = (Module, moduleArr, name, additionalSetting) => {
    let module
    if (additionalSetting) {
        module = new Module(`${name}${moduleArr.length+1}`, additionalSetting)
    }
    else {
        module = new Module(`${name}${moduleArr.length+1}`) 
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
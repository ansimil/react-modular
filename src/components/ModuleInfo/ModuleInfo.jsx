import React from 'react'

const ModuleInfo = ({moduleName}) => {
  return (
    <div className="module-info-container">
        <div className="module-info-inner">
            <p>{moduleName}</p>
        </div>  
    </div>
  )
}

export default ModuleInfo
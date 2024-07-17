import './ModuleContainer.css'

const ModuleContainer = ({children, name, moduleClass, locationRef}) => {
  return (
    <details ref={locationRef} open className={`${moduleClass} details-container`}>
        <summary className="summary-container">
            <div className="summary-inner">
                <p className="module-type">{name}</p> 
            </div>
        </summary>
        <div className="details-inner">
        {children}
        </div>
    </details>
  )
}

export default ModuleContainer
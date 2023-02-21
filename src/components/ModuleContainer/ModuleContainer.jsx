import './ModuleContainer.css'

const ModuleContainer = ({children, name, moduleClass, locationRef}) => {

  return (
    <details ref={locationRef} open className={`${moduleClass} detailsContainer`}>
        <summary className="summaryContainer">
            <div className="summaryInner">
                <p className="containerName">{name}</p> 
            </div>
        </summary>
        <div className="detailsInner">
        {children}
        </div>
    </details>
  )
}

export default ModuleContainer
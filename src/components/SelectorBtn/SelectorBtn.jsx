
const SelectorBtn = ({label, id, type, change, activeType, name, toChange, i}) => {
  return (
    <button
    key={id} 
    id={id}
    className={activeType === id ? "btn btn-dark selector-btn btn-active": "btn btn-dark selector-btn"}
    onClick={(e)=>{
        change(e, toChange, i)
    }}
    >
    {label}
    </button>
  )
}

export default SelectorBtn
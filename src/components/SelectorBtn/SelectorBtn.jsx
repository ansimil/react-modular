import React from 'react'

const SelectorBtn = ({label, id, type, change, activeType, name, toChange}) => {
  return (
    <button
    key={id} 
    id={id}
    className={activeType === id ? "btn selector-btn activeBtn": "btn selector-btn"}
    onClick={(e)=>{
        change(e, toChange, name)
    }}
    >
    {label}
    </button>
  )
}

export default SelectorBtn
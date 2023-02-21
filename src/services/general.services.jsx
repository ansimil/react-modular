const handleMouseEvent = (classname, down) => {
    let el = document.getElementsByClassName(classname)
        if (down) {
            el[0].classList.add("activeBtn")
        }
        else {
            el[0].classList.remove("activeBtn") 
        }
}

export {
    handleMouseEvent
}
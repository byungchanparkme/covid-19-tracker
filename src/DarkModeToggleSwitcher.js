import React, { useEffect } from "react"
import "./DarkModeToggleSwitcher.css"

function DarkModeToggleSwitcher({ isChecked, setIsChecked }) {
  const onCheck = () => {
    setIsChecked(!isChecked)
  }
  return (
    <>
      <label htmlFor="switch">
        <input type="checkbox" id="switch" checked={isChecked} onClick={onCheck} />
        <div className="toggle"></div>
        <div className="names">
          <p className="light">Light</p>
          <p className="dark">Dark</p>
        </div>
      </label>
    </>
  )
}

export default DarkModeToggleSwitcher

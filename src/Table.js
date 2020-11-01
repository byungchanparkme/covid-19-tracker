import React from "react"
import "./Table.css"

function Table({ countries }) {
  return (
    <div className="table">
      {/* 현재 요소인 country가 객체이므로 구조분해 할당 문법을 이용하여 
      country, cases에 손쉽게 접근가능하다. */}
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  )
}

export default Table

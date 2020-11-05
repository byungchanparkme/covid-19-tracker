import React from "react"
import numeral from "numeral"
import { Circle, Popup } from "react-leaflet"

// 각각의 case에 따라 지도에 표시되는 툴팁 설정
const casesTypeColors = {
  cases: {
    hex: "#0033cc",
    multiplier: 800,
  },
  recovered: {
    hex: "#008000",
    multiplier: 1200,
  },
  deaths: {
    hex: "#cc3300",
    multiplier: 2000,
  },
}

export const sortData = (data) => {
  const sortedData = [...data]

  // 내림차순으로 정렬한다. 큰 요소에서 작은 요소 순서로
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1
    } else {
      return 1
    }
  })
  // sortedData.sort((a, b) => b.cases - a.cases)
  // sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1)

  return sortedData
}

// InfoBox에서 매일 늘어나는 각 case들의 수의 형식 설정
export const prettyPrintStat = (stat) => (stat ? `+${numeral(stat).format("0.0a")}` : "+0")

// function ChangeCircleColor({ casesType }) {
//   const map = useMap()
//   window.circle.setStyle({ color: casesTypeColors[casesType].hex, fillColor: casesTypeColors[casesType].hex })
//   return null
// }

// draw circles on the map with interactive tooltip
export const ShowDataOnMap = ({ countries, casesType }) => {
  return (
    <>
      {countries.map((country) => (
        <Circle
          center={[country.countryInfo.lat, country.countryInfo.long]}
          fillOpacity={0.4}
          color={casesTypeColors[casesType].hex}
          fillColor={casesTypeColors[casesType].hex}
          // 각 케이스의 숫자가 달라짐에 따라 원의 크기 설정
          radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        >
          <Popup>
            <div className="info-container">
              <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
              <div className="info-name">{country.country}</div>
              <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
              <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
              <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  )
}

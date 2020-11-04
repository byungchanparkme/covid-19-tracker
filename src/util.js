import React from "react"
import numeral from "numeral"
import { Circle, Popup } from "react-leaflet"

// 각각의 case에 따라 지도에 표시되는 툴팁 설정
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    // size of circle
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
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

// draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
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
  ))

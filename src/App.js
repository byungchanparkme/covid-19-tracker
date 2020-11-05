import React, { useEffect, useState } from "react"
import { FormControl, MenuItem, Select, Card, CardContent } from "@material-ui/core"
import "./App.css"
import InfoBox from "./InfoBox"
import Map from "./Map"
import Table from "./Table"
import { sortData } from "./util"
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css"

const App = () => {
  // state는 리액트에서 변수를 작성하는 방법이다.
  // 다음과 같은 형태로 작성한다.
  const [countries, setCountries] = useState(["USA", "Korea", "India"])
  // dropdown menu에서 우리가 선택한 countryCode를 저장하는 변수이다.
  const [country, setCountry] = useState("")
  // 각 나라에 대한 코로나 데이터를 저장하는 변수이다.
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  // 지도에 설정할 중심부를 가리킨다. 위도와 경도 값을 필요로 한다.
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796])
  // 지도가 어느 정도의 확대 비율로 보일 것인가를 의미한다.
  const [mapZoom, setMapZoom] = useState(3)
  // 각 나라에 대한 정보를 저장하고 있다.
  const [mapCountries, setMapCountries] = useState([])
  // 각 infoBox를 클릭했을 때 각 case를 식별하기 위해 이를 저장해둔다.
  const [casesType, setCasesType] = useState("cases")

  // default Setting
  // 처음에 App 컴포넌트가 화면에 렌더링될 때 전체 나라에 대한 코로나 데이터를 가져와서 status box들에 반영한다.
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])

  // useEffect : Runs a piece of code based on a given condition
  useEffect(() => {
    // if useEffect function's second argument array is empty,
    // the code inside here will run once
    // when the component loads and not again

    // async -> send a request, wait for it, do something with response
    // 전세계 나라들의 정보를 데이터로 받아온다.
    // https://disease.sh/v3/covid-19/countries
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        // 응답 데이터를 json으로 변환한다.
        .then((response) => response.json())
        .then((data) => {
          // api 호출을 통해 응답으로 받은 데이터 중에서 내가 필요한 데이터만 사용한다.
          // map 메소드를 사용하여 내가 필요한 데이터만 가지는 객체들의 집합(배열) 생성.
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2, // UK, USA, FR
          }))

          // 이렇게 응답받고 정제한 데이터를 countries state에 저장한다.
          setCountries(countries)

          // table에 필요한 data들은 각 요소의 cases를 비교하여 내림차순으로 정렬한다.
          const sortedData = sortData(data)
          // 내림차순으로 정렬된 table data들을 tableData state에 저장한다.
          setTableData(sortedData)
          // 모든 나라별 데이터를 전부 저장한다.
          setMapCountries(data)
        })
    }

    getCountriesData()
  }, [])

  // dropdown 메뉴의 onChange 이벤트(옵션을 클릭하는 행위에 의해 발생)에 따른 핸들러 함수
  const onCountryChange = async (event) => {
    // dropdown 메뉴에서 내가 클릭한 MenuItem의 value 값을 저장하고 있는 변수이다.
    const countryCode = event.target.value

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // 내가 클릭한 옵션이 무엇인지 리액트가 알도록 state에 저장.
        setCountry(countryCode)

        // All of the data...
        // from the country response
        setCountryInfo(data)

        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })

    // Worldwide를 선택했을 때는
    // https://disease.sh/v3/covid-19/all
    // 이 url로 요청을 보내서 세계 전체에 대한 데이터를 받아온다.

    // 이외에 다른 나라들을 선택했을 때는
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    // 각 나라의 country_code를 넣어서 각 나라에 대한 데이터를 받아온다.
  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          {/* className을 명명하는 방식 : BEM */}
          {/* Dropdown Menu */}
          <FormControl className="app__dropdown">
            {/* value 값의 변화에 따라 화면에 보여지는 드롭다운 메뉴의 값이 내가 클릭한 값으로 바뀐다. */}
            <Select labelId="countries" variant="outlined" value="worldwide" value={country} onChange={onCountryChange}>
              {/* default Option */}
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {/* Loop through all the countries and show a drop down list of the options */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* InfoBox컴포넌트에게 props로 title, cases, total 데이터를 전달해준다. */}
          <InfoBox isBlue={casesType === "cases"} onClick={(e) => setCasesType("cases")} title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox isGreen={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox isRed={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3 className="table__title">Live Cases by Country</h3>
          <Table countries={tableData} />
          {/* Table */}
          <h3 className="graph__title">Worldwide Past 4 Months Status</h3>
          {/* Graph */}
          <LineGraph cases={casesType} />
        </CardContent>
      </Card>
    </div>
  )
}

export default App

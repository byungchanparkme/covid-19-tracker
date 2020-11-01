import React, { useEffect, useState } from "react"
import { FormControl, MenuItem, Select } from "@material-ui/core"
import "./App.css"

const App = () => {
  // state는 리액트에서 변수를 작성하는 방법이다.
  // 다음과 같은 형태로 작성한다.
  const [countries, setCountries] = useState(["USA", "Korea", "India"])
  const [country, setCountry] = useState("")
  // https://disease.sh/v3/covid-19/countries

  // useEffect : Runs a piece of code based on a given condition
  useEffect(() => {
    // if useEffect function's second argument array is empty,
    // the code inside here will run once
    // when the component loads and not again

    // async -> send a request, wait for it, do something with response
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
          // 이렇게 응답받고 정제한 데이터를 countries 변수에 저장한다.
          setCountries(countries)
        })
    }

    getCountriesData()
  }, [])

  // dropdown 메뉴의 onChange 이벤트(옵션을 클릭하는 행위에 의해 발생)에 따른 핸들러 함수
  const onCountryChange = (event) => {
    const countryCode = event.target.value
    // 내가 클릭한 옵션이 무엇인지 리액트가 알도록 state에 저장.
    setCountry(countryCode)
  }
  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID 19 TRACKER</h1>
        {/* className을 명명하는 방식 : BEM */}
        {/* Dropdown Menu */}
        <FormControl className="app__dropdown">
          {/* value 값의 변화에 따라 화면에 보여지는 드롭다운 메뉴의 값이 내가 클릭한 값으로 바뀐다. */}
          <Select variant="outlined" value="worldwide" value={country} onChange={onCountryChange}>
            {/* default Option */}
            <MenuItem value="worldwide">WorldWide</MenuItem>
            {/* Loop through all the countries and show a drop down list of the options */}
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Header */}
      {/* Title + Select input dropdown filed */}

      {/* InfoBox */}
      {/* InfoBox */}
      {/* InfoBox */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  )
}

export default App

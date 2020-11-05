import React, { useEffect, useState, useRef } from "react"
import { Line } from "react-chartjs-2"
import numeral from "numeral"

import "./LineGraph.css"

function LineGraph({ cases }) {
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  const [bgColor, setBgColor] = useState("#144a90")

  // 주어진 데이터에는 크게 3가지의 케이스가 있다.
  const buildChartData = (data, casesType = "cases") => {
    const chartData = []
    let lastDataPoint

    // date는 9/22/20의 형태
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        // data.cases 안에 들어있는 cases의 수는 이제까지 누적된 숫자이기 때문에
        // 각 날짜별로 cases 수를 알기 위해서는 따로 처리해줘야 한다.
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        }
        chartData.push(newDataPoint)
      }
      lastDataPoint = data[casesType][date]
    }
    return chartData
  }

  const buildLabelData = (data) => {
    const labelData = []

    for (let date in data["cases"]) {
      labelData.push(date)
    }

    return labelData
  }

  const options = {
    legend: {
      display: false, // label 숨기기
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false, // false로 설정 시 사용자 정의 크기에 따라 그래프 크기가 결정됨.
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        // tooltip의 데이터 형식 설정
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0.0")
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          // 그리드 라인들을 제거한다.
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            // y축의 데이터 형식 설정
            callback: function (value, index, values) {
              return numeral(value).format("0a")
            },
          },
        },
      ],
    },
  }

  const changeChartLineColor = () => {
    if (cases === "recovered") {
      setBgColor("#008c48")
    } else if (cases === "deaths") {
      setBgColor("#d81f26")
    } else if (cases === "cases") {
      setBgColor("#185aa9")
    }
  }

  // https://disease.sh/v3/
  // covid-19/historical/all?lastdays=120

  useEffect(() => {
    // 데이터를 fetching할 때는 async await을 이용한다.
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChartData(data, cases)
          // cases, recovered, deaths의 데이터를 그래프의 데이터에 들어갈 수 있도록 조작하여 data state에 저장한다.
          setData(chartData)

          const labelData = buildLabelData(data)
          setLabels(labelData)
        })
    }
    fetchData()
    // infoBox 클릭에 따라 cases가 변하는데 각 case마다 차트에서 색깔이 달라진다.
    changeChartLineColor()
  }, [cases])

  return (
    <div className="graph-container">
      {/* optional chaining */}
      {/* data?.length > 0 => data && data.length > 0과 같은 의미이다. */}
      {data?.length > 0 && (
        <Line
          data={{
            labels: labels,
            datasets: [
              {
                backgroundColor: bgColor,
                data: data,
                fill: true,
              },
            ],
          }}
          options={options}
          height={200}
        />
      )}
    </div>
  )
}

export default LineGraph

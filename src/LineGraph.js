import React, { useEffect, useState, useRef } from "react"
import { Line, defaults } from "react-chartjs-2"
import numeral from "numeral"

import "./LineGraph.css"

function LineGraph() {
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  const chartRef = useRef(null)

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

  // 각 legend를 클릭하면 그 legend의 데이터만 그래프에 나타난다. 나머지 legend의 데이터들은 사라진다.
  const onLegendClick = function (e, legendItem) {
    // index는 내가 클릭한 legend의 index 번호이다.
    var index = legendItem.datasetIndex
    var ci = this.chart
    const length = ci.data.datasets.length

    for (let i = 0; i < length; i++) {
      ci.data.datasets[i].hidden = index === i ? null : true
    }

    ci.update()
  }

  const options = {
    legend: {
      display: true, // label 숨기기
      position: "bottom",
      onClick: onLegendClick,
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

  // https://disease.sh/v3/
  // covid-19/historical/all?lastdays=120

  useEffect(() => {
    // 데이터를 fetching할 때는 async await을 이용한다.
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          // cases, recovered, deaths의 데이터를 그래프의 데이터에 들어갈 수 있도록 조작하여 data state에 저장한다.
          Object.keys(data).forEach((situation) => {
            let chartData = buildChartData(data, situation)
            setData((data) => [...data, chartData])
          })

          const labelData = buildLabelData(data)
          setLabels(labelData)
        })
    }
    fetchData()

    console.log(chartRef.current)
  }, [])

  return (
    <div className="graph-container">
      {/* optional chaining */}
      {/* data?.length > 0 => data && data.length > 0과 같은 의미이다. */}
      {data?.length > 0 && (
        <Line
          ref={chartRef}
          data={{
            labels: labels,
            datasets: [
              {
                label: "cases",
                backgroundColor: "#0040ff",
                borderColor: "#0033cc",
                data: data[0],
                fill: false,
              },
              {
                label: "recovered",
                backgroundColor: "#00cc00",
                borderColor: "#009900",
                data: data[2],
                fill: false,
              },
              {
                label: "deaths",
                backgroundColor: "#ff4000",
                borderColor: "#cc3300",
                data: data[1],
                fill: false,
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

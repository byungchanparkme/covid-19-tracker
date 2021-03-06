import React from "react"
import { Card, CardContent, Typography } from "@material-ui/core"
import numeral from "numeral"
import "./InfoBox.css"
import { prettyPrintStat } from "./util"

// props를 구조분해를 이용하여 가져올 수 있다.
function InfoBox({ title, cases, total, onClick, isBlue, isRed, isGreen }) {
  return (
    // -- => change of state
    <Card className={`infoBox ${isBlue && "infoBox--blue"} ${isGreen && "infoBox--green"} ${isRed && "infoBox--red"}`} onClick={onClick}>
      <CardContent>
        {/* Title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* +120k Number of cases */}
        <h2 className="infoBox__cases">{prettyPrintStat(cases)}</h2>

        {/* 1.2M Total */}
        <Typography className="infoBox__total" color="textSecondary">
          {numeral(total).format("0,0")} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox

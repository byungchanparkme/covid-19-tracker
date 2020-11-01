import React from "react"
import { Card, CardContent, Typography } from "@material-ui/core"

// props를 구조분해를 이용하여 가져올 수 있다.
function InfoBox({ title, cases, total }) {
  return (
    <Card className="infoBox">
      <CardContent>
        {/* Title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        {/* +120k Number of cases */}
        <h2 className="infoBox__cases">{cases}</h2>

        {/* 1.2M Total */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox

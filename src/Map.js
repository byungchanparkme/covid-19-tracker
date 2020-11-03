import React from "react"
import "./Map.css"
import { MapContainer, TileLayer } from "react-leaflet"

function Map({ center, zoom }) {
  console.log(center)
  console.log(zoom)
  return (
    <div className="map">
      {/* center는 지도의 초기 상태에서의 중심을 의미하고, zoom은 어느 정도의 비율로 확대되어 있는지를 의미한다. */}
      <MapContainer center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
      </MapContainer>
    </div>
  )
}

export default Map

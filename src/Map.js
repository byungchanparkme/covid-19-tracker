import React from "react"
import "./Map.css"
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet"

// 어떤 event가 일어나서 center를 옮길 경우 MapContainer 하위에 있는 Map 인스턴스를 이용한다.
function ChangeCenter({ center, zoom }) {
  const map = useMap()
  // map 인스턴스의 panTo 메서드는 변한 center 값으로 지도의 center를 이동시켜준다.
  map.panTo(center)
  map.setZoom(zoom)
  return null
}

function Map({ center, zoom }) {
  return (
    <div className="map">
      {/* center는 지도의 초기 상태에서의 중심을 의미하고, zoom은 어느 정도의 비율로 확대되어 있는지를 의미한다. */}
      {/* center와 zoom attribute는 처음에 설정하고 난 이후 값이 바뀐다 하더라도 초기 상태값을 유지한다. */}
      <LeafletMap center={center} zoom={zoom}>
        <ChangeCenter center={center} zoom={zoom} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
      </LeafletMap>
    </div>
  )
}

export default Map

import React from "react";
import L from "leaflet";
import borderData from "./bordervt";
import { relative } from "path";

const style = {
  height: "600px",
  width: "600px",
  margin: "auto 0",
  display: relative,
  marginTop: "30px",
};
let startingMarker;
class Map extends React.Component {
  componentDidMount() {
    // create map
    this.map = L.map("map", {
      //Start on Burlington Code Academy
      center: [43.7990718,-72.6002608],
      zoom: 7,
      // maxZoom: 18,
      // minZoom: 5,
      layers: [
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          }
        )
      ]
    });

    //Only using the VT border as a visual aid for the user
    this.borderData = L.geoJSON(borderData, { fillColor: "none" });
    this.borderData.addTo(this.map);

    //County data layer is now in the index.js
    this.props.countyLayer.addTo(this.map);

    // *************Disable these for testing****************
    // this.map.zoomControl.remove();
    // this.map.scrollWheelZoom.disable();
    // this.map.touchZoom.disable();
    // this.map.dragging.disable();
    // this.map.keyboard.disable();
    // *****************************************************

  }

  //the new markerPosition gets passed in and compared to the old marker position in this.props.markerPosition
  componentDidUpdate() {
    // check if position has changed
    this.map.setZoom(this.props.zoomLevel);
    // if (this.props.markerPosition !== markerPosition) {
      this.map.panTo(this.props.markerPosition);
    // }
    if(this.props.gameOver){
      this.startingMarker = L.marker(this.props.startPosition).addTo(this.map);
    }

    if((this.startingMarker !== undefined) && this.props.gameStarted){
      this.map.removeLayer(this.startingMarker);
    }
    
    (this.props.gameStarted ? this.borderData.setStyle({color: 'none'}) : this.borderData.setStyle({color: '#3388FF'}))
  }

  render() {
    return <div id="map" style={style} />;
  }
}

export default Map;

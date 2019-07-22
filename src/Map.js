import React from "react";
import L from "leaflet";
import borderData from "./bordervt"

const style = {
  height: "500px",
  width: "500px",
  margin: "auto 0"
};

class Map extends React.Component {

  componentDidMount() {
    // create map
    this.map = L.map("map", {
      center: [this.props.startPosition.lat, this.props.startPosition.lon],
      zoom: 18,
      // maxZoom: 18,
      // minZoom: 18, 
      layers: [
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          }
        ), 
      ]
    });

    // add marker
    this.marker = L.marker(this.props.markerPosition).addTo(this.map);

    this.borderData = L.geoJSON(borderData);
    this.borderData.addTo(this.map);

    //County data is now in the index.js
    this.props.countyLayer.addTo(this.map);
  
    //
    
    
    // this.map.zoomControl.remove();
    // this.map.scrollWheelZoom.disable();
    // this.map.touchZoom.disable();
    // this.map.dragging.disable();
    // this.map.keyboard.disable();
  }
  
  //the new markerPosition gets passed in and compared to the old marker position in this.props.markerPosition
  componentDidUpdate({ markerPosition, startPosition }) {
    // check if position has changed
    this.map.panTo(this.props.startPosition);
    if (this.props.markerPosition !== markerPosition) {
      this.marker.setLatLng(this.props.markerPosition);
      this.map.panTo(this.props.markerPosition);

      // const result = leafletPip.pointInLayer([startPosition.lon, startPosition.lat], this.countyData);
      // (result.length > 0) ? console.log(result[0].feature.properties.CNTYNAME) : console.log('result array is empty');
    }
  }
  
  render() {
    
    return <div id="map" style={style} />;
  }
}

 

export default Map;

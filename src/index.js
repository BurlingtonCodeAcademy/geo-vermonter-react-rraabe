import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map.js";
import countyMap from "./assets/county-map.jpg";
import countyData from "./border";
import leafletPip from "@mapbox/leaflet-pip";
import L from "leaflet";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.countyLayer = this.makeCountyLayer();
    this.startPosition = this.pickRandomLatLon();
    this.state = {
      markerPosition: this.startPosition,
      score: 1000,
      gameStarted: false,
      startingCounty: null,
      //guessedCounty passed from dropdown
    };
    this.moveNorth = this.moveNorth.bind(this);
    this.moveEast = this.moveEast.bind(this);
    this.moveSouth = this.moveSouth.bind(this);
    this.moveWest = this.moveWest.bind(this);
    this.pickRandomLatLon = this.pickRandomLatLon.bind(this);
    this.makeCountyLayer = this.makeCountyLayer.bind(this);
    this.checkStart = this.checkStart.bind(this);
    
  }
  
  makeCountyLayer() {
    let countyLayer = L.geoJSON(countyData);
    return countyLayer;
  }

  pickRandomLatLon() {
    let { lat, lon } = {lat: 0, lon: 0};
    while ((this.checkStart({lat, lon})).length<1) {
      console.log('in the while')
      lat = Math.random() * (45.04 - 42.7) + 42.7;
      lon = -1 * (Math.random() * (73.5 - 71.4) + 71.4);
      this.checkStart({ lon: lon, lat: lat });
    }
    
    return { lat: lat, lon: lon };
  }

  checkStart(point) {
    let startingPoint = leafletPip.pointInLayer([point.lon, point.lat], this.countyLayer);
    if(startingPoint.length>0)
    {
      console.log(startingPoint[0].feature.properties.CNTYNAME);
    }
    return startingPoint;
  }

  moveNorth() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat + 0.0001,
        lon: lon
      },
      score: this.state.score - 10
    });
  }

  moveEast() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat,
        lon: lon + 0.0001
      },
      score: this.state.score - 10
    });
  }

  moveSouth() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat - 0.0001,
        lon: lon
      },
      score: this.state.score - 10
    });
  }

  moveWest() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat,
        lon: lon - 0.0001
      },
      score: this.state.score - 10
    });
  }
  componentDidMount(){
    let countyArrayObj = leafletPip.pointInLayer([this.startPosition.lon, this.startPosition.lat], this.countyLayer);
    console.log(countyArrayObj[0].feature.properties.CNTYNAME);
    this.setState({
      startingCounty: countyArrayObj[0].feature.properties.CNTYNAME
    });
  }
  render() {
    const { markerPosition } = this.state;

    // const { startPosition } = this.state;
      return (
        <div>
          <Nav />
          <div className="horizontal-flex-box">
            <div className="vertical-flex-box">
              <button className="nav-button" onClick={this.moveNorth}>
                <i class="fas fa-chevron-up" />
              </button>
              <button className="nav-button" onClick={this.moveEast}>
                <i class="fas fa-chevron-right" />
              </button>
              <button className="nav-button" onClick={this.moveSouth}>
                <i class="fas fa-chevron-down" />
              </button>
              <button className="nav-button" onClick={this.moveWest}>
                <i class="fas fa-chevron-left" />
              </button>
              <Map
                markerPosition={markerPosition}
                startPosition={this.startPosition}
                pickRandomLatLon={this.pickRandomLatLon}
                countyLayer={this.countyLayer}
              />
              <InfoBox />
            </div>
            <img id="county-map" src={countyMap} alt="Vermont Counties Map" />
          </div>
          <div id="button-row">
            <button id="start-button" onClick={this.pickRandomLatLon  }>
              Start
            </button>
            <button id="one-button">One</button>
            <button id="two-button">Two</button>
            <button id="three-button">Three</button>
          </div>
          <div>You're score is: {this.state.score}</div>
        </div>
      );
    
  }
}

const Nav = props => {
  return <div id="navbar">Nav Element</div>;
};

const InfoBox = props => {
  //Needs fields for latitude, long, county, and town
  return <h1>Info Element</h1>;
};

ReactDOM.render(<App />, document.getElementById("root"));

import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map.js";
import countyMap from './assets/county-map.jpg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startPosition: { lat: 44.4759406, lon: -73.2123868 },
      markerPosition: { lat: 44.477272, lon: -73.2123868 }
    };
    this.moveNorth = this.moveNorth.bind(this);
    this.moveEast = this.moveEast.bind(this);
    this.moveSouth= this.moveSouth.bind(this);
    this.moveWest = this.moveWest.bind(this);

  }

  moveNorth() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat + 0.0003,
        lon: lon
      }
    });
  }
  
  moveEast() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat,
        lon: lon + 0.0001
      }
    });
  }
  
  moveSouth() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat - 0.0001,
        lon: lon
      }
    });
  }
  
  moveWest() {
    const { lat, lon } = this.state.markerPosition;
    this.setState({
      markerPosition: {
        lat: lat,
        lon: lon - 0.0001
      }
    });
  }
  
  

  render() {
    const { markerPosition } = this.state;
    const { startPosition } = this.state;

    return (
      <div>
        <Nav />
        <div className="horizontal-flex-box">
          <div className="vertical-flex-box">
            <button className="nav-button" onClick={this.moveNorth}><i class="fas fa-chevron-up"></i></button>
            <button className="nav-button" onClick={this.moveEast}><i class="fas fa-chevron-right"></i></button>
            <button className="nav-button" onClick={this.moveSouth}><i class="fas fa-chevron-down"></i></button>
            <button className="nav-button" onClick={this.moveWest}><i class="fas fa-chevron-left"></i></button>
            <Map
              markerPosition={markerPosition}
              startPosition={startPosition}
            />
            <InfoBox />
          </div>
          <img id="county-map" src={countyMap} alt="Vermont Counties Map"></img>
        </div>
        <div id="button-row">
        <Button />
        <Button />
        <Button />
        <Button />
        </div>
        <Score />
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
const Button = props => {
  //Many buttons:
  //Move N, S, E, W
  //Start, guess, quit
  return <button>A Button</button>;
};
const Score = props => {
  return <h1>Score</h1>;
};

ReactDOM.render(<App />, document.getElementById("root"));

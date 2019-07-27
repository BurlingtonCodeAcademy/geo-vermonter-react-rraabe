import React from "react";
import ReactDOM from "react-dom";
import Map from "./Map.js";
import countyMap from "./assets/county-map.jpg";
import countyData from "./border";
import leafletPip from "@mapbox/leaflet-pip";
import L from "leaflet";
import { ReactComponent as UpArrow } from "./assets/arrow-up.svg";
import { ReactComponent as RightArrow } from "./assets/arrow-right.svg";
import { ReactComponent as DownArrow } from "./assets/arrow-down.svg";
import { ReactComponent as LeftArrow } from "./assets/arrow-left.svg";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.countyLayer = this.makeCountyLayer();
    this.state = {
      startPosition: { lat: 0, lon: 0 },
      markerPosition: { lat: 0, lon: 0 },
      score: 100,
      gameStarted: false,
      startingCounty: null,
      gameOver: false,
      guess: "",
      readyToGuess: false,
      gameOverText: null,
      gaveUp: false,
      town: null, 
      zoomLevel: 7,
      //To do: Add an array of previous movements (as object with lat and lon) for history and breadcrumbs
    };

    this.pickRandomLatLon = this.pickRandomLatLon.bind(this);
    this.makeCountyLayer = this.makeCountyLayer.bind(this);
    this.checkStart = this.checkStart.bind(this);
    this.move = this.move.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showGuessForm = this.showGuessForm.bind(this);
    this.giveUp = this.giveUp.bind(this);
    this.setTown = this.setTown.bind(this);
  }

  makeCountyLayer() {
    let countyLayer = L.geoJSON(countyData, {
      fillColor: "none",
      color: "none"
    });
    return countyLayer;
  }

  pickRandomLatLon() {
    let { lat, lon } = { lat: 0, lon: 0 };
    while (this.checkStart({ lat, lon }).length < 1) {
      lat = Math.random() * (45.04 - 42.7) + 42.7;
      lon = -1 * (Math.random() * (73.5 - 71.4) + 71.4);
      this.checkStart({ lon: lon, lat: lat });
    }
    let countyArrayObj = leafletPip.pointInLayer([lon, lat], this.countyLayer);
    this.setTown(lat, lon);
    let upperCaseCounty = countyArrayObj[0].feature.properties.CNTYNAME;
    let county =
      upperCaseCounty.charAt(0) + upperCaseCounty.toLowerCase().slice(1);
    this.setState({
      startingCounty: county,
      markerPosition: { lat: lat, lon: lon },
      startPosition: { lat: lat, lon: lon }
    });
    return { lat: lat, lon: lon };
  }

  setTown(lat, lon) {
    fetch(
      `https://nominatim.openstreetmap.org/reverse.php?format=html&lat=${lat}&lon=${lon}&zoom=12&format=json`
    )
      .then(request => request.json())
      .then(json => {
        let town = json.address.city;
        this.setState({
          town: town
        });
      });
  }

  checkStart(point) {
    let startingPoint = leafletPip.pointInLayer(
      [point.lon, point.lat],
      this.countyLayer
    );
    if (startingPoint.length > 0) {
    }
    return startingPoint;
  }

  startGame = e => {
    this.pickRandomLatLon();
    this.setState({
      gameStarted: !this.state.gameStarted,
      gameOver: false,
      readyToGuess: false,
      gameOverText: null, 
      zoomLevel: 18,
    });
    e.target.disabled = true;
    this.countyLayer.setStyle({color: 'none'})
  };

  handleChange(event) {
    this.setState({
      guess: event.target.value
    });
  }
  giveUp() {
    this.setState({
      gameOver: true,
      gameStarted: false,
      gaveUp: true,
      score: 0, 
      zoomLevel: 7,
    });
    this.countyLayer.setStyle({color: '#3388FF'});
  }

  handleSubmit(event) {
    document.getElementById("submit-button").disabled = true;
    document.getElementById("guess-field").disabled = true;
    event.preventDefault();
    if (this.state.guess.toUpperCase() === this.state.startingCounty) {
      this.setState({
        gameOverText: "won",
      });
    } else {
      this.setState({
        score: 0,
        gameOverText: "lost",
      });
    }
      this.setState({
        gameOver: true,
        gameStarted: false,
        zoomLevel: 7
      })
      this.countyLayer.setStyle({color: '#3388FF'});
  }

  showGuessForm() {
    this.setState({
      readyToGuess: true
    });
  }

  move = direction => {
    let { lat, lon } = this.state.markerPosition;
    let moveAmount = 0.00135;
    if (direction === "north") {
      lat += moveAmount;
    } else if (direction === "south") {
      lat -= moveAmount;
    } else if (direction === "east") {
      lon += moveAmount;
    } else if (direction === "west") {
      lon -= moveAmount;
    } else {
      //Treating this a pseudo-catch
      alert(`Error: ${direction} was given to the move function`);
    }
    this.setState({
      markerPosition: {
        lat: lat,
        lon: lon
      },
      score: this.state.score - 1
    });
  };

  //Currently not using but leaving in for future improvements and refactoring
  componentDidMount() {}
  render() {
    //Change the game messages to be components when refactoring. Ran out of time.
    return (
      <div>
        <Nav />
        <div className="horizontal-flex-box">
          <div className="vertical-flex-box">
            <Map
              markerPosition={this.state.markerPosition}
              startPosition={this.state.startPosition}
              pickRandomLatLon={this.pickRandomLatLon}
              countyLayer={this.countyLayer}
              zoomLevel={this.state.zoomLevel}
              gameOver={this.state.gameOver}
              gameStarted={this.state.gameStarted}
            />

            <MoveButtons
              gameStarted={this.state.gameStarted}
              move={this.move}
            />

            <InfoBox
              markerPosition={this.state.markerPosition}
              gameOver={this.state.gameOver}
              startingCounty={this.state.startingCounty}
              town={this.state.town}
            />
          </div>
          <img id="county-map" src={countyMap} alt="Vermont Counties Map" />
        </div>
        <GameButtons
          gameStarted={this.state.gameStarted}
          startGame={this.startGame}
          showGuessForm={this.showGuessForm}
          giveUp={this.giveUp}
        />
        <GuessForm
          readyToGuess={this.state.readyToGuess}
          guess={this.state.guess}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />

        {this.state.gameOver && (
          <div>
            You're score: {this.state.gameOver ? this.state.score : "???"}
          </div>
        )}
        {this.state.gameOverText === "won" && <h3>You guessed correctly!</h3>}
        {this.state.gameOverText === "lost" && (
          <h3>
            Sorry you guessed {this.state.guess} but you were in{" "}
            {this.state.startingCounty}.
          </h3>
        )}
        {this.state.gaveUp && (
          <h3>No worries. You were in {this.state.startingCounty}. Try again!</h3>
        )}
      </div>
    );
  }
}
const MoveButtons = props => {
  if (props.gameStarted) {
    return (
      <div id="button-wrapper">
        <button
          id="north-button"
          className="nav-button"
          onClick={() => props.move("north")}
        >
          <UpArrow />
        </button>
        <button
          id="east-button"
          className="nav-button"
          onClick={() => props.move("east")}
        >
          <RightArrow />
        </button>
        <button
          id="south-button"
          className="nav-button"
          onClick={() => props.move("south")}
        >
          <DownArrow />
        </button>
        <button
          id="west-button"
          className="nav-button"
          onClick={() => props.move("west")}
        >
          <LeftArrow />
        </button>
      </div>
    );
  } else {
    return (
      <div id="button-wrapper">
        <button
          id="north-button"
          className="nav-button"
          onClick={() => props.move("north")}
          disabled
        >
          <UpArrow />
        </button>
        <button
          id="east-button"
          className="nav-button"
          onClick={() => props.move("east")}
          disabled
        >
          <RightArrow />
        </button>
        <button
          id="south-button"
          className="nav-button"
          onClick={() => props.move("south")}
          disabled
        >
          <DownArrow />
        </button>
        <button
          id="west-button"
          className="nav-button"
          onClick={() => props.move("west")}
          disabled
        >
          <LeftArrow />
        </button>
      </div>
    );
  }
};

const GameButtons = props => {
  if (props.gameStarted) {
    return (
      <div id="button-row">
        <button disabled id="start-button">
          Start
        </button>
        <button id="guess-button" onClick={props.showGuessForm}>
          Guess!
        </button>
        <button id="quit-button" onClick={props.giveUp}>
          Give up
        </button>
      </div>
    );
  } else {
    return (
      <div id="button-row">
        <button id="start-button" onClick={props.startGame}>
          Start
        </button>
        <button disabled id="guess-button">
          Guess!
        </button>
        <button disabled id="quit-button">
          Give up
        </button>
      </div>
    );
  }
};

//Add to the NavBar
const Nav = props => {
  return <div id="navbar">Geo-Vermonter</div>;
};

const InfoBox = props => {
  if (props.gameOver) {
    return (
      <div id="info-wrapper">
        <h3 id="info-lat">Lat: {props.markerPosition.lat.toFixed(3)} </h3>
        <h3 id="info-lon">Lon: {props.markerPosition.lon.toFixed(3)}</h3>
        <h3 id="info-county">County: {props.startingCounty}</h3>
        <h3 id="info-town">Town: {props.town}</h3>
      </div>
    );
  } else {
    return (
      <div id="info-wrapper">
        <h3 id="info-lat">Lat: ??? </h3>
        <h3 id="info-lon">Lon: ???</h3>
        <h3 id="info-county">County: ???</h3>
        <h3 id="info-town">Town: ???</h3>
      </div>
    );
  }
};

const GuessForm = props => {
  if (props.readyToGuess) {
    return (
      /* <form onSubmit={props.handleSubmit}>
        <label>
          Which county did you start in:
          <input
            id="guess-field"
            type="text"
            value={props.guess}
            onChange={props.handleChange}
          />
        </label>
        <input id="submit-button" type="submit" value="Submit" />
      </form> */
      <div id="county-list">
        <button>Chittenden</button>
      </div>
    );
  } else {
    return null;
  }
};

ReactDOM.render(<App />, document.getElementById("root"));

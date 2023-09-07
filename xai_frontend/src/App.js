import React, { useEffect, useState } from "react";

//JavaScript Library für HTTP-Anfragen
import axios from "axios";

// Wochenansicht
import WeekView from "./components/WeekView";

// Navigationsleiste NavBar
import Navbar from "./components/Navbar.js";

//App.css Stylesheet
import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import FAQ from "./components/FAQ.js"; // Erstelle die FAQ-Komponente

// Hauptfunktionskomponente App
function App() {
  const [anzahl, setAnzahl] = useState(0);
  const [gesamtanzahl, setGesamtanzahl] = useState(0);

  const generateRandomNumber = () => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        setAnzahl(response.data.anzahl);
        setGesamtanzahl((prevGesamtanzahl) => prevGesamtanzahl + 1); // Hier wird die Gesamtanzahl erhöht
      })
      .catch((error) => {
        console.error("Es gab einen Fehler beim Abrufen der Daten: ", error);
      });
  };

  useEffect(() => {
    setGesamtanzahl(0);
    generateRandomNumber();
  }, []);

  return (
    <div className="App">
  <Router>
    <Navbar />

    <Switch>
      <Route path="/faq">
        <FAQ /> {/* Verweise auf die FAQ-Seitenkomponente */}
      </Route>
      <Route path="/">
        {/* Deine Startseite (Aktuelle Implementierung) */}
        {/* Wenn keine Route übereinstimmt, wird dies angezeigt */}
        <h1 className="custom-h1">Zufallszahl (1 - 100): {anzahl}</h1>
        <h1 className="custom-h1">
          Gesamtanzahl generierter Zufallszahlen: {gesamtanzahl}
        </h1>
        <button
          onClick={generateRandomNumber}
          className="btn btn-primary btn-sm float-start"
        >
          Neue Zufallszahl generieren
        </button>
        <WeekView />
      </Route>
    </Switch>
  </Router>
</div>);
}

/*     <div className="App">
      <Navbar />

      <h1 className="custom-h1">Zufallszahl (1 - 100): {anzahl}</h1>
      <h1 className="custom-h1">
        Gesamtanzahl generierter Zufallszahlen: {gesamtanzahl}
      </h1>
      <button
        onClick={generateRandomNumber}
        className="btn btn-primary btn-sm float-start"
      >
        Neue Zufallszahl generieren
      </button>

      <WeekView />
    </div> */



//Die App-Komponente wird exportiert, damit sie in anderen Dateien verwendet werden kann.
export default App;


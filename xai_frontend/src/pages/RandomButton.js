//React Libraries
import React, { useEffect, useState } from "react";
import axios from "axios";


export default function RandomButton() {
  const [anzahl, setAnzahl] = useState(0);
  const [gesamtanzahl, setGesamtanzahl] = useState(0);

  const generateRandomNumber = () => {
    axios
      .get("http://localhost:5000/randomButton")
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
    <div>
      <h1>Random Button page</h1>

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
    </div>
  );
}
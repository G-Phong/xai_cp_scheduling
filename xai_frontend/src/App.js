import React, { useEffect, useState } from 'react';

//JavaScript Library für HTTP-Anfragen
import axios from 'axios'; 

// TODO: Passe den Pfad entsprechend an
import WeekView from './WeekView'; 

// Hauptfunktionskomponente App
function App() {
  const [anzahl, setAnzahl] = useState(0);
  const [gesamtanzahl, setGesamtanzahl] = useState(0);

  const generateRandomNumber = () => {
    axios.get('http://localhost:5000/')
      .then(response => {
        setAnzahl(response.data.anzahl);
        setGesamtanzahl(prevGesamtanzahl => prevGesamtanzahl + 1); // Hier wird die Gesamtanzahl erhöht
      })
      .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Daten: ", error);
      });
  };

  useEffect(() => {
    setGesamtanzahl(0);
    generateRandomNumber();
  }, []);
 

  return (
    /*
    Hier wird der JSX-Code (JavaScript XML -> Syntaxerweirtung für die Erstellung
      von UI-Komponenen)
     zurückgegeben, der in der Anwendung gerendert wird.
     Der angezeigte Text enthält die Anzahl der Lösungen,
      die aus dem Zustand anzahl abgerufen wird.
    */
      <div className="App">
      <h1>Zufallszahl (1 - 100): {anzahl}</h1>
      <h2>Gesamtanzahl generierter Zufallszahlen: {gesamtanzahl}</h2>
      <button onClick={generateRandomNumber}>Neue Zufallszahl generieren</button>
      <WeekView /> {/* TODO: Füge hier die WeekView-Komponente ein */}
      </div>
  );
}


//Die App-Komponente wird exportiert, damit sie in anderen Dateien verwendet werden kann.
export default App; 
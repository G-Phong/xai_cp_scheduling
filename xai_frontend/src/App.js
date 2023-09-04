import React, { useEffect, useState } from 'react';

//JavaScript Library für HTTP-Anfragen
import axios from 'axios'; 

// TODO: Passe den Pfad entsprechend an
import WeekView from './WeekView'; 

// Hauptfunktionskomponente App
function App() {
  const [anzahl, setAnzahl] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(response => {
        setAnzahl(response.data.anzahl); //Hier wird die empfangene Anzahl der Lösungen aus dem response-Objekt in den Zustand anzahl gespeichert. Die Daten sind in response.data.anzahl enthalten.
      })
      .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Daten: ", error);
      });
  }, []);

  return (
    /*
    Hier wird der JSX-Code (JavaScript XML -> Syntaxerweirtung für die Erstellung
      von UI-Komponenen)
     zurückgegeben, der in der Anwendung gerendert wird.
     Der angezeigte Text enthält die Anzahl der Lösungen,
      die aus dem Zustand anzahl abgerufen wird.
    */
    <div>
      <h1>Anzahl der Lösungen (zufallsgeneriert): {anzahl}</h1>
      <WeekView /> {/* TODO: Füge hier die WeekView-Komponente ein */}
    </div>
  );
}


//Die App-Komponente wird exportiert, damit sie in anderen Dateien verwendet werden kann.
export default App; 
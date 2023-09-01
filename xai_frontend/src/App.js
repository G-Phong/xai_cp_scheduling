import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [anzahl, setAnzahl] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/anzahlLoesungen')
      .then(response => {
        setAnzahl(response.data.anzahl);
      })
      .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Daten: ", error);
      });
  }, []);

  return (
    <div>
      <h1>Anzahl der Lösungen: {anzahl}</h1>
    </div>
  );
}

export default App;

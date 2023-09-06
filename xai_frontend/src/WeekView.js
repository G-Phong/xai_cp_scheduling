import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeekView.css'; // CSS Stylesheet

function WeekView() {
  const [shiftPlanData, setShiftPlanData] = useState([]);


 /* Eine "Hook" ist in React eine Funktion, die es funktionalen Komponenten ermöglicht,
  Zustand (wie useState), Nebeneffekte (wie useEffect), Kontext und andere React-Funktionen zu nutzen,
   ohne dass eine Klasse erforderlich ist. 
*/
  useEffect(() => { //Lambda Funktion / Pfeilfunktion
    axios.get('http://localhost:5000/schedule') // Passe die URL entsprechend an
      .then(response => {
        setShiftPlanData(response.data);
      })
      .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Schichtplandaten: ", error);
      });
  }, []);

/// Hier wird der JSX-Code zurückgegeben, der gerendert wird, wenn die Komponente aufgerufen wird.
// Eine Tabelle wird erstellt, in der die Schichtplan-Daten aus shiftPlanData angezeigt werden.
return (
    <div>
      <h2>Wochenansicht des Schichtplans</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Montag</th>
            <th>Dienstag</th>
            <th>Mittwoch</th>
            <th>Donnerstag</th>
            <th>Freitag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frühschicht</td>
            {Object.keys(shiftPlanData).map(day => (
              <td key={day + "-Frühschicht"}>
                {shiftPlanData[day]["Frühschicht"].map((shift, index) => (
                  <div key={day + "-Frühschicht" + index} className="cell">
                    <div className="subcell">{"Employee-ID: " + shift.employee}</div>
                    <div className="subcell">{"Job-ID: " + shift.job}</div>
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            <td>Spätschicht</td>
            {Object.keys(shiftPlanData).map(day => (
              <td key={day + "-Spätschicht"}>
                {shiftPlanData[day]["Spätschicht"].map((shift, index) => (
                  <div key={day + "-Spätschicht" + index} className="cell">
                    <div className="subcell">{"Employee-ID: " + shift.employee}</div>
                    <div className="subcell">{"Job-ID: " +shift.job}</div>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  
  


}

export default WeekView;
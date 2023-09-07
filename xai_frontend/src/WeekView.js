import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeekView.css"; // CSS Stylesheet

function WeekView() {
  const [shiftPlanData, setShiftPlanData] = useState([]);
  const [statistics, setStatistics] = useState({
    num_employees: 0, // Initialisiere die Werte mit 0 oder einem Standardwert
    num_jobs: 0,
    num_qualifications: 0,
    num_days: 0,
    num_shifts_per_day: 0,
  });

  /* Eine "Hook" ist in React eine Funktion, die es funktionalen Komponenten ermöglicht,
  Zustand (wie useState), Nebeneffekte (wie useEffect), Kontext und andere React-Funktionen zu nutzen,
   ohne dass eine Klasse erforderlich ist. 
*/
  useEffect(() => {
    // Lambda Funktion / Pfeilfunktion
    axios
      .get("http://localhost:5000/schedule")
      .then((response) => {
        setShiftPlanData(response.data.schedule_data);
        setStatistics(response.data.statistics); // Setze die Statistikdaten aus der API-Antwort
      })
      .catch((error) => {
        console.error(
          "Es gab einen Fehler beim Abrufen der Schichtplandaten: ",
          error
        );
      });
  }, []);

  /*   // Sortieren Sie die Wochentage in der gewünschten Reihenfolge
  const sortedDays = Object.keys(shiftPlanData).sort((a, b) => {
    const daysOfWeek = [
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
    ];
    return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
  }); */

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
            {Object.keys(shiftPlanData).map((day) => (
              <td key={day + "-Frühschicht"}>
                {shiftPlanData[day]["Frühschicht"].map((shift, index) => (
                  <div key={day + "-Frühschicht" + index} className="cell">
                    <div className="subcell">
                      {"Employee-ID: " + shift.employee}
                    </div>
                    <div className="subcell">{"Job-ID: " + shift.job}</div>
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            <td>Spätschicht</td>
            {Object.keys(shiftPlanData).map((day) => (
              <td key={day + "-Spätschicht"}>
                {shiftPlanData[day]["Spätschicht"].map((shift, index) => (
                  <div key={day + "-Spätschicht" + index} className="cell">
                    <div className="subcell">
                      {"Employee-ID: " + shift.employee}
                    </div>
                    <div className="subcell">{"Job-ID: " + shift.job}</div>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="container mt-4">
        <h3>Statistik</h3>
        <table className="table table-bordered table-statistics">
          <thead>
            <tr>
              <th>Statistik</th>
              <th>Wert</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(statistics).map(([key, value]) => (
              <tr key={key}>
                <td>{key.replace(/_/g, " ")}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeekView;

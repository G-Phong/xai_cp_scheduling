import React, { useState, useEffect } from "react";
import WeekView2 from "../components/WeekView2.js";
import axios from "axios"; // JavaScript Library für HTTP-Anfragen

// Zustand für die Referenzlösung (statisch)
const staticShiftPlan = {
  schedule_data: {
    Montag: {
      Frühschicht: [
        { employee: "default", job: 1 },
        { employee: 2, job: 0 },
        { employee: 4, job: 2 },
      ],
      Spätschicht: [
        { employee: 0, job: 0 },
        { employee: 1, job: 2 },
        { employee: 4, job: 1 },
      ],
    },
    Dienstag: {
      Frühschicht: [
        { employee: 0, job: 1 },
        { employee: 2, job: 2 },
        { employee: 4, job: 0 },
      ],
      Spätschicht: [
        { employee: 0, job: 0 },
        { employee: 2, job: 2 },
        { employee: 4, job: 1 },
      ],
    },
    Mittwoch: {
      Frühschicht: [
        { employee: 1, job: 1 },
        { employee: 2, job: 0 },
        { employee: 4, job: 2 },
      ],
      Spätschicht: [
        { employee: 1, job: 2 },
        { employee: 2, job: 0 },
        { employee: 4, job: 1 },
      ],
    },
    Donnerstag: {
      Frühschicht: [
        { employee: 2, job: 2 },
        { employee: 3, job: 0 },
        { employee: 4, job: 1 },
      ],
      Spätschicht: [
        { employee: 1, job: 1 },
        { employee: 3, job: 0 },
        { employee: 4, job: 2 },
      ],
    },
    Freitag: {
      Frühschicht: [
        { employee: 0, job: 0 },
        { employee: "default", job: 2 },
        { employee: 4, job: 1 },
      ],
      Spätschicht: [
        { employee: 0, job: 1 },
        { employee: 3, job: 0 },
        { employee: 4, job: 2 },
      ],
    },
  },
  solution_count: 2,
  statistics: {
    num_employees: 5,
    num_jobs: 3,
    num_qualifications: 3,
    num_days: 5,
    num_shifts_per_day: 2,
  },
};

export default function WhatIfAnalysis() {
  // Zustandsvariable für die Liste der Präferenzen
  const [preferencesList, setPreferencesList] = useState([100, 0, 0]);
  // Zustandsvariable für den aktuellen Wert
  const [currentValueList, setCurrentValueList] = useState([50, 20, 15]);
  // Zustandsvariable für den aktuellen Wert
  const [solutionData, setSolutionData] = useState({
    schedule_data: {
      Montag: {
        Frühschicht: [
          { employee: 1, job: 1 },
          { employee: 2, job: 0 },
          { employee: 4, job: 2 },
        ],
        Spätschicht: [
          { employee: 0, job: 0 },
          { employee: 1, job: 2 },
          { employee: 4, job: 1 },
        ],
      },
      Dienstag: {
        Frühschicht: [
          { employee: 0, job: 1 },
          { employee: 2, job: 2 },
          { employee: 4, job: 0 },
        ],
        Spätschicht: [
          { employee: 0, job: 0 },
          { employee: 2, job: 2 },
          { employee: 4, job: 1 },
        ],
      },
      Mittwoch: {
        Frühschicht: [
          { employee: 1, job: 1 },
          { employee: 2, job: 0 },
          { employee: 4, job: 2 },
        ],
        Spätschicht: [
          { employee: 1, job: 2 },
          { employee: 2, job: 0 },
          { employee: 4, job: 1 },
        ],
      },
      Donnerstag: {
        Frühschicht: [
          { employee: 2, job: 2 },
          { employee: 3, job: 0 },
          { employee: 4, job: 1 },
        ],
        Spätschicht: [
          { employee: 1, job: 1 },
          { employee: 3, job: 0 },
          { employee: 4, job: 2 },
        ],
      },
      Freitag: {
        Frühschicht: [
          { employee: 0, job: 0 },
          { employee: 1, job: 2 },
          { employee: 4, job: 1 },
        ],
        Spätschicht: [
          { employee: 0, job: 1 },
          { employee: 3, job: 0 },
          { employee: 4, job: 2 },
        ],
      },
    },
    solution_count: 2,
    statistics: {
      num_employees: 5,
      num_jobs: 3,
      num_qualifications: 3,
      num_days: 5,
      num_shifts_per_day: 2,
    },
  });

  // Zustand für die vorherige Lösung
  const [previousSolutionData, setPreviousSolutionData] = useState({
    schedule_data: {
      Montag: {
        Frühschicht: [
          { employee: "default", job: 1 },
          { employee: 2, job: 0 },
          { employee: 4, job: 2 },
        ],
        Spätschicht: [
          { employee: 0, job: 0 },
          { employee: 1, job: 2 },
          { employee: 4, job: 1 },
        ],
      },
      Dienstag: {
        Frühschicht: [
          { employee: 0, job: 1 },
          { employee: 2, job: 2 },
          { employee: 4, job: 0 },
        ],
        Spätschicht: [
          { employee: 0, job: 0 },
          { employee: 2, job: 2 },
          { employee: 4, job: 1 },
        ],
      },
      Mittwoch: {
        Frühschicht: [
          { employee: 1, job: 1 },
          { employee: 2, job: 0 },
          { employee: 4, job: 2 },
        ],
        Spätschicht: [
          { employee: 1, job: 2 },
          { employee: 2, job: 0 },
          { employee: 4, job: 1 },
        ],
      },
      Donnerstag: {
        Frühschicht: [
          { employee: 2, job: 2 },
          { employee: 3, job: 0 },
          { employee: 4, job: 1 },
        ],
        Spätschicht: [
          { employee: 1, job: 1 },
          { employee: 3, job: 0 },
          { employee: 4, job: 2 },
        ],
      },
      Freitag: {
        Frühschicht: [
          { employee: 0, job: 0 },
          { employee: 1, job: 2 },
          { employee: 4, job: 1 },
        ],
        Spätschicht: [
          { employee: 0, job: 1 },
          { employee: 3, job: 0 },
          { employee: 4, job: 2 },
        ],
      },
    },
    solution_count: 2,
    statistics: {
      num_employees: 5,
      num_jobs: 3,
      num_qualifications: 3,
      num_days: 5,
      num_shifts_per_day: 2,
    },
  });

  // Zustandsvariable für veränderte Schichten
  const [changedShifts, setChangedShifts] = useState([]);

  // Funktion, um den Schichtplan mit den neuen Präferenzen zu lösen
  const solveWithPreferences = () => {
    // Hier kannst du den Code einfügen, um den Schichtplan neu zu berechnen
    // Verwende die preferencesList, um auf die neuen Präferenzen zuzugreifen
    // Annahme: Du erhältst die neuen Werte für die Präferenzen in preferencesList

    // Aktualisiere die aktuellen Werte
    setCurrentValueList(preferencesList);

    // Sende eine POST-Anfrage an das Backend
    axios
      .post("http://localhost:5000/solve_shifts_what_if", {
        // Hier sendest du die Präferenzliste als JSON
        job1Preference: preferencesList[0],
        job2Preference: preferencesList[1],
        job3Preference: preferencesList[2],
      })
      .then((response) => {
        // Verarbeite die Antwort vom Backend
        const solutionData = response.data;

        // Vergleichen Sie die neue Lösung mit der vorherigen und markieren Sie die Unterschiede
        const changedShifts = findChangedShifts(staticShiftPlan, solutionData);
        console.log("nach funktion changed: ");
        console.log(changedShifts);
        setChangedShifts(changedShifts);

        setSolutionData(solutionData);
        //setPreviousSolutionData(solutionData);

        // Aktualisiere deine UI mit den Ergebnissen
        // Beispiel: setSchedule(solutionData);
        console.log(
          "POST-Anfrage gesendet! Hier die aktualisierten Präferenzen: \n"
        );
        console.log(preferencesList);
        console.log("Antwort vom Backend nach dem Solven: ");

        if (solutionData == null) {
          console.log("Null Response!");
        } else {
          console.log("Datentyp von solutionData:", typeof solutionData);
          console.log("Inhalt von solutionData:", solutionData);
        }
      })
      .catch((error) => {
        // Handle Fehler, falls auftreten
        console.error("Fehler beim Senden der Anfrage an das Backend:", error);
      });
  };

  // useEffect verwenden, um initial die vorherige Lösung zu setzen
  useEffect(() => {
    setPreviousSolutionData(solutionData);
  }, [solutionData]);

  function findChangedShifts(oldShiftPlan, newShiftPlan) {
    const changedShifts = {};

    // Überprüfen, ob die Input-Parameter die erforderliche Struktur haben
    if (
      oldShiftPlan.schedule_data &&
      newShiftPlan.schedule_data &&
      typeof oldShiftPlan.schedule_data === "object" &&
      typeof newShiftPlan.schedule_data === "object"
    ) {
      // Durchlaufe die Wochentage (Montag bis Freitag)
      const weekdays = Object.keys(oldShiftPlan.schedule_data);
      for (const weekday of weekdays) {
        changedShifts[weekday] = {};

        // Durchlaufe die Schichttypen (Frühschicht und Spätschicht)
        const shiftTypes = Object.keys(oldShiftPlan.schedule_data[weekday]);
        for (const shiftType of shiftTypes) {
          changedShifts[weekday][shiftType] = [];

          const oldShifts = oldShiftPlan.schedule_data[weekday][shiftType];
          const newShifts = newShiftPlan.schedule_data[weekday][shiftType];

          // Vergleiche die Schichten in oldShifts und newShifts
          for (let i = 0; i < newShifts.length; i++) {
            const oldShift = oldShifts[i];
            const newShift = newShifts[i];

            // Vergleiche die Schichten auf Basis von Employee und Job
            if (
              oldShift.employee !== newShift.employee ||
              oldShift.job !== newShift.job
            ) {
              changedShifts[weekday][shiftType].push({
                isDifferent: true,
                job: newShift.job,
              });
            } else {
              changedShifts[weekday][shiftType].push({
                isDifferent: false,
                job: newShift.job,
              });
            }
          }
        }
      }
    }
    // Debug-Ausgabe der gefundenen Änderungen
    console.log("changedShifts:", changedShifts);

    return changedShifts;
  }

  // Funktion zum Aktualisieren der Präferenzen in der Liste
  const updatePreferences = (index, value) => {
    const updatedList = [...preferencesList];
    updatedList[index] = value;
    setPreferencesList(updatedList);
  };

  return (
    <div className="container">
      <h1>What-If-Analysis</h1>
      <h2>Input mask (Change your preferences here):</h2>
      {/* Eingabefelder für Job-Präferenzen */}
      {[0, 1, 2].map((index) => (
        <div className="row" key={index}>
          <div className="col-md-6">
            <label>Job {index + 1} Preference (1-100):</label>
            <input
              type="number"
              min="1"
              max="100"
              className="form-control"
              value={preferencesList[index]}
              onChange={(e) => updatePreferences(index, e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <div className="current-value">
              Current Value: {currentValueList[index]}
            </div>
          </div>
        </div>
      ))}
      {/* Solve Button */}
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={solveWithPreferences}>
            Solve
          </button>
        </div>
      </div>
      {/* Wochenansicht */}
      <WeekView2
        shiftData={solutionData}
        changedShifts={changedShifts}
        staticShiftData={staticShiftPlan} // statischer Schichtplan
      />
      {/* Übergebe die Schichtdaten an WeekView */}
    </div>
  );
}

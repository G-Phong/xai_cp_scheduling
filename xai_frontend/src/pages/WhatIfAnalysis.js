import React, { useState } from "react";
import WeekView2 from "../components/WeekView2.js";
import axios from "axios"; // JavaScript Library für HTTP-Anfragen

export default function WhatIfAnalysis() {
  // Zustandsvariable für die Liste der Präferenzen
  const [preferencesList, setPreferencesList] = useState([100, 0, 0]);
  // Zustandsvariable für den aktuellen Wert
  const [currentValueList, setCurrentValueList] = useState([100, 0, 0]);
  // Zustandsvariable für den aktuellen Wert
  const [solutionData, setSolutionData] = useState(
    {       "schedule_data": {
          "Montag": {
            "Fr\u00fchschicht": [
              {
                "employee": "default",
                "job": "default"
              },
              {
                "employee": 2,
                "job": 0
              },
              {
                "employee": 4,
                "job": 2
              }
            ],
            "Sp\u00e4tschicht": [
              {
                "employee": 1,
                "job": 1
              },
              {
                "employee": 2,
                "job": 2
              },
              {
                "employee": 4,
                "job": 0
              }
            ]
          },
          "Dienstag": {
            "Fr\u00fchschicht": [
              {
                "employee": 0,
                "job": 0
              },
              {
                "employee": 2,
                "job": 2
              },
              {
                "employee": 4,
                "job": 1
              }
            ],
            "Sp\u00e4tschicht": [
              {
                "employee": 0,
                "job": 0
              },
              {
                "employee": 2,
                "job": 2
              },
              {
                "employee": 4,
                "job": 1
              }
            ]
          },
          "Mittwoch": {
            "Fr\u00fchschicht": [
              {
                "employee": 0,
                "job": 0
              },
              {
                "employee": 1,
                "job": 2
              },
              {
                "employee": 4,
                "job": 1
              }
            ],
            "Sp\u00e4tschicht": [
              {
                "employee": 1,
                "job": 2
              },
              {
                "employee": 2,
                "job": 0
              },
              {
                "employee": 4,
                "job": 1
              }
            ]
          },
          "Donnerstag": {
            "Fr\u00fchschicht": [
              {
                "employee": 0,
                "job": 1
              },
              {
                "employee": 2,
                "job": 0
              },
              {
                "employee": 4,
                "job": 2
              }
            ],
            "Sp\u00e4tschicht": [
              {
                "employee": 1,
                "job": 2
              },
              {
                "employee": 3,
                "job": 0
              },
              {
                "employee": 4,
                "job": 1
              }
            ]
          },
          "Freitag": {
            "Fr\u00fchschicht": [
              {
                "employee": 1,
                "job": 1
              },
              {
                "employee": 3,
                "job": 0
              },
              {
                "employee": 4,
                "job": 2
              }
            ],
            "Sp\u00e4tschicht": [
              {
                "employee": 0,
                "job": 1
              },
              {
                "employee": 3,
                "job": 0
              },
              {
                "employee": 4,
                "job": 2
              }
            ]
          }
        },
        "statistics": {
          "num_employees": 5,
          "num_jobs": 3,
          "num_qualifications": 3,
          "num_days": 5,
          "num_shifts_per_day": 2
        }
      }
  );

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

        setSolutionData(solutionData);

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

  function findChangedShifts(oldShiftPlan, newShiftPlan) {
    const changedShifts = [];
  
    // Durchlaufe die Wochentage
    for (const day in newShiftPlan) {
      // Durchlaufe die Schichttypen für den aktuellen Tag
      for (const shiftType in newShiftPlan[day]) {
        const oldShifts = oldShiftPlan[day][shiftType];
        const newShifts = newShiftPlan[day][shiftType];
  
        // Vergleiche die Schichten in oldShifts und newShifts
        for (let i = 0; i < newShifts.length; i++) {
          const oldShift = oldShifts[i];
          const newShift = newShifts[i];
  
          // Vergleiche die Schichten auf Basis von Employee und Job
          if (
            oldShift.employee !== newShift.employee ||
            oldShift.job !== newShift.job
          ) {
            changedShifts.push(newShift);
          }
        }
      }
    }
  
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
      <WeekView2 shiftData={solutionData} /> {/* Übergebe die Schichtdaten an WeekView */}
    </div>
  );
}

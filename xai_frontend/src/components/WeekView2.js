import { useState, useEffect } from "react";
import "./WeekView2.css"; // CSS Stylesheet

export default function WeekView2({
  shiftData,
  changedShifts,
  staticShiftData,
}) {
  const [currentStaticSolution, setCurrentStaticSolution] = useState("0");
  const [shouldCompare, setShouldCompare] = useState(false);
  const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
  const [numberDifferences, setNumberDifferences] = useState(0);
  const maxSolutions = shiftData.solution_count;

  const toggleSolution = () => {
    if (currentStaticSolution === 0) {
      setCurrentStaticSolution(1);
    } else {
      setCurrentStaticSolution(0);
    }
  };

  const toggleCompare = () => {
    setShouldCompare(!shouldCompare);
  };

  useEffect(() => {
    const newNumberDifferences = getNumberDifferences();
    setNumberDifferences(newNumberDifferences);
  }, [activeSolutionIndex, changedShifts]);

  // Extract weekdays from schedule_data
  const weekdays = Object.keys(shiftData.schedule_data[1].schedule);

  // Extract shift types from the first weekday (assuming they are the same for all weekdays)
  const shiftTypes = Object.keys(shiftData.schedule_data[1].schedule.Monday);

  // Job descriptions for table headings
  const jobDescriptions = {
    0: "Forklift",
    1: "Sorting",
    2: "Picking",
  };

  const employeeNames = {
    0: "YOU",
    1: "Alice",
    2: "Bob",
    3: "Emily",
    4: "Franck",
  };

  useEffect(() => {
    const numberOfDifferences = compareSchedules(
      staticShiftData.schedule_data[currentStaticSolution].schedule,
      shiftData.schedule_data[activeSolutionIndex].schedule
    );
    // Verwendung von numberOfDifferences, z. B. Zustandsaktualisierung oder Anzeige im UI
    setNumberDifferences(numberOfDifferences);
  }, [currentStaticSolution, activeSolutionIndex, staticShiftData, shiftData]);

  // Diese Funktion vergleicht die beiden Schichtpläne und zählt die Anzahl der unterschiedlichen Zellen
  function compareSchedules(staticSchedule, whatIfSchedule) {
    // Initialisieren des Zählers für die Anzahl der Unterschiede
    let differenceCounter = 0;

    // Überprüfen der Eingabeparameter
    if (!staticSchedule || !whatIfSchedule) {
      console.warn("Einer der Schichtpläne ist null oder undefined.");
      return differenceCounter;
    }

    // Über die Wochentage iterieren
    const weekdays = Object.keys(staticSchedule);
    for (const weekday of weekdays) {
      // Über die Schichttypen iterieren
      const shiftTypes = Object.keys(staticSchedule[weekday]);
      for (const shiftType of shiftTypes) {
        const staticShifts = staticSchedule[weekday][shiftType];
        const whatIfShifts = whatIfSchedule[weekday][shiftType];

        // Über die Schichten iterieren und die Mitarbeiter-IDs vergleichen
        for (let i = 0; i < staticShifts.length; i++) {
          if (staticShifts[i].employee !== whatIfShifts[i].employee) {
            differenceCounter++;
          }
        }
      }
    }

    // Anzahl der unterschiedlichen Zellen zurückgeben
    return differenceCounter;
  }

  function getNumberDifferences(changedShifts) {
    let diffCounter = 0;

    if (changedShifts && !changedShifts.schedule_data) {
      console.log("changedShifts has an acceptable format");
      const weekdays = Object.keys(changedShifts);
      const shiftTypes = Object.keys(changedShifts.Monday);

      for (const weekday of weekdays) {
        for (const shiftType of shiftTypes) {
          const shifts = changedShifts[weekday][shiftType];

          for (const shift of shifts) {
            if (shift.isDifferent === true) {
              diffCounter++;
              //console.log("DiffCounter: " + diffCounter);
            }
          }
        }
      }
    } else {
      console.log("changedShifts has the wrong input format!");
    }

    return diffCounter;
  }

  return (
    <div>
      <div>
        <div className="row">
          <div className="btn-group" role="group">
            <button
              className="btn btn-primary btn-sm custom-width"
              onClick={() =>
                setActiveSolutionIndex(Math.max(0, activeSolutionIndex - 1))
              }
              disabled={activeSolutionIndex === 0}
            >
              Previous Solution
            </button>
            <button
              className="btn btn-primary btn-sm custom-width"
              onClick={() =>
                setActiveSolutionIndex(
                  Math.min(maxSolutions - 1, activeSolutionIndex + 1)
                )
              }
              disabled={activeSolutionIndex === maxSolutions - 1}
            >
              Next Solution
            </button>
          </div>

          {/* <-- TABLE --> */}
          <table>
            <thead>
              <tr>
                <th>Shift type</th>
                <th>Job</th>
                {weekdays.map((weekday) => (
                  <th key={weekday}>{weekday}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {shiftTypes.map((shiftType) => (
                <tr key={shiftType}>
                  {}
                  <td>
                    {shiftType}{" "}
                    {shiftType === "EarlyShift"
                      ? "06.00 - 14.00"
                      : "14.00 - 22.00"}
                  </td>
                  <td>
                    {Object.keys(jobDescriptions).map((jobType) => (
                      <div key={jobType} className={`cell static-cell`}>
                        <div className="subcell">
                          {jobDescriptions[jobType]}
                        </div>
                      </div>
                    ))}
                  </td>

                  {weekdays.map((weekday) => (
                    <td key={weekday}>
                      {shiftData.schedule_data[activeSolutionIndex].schedule[
                        weekday
                      ][shiftType].map((shift, index) => {
                        const isHighlighted =
                          shouldCompare &&
                          shift.employee !==
                            staticShiftData.schedule_data[currentStaticSolution]
                              .schedule[weekday][shiftType][index].employee;
                          
                        const isYou = (shift.employee === 0);

                        return (
                          <div
                            key={index}
                            className={`cell ${
                              isHighlighted ? "highlighted-cell" : ""
                            }`}
                          >
                            <div className={`subcell ${isYou ? "highlighted-cell" : ""}`} >
                              {employeeNames[shift.employee]}
                            </div>
                          </div>
                        );
                      })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

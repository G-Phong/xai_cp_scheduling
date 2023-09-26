import { useState, useEffect } from "react";
import "./WeekView2.css"; // CSS Stylesheet

export default function WeekView2({
  shiftData,
  changedShifts,
  staticShiftData,
  staticPreferenceMatrix,
  updatedPreferenceMatrix,
  sumShiftsPerEmployee,
  individualPreferenceScore,
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
        {/* Format as a row to have both matrices next to each other */}
        <div className="row">
          {/* Updated Preference Matrix */}
          <div className="col-md-6">
            <div className="matrix">
              <h2>Your updated "What if" Preference Matrix</h2>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Job 0</th>
                    <th>Job 1</th>
                    <th>Job 2</th>
                  </tr>
                </thead>

                <tbody>
                  {updatedPreferenceMatrix.map((row, employeeIndex) => (
                    <tr key={employeeIndex}>
                      <td>Employee {employeeIndex}</td>
                      {row.map((preference, jobIndex) => {
                        const isDifferent =
                          staticPreferenceMatrix[employeeIndex][jobIndex] !==
                          updatedPreferenceMatrix[employeeIndex][jobIndex];

                        /* console.log("matrix debug: ");
                      console.log(
                        staticPreferenceMatrix[employeeIndex][jobIndex]
                      );
                      console.log(
                        updatedPreferenceMatrix[employeeIndex][jobIndex]
                      );
                      console.log("Boolean eval: ");
                      console.log(isDifferent); */

                        const staticValue =
                          staticPreferenceMatrix[employeeIndex][jobIndex];
                        const updatedValue =
                          updatedPreferenceMatrix[employeeIndex][jobIndex];
                        const isDifferent2 = staticValue !== updatedValue;
                        /* console.log("Matrix Debug 2:");
                      console.log(
                        `staticValue: ${staticValue}, type: ${typeof staticValue}`
                      );
                      console.log(
                        `updatedValue: ${updatedValue}, type: ${typeof updatedValue}`
                      );
                      console.log(`Boolean evaluation: ${isDifferent2}`); */

                        return (
                          <td
                            key={jobIndex}
                            className={isDifferent ? "highlighted-cell" : ""}
                          >
                            {preference}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Static Preference Matrix */}
          <div className="col-md-6">
            <div className="matrix">
              <h2>Original Preference Matrix</h2>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Job 0</th>
                    <th>Job 1</th>
                    <th>Job 2</th>
                  </tr>
                </thead>
                <tbody>
                  {staticPreferenceMatrix.map((row, employeeIndex) => (
                    <tr key={employeeIndex}>
                      <td>Employee {employeeIndex}</td>
                      {row.map((staticPreference, jobIndex) => {
                        const updatedPreference =
                          updatedPreferenceMatrix[employeeIndex][jobIndex];
                        const isDifferent =
                          staticPreference !== updatedPreference;

                        return (
                          <td
                            key={jobIndex}
                            className={isDifferent ? "highlighted-cell" : ""}
                          >
                            {staticPreference}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2>
            "What-If" week schedule (Total preference:{" "}
            {shiftData.schedule_data[activeSolutionIndex].total_preference}) -
            Optimal Solutions: {shiftData.solution_count}
            <br />
            You are now viewing Solution Nr. {activeSolutionIndex + 1}.
          </h2>

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

          <table>
            <thead>
              <tr>
                <th>Shift type</th>
                <th>Job description</th>
                {weekdays.map((weekday) => (
                  <th key={weekday}>{weekday}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {shiftTypes.map((shiftType) => (
                <tr key={shiftType}>
                  <td>{shiftType}</td>
                  <td>
                    {Object.keys(jobDescriptions).map((jobType) => (
                      <div key={jobType} className={`cell static-cell`}>
                        <div className="subcell">
                          {"Job " + jobType + ": " + jobDescriptions[jobType]}
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

                        return (
                          <div
                            key={index}
                            className={`cell ${
                              isHighlighted ? "highlighted-cell" : ""
                            }`}
                          >
                            <div className="subcell">
                              {" Employee-ID: " + shift.employee}
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

          {/* Display the static shift schedule */}
          <h2>
            Original shift schedule (Total preference:{" "}
            {
              staticShiftData.schedule_data[currentStaticSolution]
                .total_preference
            }
            ) - Optimal Solutions: 2 <br />
            You are now viewing Solution Nr. {currentStaticSolution + 1}.
          </h2>

          <div className="center-container">
            <span>Toggle between both solutions</span>
            <label className="modern-toggle-button">
              <input type="checkbox" onClick={toggleSolution} />
              <span className="toggle-button-slider">
                <span className="toggle-button-number" style={{ left: "0" }}>
                  1
                </span>
                <span className="toggle-button-number" style={{ right: "0" }}>
                  2
                </span>
              </span>
            </label>

            {/*  Compare-Button */}
            <div style={{ padding: "10px" }}>
              <button
                className={`btn ${
                  shouldCompare ? "btn-custom-yellow" : "btn-custom-white"
                }`}
                onClick={toggleCompare}
              >
                Compare
              </button>
            </div>
          </div>

          {staticShiftData && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Shift type</th>
                    <th>Job description</th>
                    {weekdays.map((weekday) => (
                      <th key={weekday}>{weekday}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {shiftTypes.map((shiftType) => (
                    <tr key={shiftType}>
                      <td>{shiftType}</td>
                      <td>
                        {Object.keys(jobDescriptions).map((jobType) => (
                          <div key={jobType} className={`cell static-cell`}>
                            <div className="subcell">
                              {"Job " +
                                jobType +
                                ": " +
                                jobDescriptions[jobType]}
                            </div>
                          </div>
                        ))}
                      </td>

                      {weekdays.map((weekday) => (
                        <td key={weekday}>
                          {staticShiftData.schedule_data[
                            currentStaticSolution
                          ].schedule[weekday][shiftType].map((shift, index) => {
                            const isHighlighted =
                              shouldCompare &&
                              shiftData.schedule_data[activeSolutionIndex]
                                .schedule[weekday][shiftType][index]
                                .employee !==
                                staticShiftData.schedule_data[
                                  currentStaticSolution
                                ].schedule[weekday][shiftType][index].employee;

                            return (
                              <div
                                key={index}
                                className={`cell ${
                                  isHighlighted ? "highlighted-cell" : ""
                                }`}
                              >
                                <div className="subcell">
                                  {" Employee-ID: " + shift.employee}
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
          )}

          <h2>
            <br />
            Your updated preferences would change {numberDifferences} shifts!
          </h2>
          {/* Display additional shift plan data */}
          <div className="row">
            <div className="col-md-4">
              {/* Sum of Shifts per Employee */}
              <div className="matrix">
                <h2>Sum of Shifts per Employee:</h2>
                <table className="table table-bordered table-statistics">
                  {/* Table for sum of shifts per employee */}
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Number of Shifts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(sumShiftsPerEmployee).map((employee) => (
                      <tr key={employee}>
                        <td>{employee}</td>
                        <td>{sumShiftsPerEmployee[employee]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-4">
              {/* Individual Preference Score */}
              <div className="matrix">
                <h2>Individual Preference Score:</h2>
                <table className="table table-bordered table-statistics">
                  {/* Table for individual preference scores */}
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(individualPreferenceScore).map((employee) => (
                      <tr key={employee}>
                        <td>{employee}</td>
                        <td>{individualPreferenceScore[employee]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-4">
              {/* Statistics */}
              <div className="matrix">
                <h3>Work Statistics</h3>
                <table className="table table-bordered table-statistics">
                  <thead>
                    <tr>
                      <th>Statistics</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(shiftData.statistics).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td>{key.replace(/_/g, " ")}</td>
                          <td>{value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

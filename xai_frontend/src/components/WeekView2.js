import { useState, useEffect } from "react";
import "./WeekView2.css"; // CSS Stylesheet

export default function WeekView2({
  shiftData,
  changedShifts,
  staticShiftData,
  staticPreferenceMatrix,
  updatedPreferenceMatrix,
}) {
  // State-Hook für die hervorgehobenen Schichten
  const [highlightedShifts, setHighlightedShifts] = useState({
    Montag: {
      Frühschicht: [
        { isDifferent: true, job: 0 },
        { isDifferent: false, job: 1 },
        { isDifferent: false, job: 2 },
      ],
      Spätschicht: [
        { isDifferent: false, job: 0 },
        { isDifferent: false, job: 1 },
        { isDifferent: false, job: 2 },
      ],
    },
  });

  useEffect(() => {
    // Wenn sich die geänderten Schichten ändern, setzen Sie den Zustand für hervorgehobene Schichten neu
    setHighlightedShifts(changedShifts);
  }, [changedShifts]);

  // Extrahiere schedule_data und statistics aus shiftData
  const { schedule_data, statistics } = shiftData;

  // Extrahiere die Wochentage aus schedule_data
  const weekdays = Object.keys(schedule_data);

  // Extrahiere die Schichttypen aus dem ersten Wochentag (angenommen, sie sind für alle Wochentage gleich)
  const shiftTypes = Object.keys(schedule_data[weekdays[0]]);

  // Job-Bezeichnungen für die Überschriften
  const jobDescriptions = {
    0: "Gabelstapler",
    1: "Lager sortieren",
    2: "Kommissionieren",
  };

  function getNumberDifferences(changedShifts) {
    let diffCounter = 0;

    if (changedShifts && !changedShifts.schedule_data) {
      console.log("changedShifts has an acceptable format");
      const weekdays = Object.keys(changedShifts);

      for (const weekday of weekdays) {
        for (const shiftType of shiftTypes) {
          const shifts = changedShifts[weekday][shiftType];

          for (const shift of shifts) {
            if (shift.isDifferent === true) {
              diffCounter++;
              console.log("DiffCounter: " + diffCounter);
            }
          }
        }
      }
    } else {
      console.log("changedShifts has wrong input!");
    }

    return diffCounter;
  }

  return (
    <div>
      <h2>
        "What-If" week schedule Optimal Solutions: {shiftData.solution_count}
      </h2>

      <h2>
        Your updated preferences would change{" "}
        {getNumberDifferences(changedShifts)} shifts!
      </h2>

      {/* Static Preference Matrix */}
      <div className="matrix">
        <h2>Static Preference Matrix</h2>
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
                  const isDifferent = staticPreference !== updatedPreference;

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

      {/* Updated Preference Matrix */}
      <div className="matrix">
        <h2>Updated Preference Matrix</h2>
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

                    console.log("matrix debug: ")
                    console.log(staticPreferenceMatrix[employeeIndex][jobIndex]);
                    console.log(updatedPreferenceMatrix[employeeIndex][jobIndex]);
                    console.log("Boolean eval: ");
                    console.log(isDifferent);

                    const staticValue = staticPreferenceMatrix[employeeIndex][jobIndex];
                    const updatedValue = updatedPreferenceMatrix[employeeIndex][jobIndex];
                    const isDifferent2 = staticValue !== updatedValue;
                    console.log("Matrix Debug 2:");
                    console.log(`staticValue: ${staticValue}, type: ${typeof staticValue}`);
                    console.log(`updatedValue: ${updatedValue}, type: ${typeof updatedValue}`);
                    console.log(`Boolean evaluation: ${isDifferent2}`);

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
                  {schedule_data[weekday][shiftType].map((shift, index) => {
                    //const isHighlighted =
                    //highlightedShifts[weekday] &&
                    //highlightedShifts[weekday][shiftType] &&
                    //highlightedShifts[weekday][shiftType][index] &&
                    //highlightedShifts[weekday][shiftType][index].isDifferent;

                    const isHighlighted =
                      schedule_data[weekday][shiftType][index].employee !==
                      staticShiftData.schedule_data[weekday][shiftType][index]
                        .employee;

                    return (
                      <div
                        key={index}
                        className={`cell ${
                          isHighlighted ? "highlighted-cell" : ""
                        }`}
                      >
                        <div className="subcell">
                          {" Employee-ID: " +
                            shift.employee +
                            "      Job-ID: " +
                            shift.job}
                        </div>
                        {/* <div className="subcell">
                    {"Job-ID: " + shift.job}
                  </div> */}
                      </div>
                    );
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Anzeige des statischen Schichtplans */}
      <h2>Original shift schedule</h2>
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
                          {"Job " + jobType + ": " + jobDescriptions[jobType]}
                        </div>
                      </div>
                    ))}
                  </td>

                  {weekdays.map((weekday) => (
                    <td key={weekday}>
                      {staticShiftData.schedule_data[weekday][shiftType].map(
                        (shift, index) => {
                          const isHighlighted =
                            schedule_data[weekday][shiftType][index]
                              .employee !==
                            staticShiftData.schedule_data[weekday][shiftType][
                              index
                            ].employee;

                          return (
                            <div
                              key={index}
                              className={`cell ${
                                isHighlighted ? "highlighted-cell" : ""
                              }`}
                            >
                              <div className="subcell">
                                {" Employee-ID: " +
                                  shift.employee +
                                  "       Job-ID: " +
                                  shift.job}
                              </div>
                              {/* <div className="subcell">
                            {"Job-ID: " + shift.job}
                          </div> */}
                            </div>
                          );
                        }
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="container mt-4">
        <h3>Statistics</h3>
        <table className="table table-bordered table-statistics">
          <thead>
            <tr>
              <th>Statistics</th>
              <th>Value</th>
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

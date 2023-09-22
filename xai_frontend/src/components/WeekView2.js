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
  // State hook for highlighted shifts
  const [highlightedShifts, setHighlightedShifts] = useState({
    Monday: {
      EarlyShift: [
        { isDifferent: true, job: 0 },
        { isDifferent: false, job: 1 },
        { isDifferent: false, job: 2 },
      ],
      LateShift: [
        { isDifferent: false, job: 0 },
        { isDifferent: false, job: 1 },
        { isDifferent: false, job: 2 },
      ],
    },
  });

  useEffect(() => {
    // Reset the state for highlighted shifts when changedShifts change
    setHighlightedShifts(changedShifts);
  }, [changedShifts]);

  // Extract schedule_data and statistics from shiftData
  const { schedule_data, statistics } = shiftData;

  // Extract weekdays from schedule_data
  const weekdays = Object.keys(schedule_data);

  // Extract shift types from the first weekday (assuming they are the same for all weekdays)
  const shiftTypes = Object.keys(schedule_data[weekdays[0]]);

  // Job descriptions for table headings
  const jobDescriptions = {
    0: "Forklift",
    1: "Sorting",
    2: "Picking",
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
      </div>

      <h2>
        "What-If" week schedule Optimal Solutions: {shiftData.solution_count}
        <br />
        Your updated preferences would change{" "}
        {getNumberDifferences(changedShifts)} shifts!
      </h2>
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
                                {" Employee-ID: " + shift.employee}
                              </div>
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
      </div>
    </div>
  );
}

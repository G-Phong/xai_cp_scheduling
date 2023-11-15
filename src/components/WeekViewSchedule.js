import { useState } from "react";
import "./WeekViewSchedule.css"; // CSS Stylesheet

export default function WeekViewSchedule({ shiftData, activeSolutionIndex, setActiveSolutionIndex }) {
/*   const [activeSolutionIndex, setActiveSolutionIndex] = useState(0); */
  const maxSolutions = shiftData.solution_count;

  let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let shiftTypes = ["EarlyShift", "LateShift"];

  if (shiftData["solution_count"] === 0) {
    console.log("INFEASIBLE!");
  } else {
    console.log("FEASIBLE! Number of solutions:");
    console.log(shiftData["solution_count"]);
  }

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
          <table className="custom-table">
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
                  <td className="shift-type-td">
                    {shiftType}
                    <br />
                    {shiftType === "EarlyShift"
                      ? "06.00 - 14.00"
                      : "14.00 - 22.00"}
                  </td>
                  <td>
                    {Object.keys(jobDescriptions).map((jobType) => (
                      <div key={jobType} className={`cell static-cell`}>
                        <div className="subcell jobType">
                          {jobDescriptions[jobType]}
                        </div>
                      </div>
                    ))}
                  </td>

                  {weekdays.map((weekday) => {
                    // Check if shiftData has schedule_data and weekday data, otherwise provide a default
                    let hasScheduleData =
                      shiftData.schedule_data &&
                      shiftData.schedule_data[activeSolutionIndex];
                    if (shiftData["solution_count"] === 0) {
                      hasScheduleData = false;
                    }

                    const shiftDataForWeekday = hasScheduleData
                      ? shiftData.schedule_data[activeSolutionIndex].schedule[
                          weekday
                        ]
                      : {};

                    return (
                      <td key={weekday}>
                        {shiftDataForWeekday[shiftType] ? (
                          shiftDataForWeekday[shiftType].map((shift, index) => {
                            const isYou = shift.employee === 0;

                            return (
                              <div key={index} className="cell">
                                <div
                                  className={`subcell ${
                                    isYou ? "highlighted-cell" : "regular"
                                  }`}
                                >
                                  {employeeNames[shift.employee]}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          // Render an empty cell when there's no shift data
                          <div className="cell empty-cell">
                            <div className="subcell empty-subcell">
                              no solution
                            </div>
                          </div>
                        )}
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
  );
}

import React, { useState, useEffect } from "react";
import "./EduGame.css";
import "bootstrap/dist/css/bootstrap.min.css";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shiftTypes = ["EarlyShift", "LateShift"];

const jobDescriptions = {
  0: "Forklift",
  1: "Sorting",
  2: "Picking",
};

const staticShiftData = {
  Monday: {
    EarlyShift: [{}, {}, {}],
    LateShift: [{}, {}, {}],
  },
  Tuesday: {
    EarlyShift: [{}, {}, {}],
    LateShift: [{}, {}, {}],
  },
  Wednesday: {
    EarlyShift: [{}, {}, {}],
    LateShift: [{}, {}, {}],
  },
  Thursday: {
    EarlyShift: [{}, {}, {}],
    LateShift: [{}, {}, {}],
  },
  Friday: {
    EarlyShift: [{}, {}, {}],
    LateShift: [{}, {}, {}],
  },
};

//Problem data
// Max Shifts und Min Shifts
const maxShifts = { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 };
const minShifts = { 1: 5, 2: 5, 3: 5, 4: 3, 5: 3 };

const availability = {
  Monday: {
    EarlyShift: { 1: 0, 2: 1, 3: 1, 4: 0, 5: 1 },
    LateShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 },
  },
  Tuesday: {
    EarlyShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 },
    LateShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 },
  },
  Wednesday: {
    EarlyShift: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 },
    LateShift: { 1: 1, 2: 0, 3: 1, 4: 1, 5: 1 },
  },
  Thursday: {
    EarlyShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 },
    LateShift: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
  },
  Friday: {
    EarlyShift: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 1 },
    LateShift: { 1: 1, 2: 0, 3: 1, 4: 1, 5: 1 },
  },
};

// Qualifikation und Job-Präferenzen
const qualification = {
  1: { 0: 1, 1: 1, 2: 2 },
  2: { 0: 2, 1: 1, 2: 1 },
  3: { 0: 3, 1: 1, 2: 2 },
  4: { 0: 2, 1: 3, 2: 3 },
  5: { 0: 2, 1: 1, 2: 2 },
};

const jobPreference = {
  1: { 0: 50, 1: 20, 2: 15 },
  2: { 0: 0, 1: 100, 2: 50 },
  3: { 0: 90, 1: 25, 2: 45 },
  4: { 0: 65, 1: 50, 2: 15 },
  5: { 0: 50, 1: 50, 2: 60 },
};

// Anforderungen für Qualifikation (noch als Matrix, da der Kontext unklar ist)
const requiredQualification = [
  [3, 3, 3],
  [2, 1, 2],
  [3, 2, 2],
];

export default function EduGame() {
  const [scheduleData, setScheduleData] = useState(staticShiftData);
  const [employees, setEmployees] = useState([
    { employeeID: "1", name: "John" },
    { employeeID: "2", name: "Alice" },
    { employeeID: "3", name: "Bob" },
    { employeeID: "4", name: "Emily" },
    { employeeID: "5", name: "Franck" },
  ]);

  const [tableStatus, setTableStatus] = useState("UNSOLVED");
  const [remainingCells, setRemainingCells] = useState(0);
  const [totalPreference, setTotalPreference] = useState(0);

  const [constraint1, setConstraint1] = useState(false);
  const [constraint2, setConstraint2] = useState(false);
  const [constraint3, setConstraint3] = useState(false);
  const [constraint4, setConstraint4] = useState(false);
  const [constraint5, setConstraint5] = useState(false);
  const [constraint6, setConstraint6] = useState(true);

  useEffect(() => {
    // Hier könnten Sie Logik einfügen, um den Zustand der Constraints zu prüfen
    // Zum Beispiel: setConstraint1(/* irgendeine Prüflogik */);
    // Ähnliche Logik für die anderen Constraints
  }, []); // Die Abhängigkeiten könnten hier eingefügt werden, falls nötig

  const handleDragStart = (event, employee) => {
    event.dataTransfer.setData("employee", JSON.stringify(employee));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, day, shiftType, subIndex) => {
    event.preventDefault();
    const employee = JSON.parse(event.dataTransfer.getData("employee"));
    const updatedScheduleData = { ...scheduleData };
    updatedScheduleData[day][shiftType][subIndex].employee = employee;
    setScheduleData(updatedScheduleData);

    // Präferenzpunkte je nach Mitarbeiter hinzufügen
    if (employee.name === "Alice") {
      setTotalPreference((prev) => prev + 50);
    } else if (employee.name === "Bob") {
      setTotalPreference((prev) => prev + 30);
    } else if (employee.name === "John") {
      setTotalPreference((prev) => prev + 70);
    }
  };

  const handleRemoveFromShift = (day, shiftType, subIndex) => {
    const updatedScheduleData = { ...scheduleData };
    delete updatedScheduleData[day][shiftType][subIndex].employee;
    setScheduleData(updatedScheduleData);

    const removedEmployee = scheduleData[day][shiftType][subIndex].employee;

    if (removedEmployee && removedEmployee.name === "Alice") {
      setTotalPreference((prev) => prev - 50);
    } else if (removedEmployee && removedEmployee.name === "Bob") {
      setTotalPreference((prev) => prev - 30);
    } else if (removedEmployee && removedEmployee.name === "John") {
      setTotalPreference((prev) => prev - 70);
    }
  };

  // Überprüfung des Status der Tabelle
  useEffect(() => {
    let remaining = 0;

    Object.values(scheduleData).forEach((day) => {
      Object.values(day).forEach((shift) => {
        remaining += shift.filter(
          (cell) => !cell.hasOwnProperty("employee")
        ).length;
      });
    });

    setRemainingCells(remaining);

    setTableStatus(remaining === 0 ? "SOLVED" : "UNSOLVED");
  }, [scheduleData]);

  return (
    <div>
      <h1>EduGame with HTLM5 Drag and Drop API</h1>

      <h3>
        Scheduling Data:
      </h3>

      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <h4>Max Shifts </h4>
            <table className="table table-sm table-info">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Max Shifts Allowed</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.name}</td>
                    <td>{maxShifts[employee.employeeID]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-2">
            <h4>Min Shifts</h4>
            <table className="table table-sm table-info">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Min Shifts Allowed</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.name}</td>
                    <td>{minShifts[employee.employeeID]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <h4>Qualification</h4>
            <table className="table table-sm table-info">
              <thead>
                <tr>
                  <th>Employee (Skill-Level 1-3)</th>
                  <th>Skill-Level for Job 1</th>
                  <th>Skill-Level for Job 2</th>
                  <th>Skill-Level for Job 3</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(qualification).map((employeeID, rowIndex) => {
                  const employee = employees.find(
                    (emp) => emp.employeeID === employeeID
                  );
                  return (
                    <tr key={rowIndex}>
                      <td>{employee ? employee.name : employeeID}</td>
                      {Object.values(qualification[employeeID]).map(
                        (qual, cellIndex) => (
                          <td key={cellIndex}>{qual}</td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-2">
            <h4>Job Preference</h4>
            <table className="table table-sm table-info">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Preference for Job 1</th>
                  <th>Preference for Job 2</th>
                  <th>Preference for Job 3</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(jobPreference).map((employeeID, rowIndex) => {
                  const employee = employees.find(
                    (emp) => emp.employeeID === employeeID
                  );
                  return (
                    <tr key={rowIndex}>
                      <td>{employee ? employee.name : employeeID}</td>
                      {Object.values(jobPreference[employeeID]).map(
                        (pref, cellIndex) => (
                          <td key={cellIndex}>{pref}</td>
                        )
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h4>Availability</h4>
            <table className="table table-sm table-info">
              <thead>
                <tr>
                  <th>Shift Type</th>
                  {Object.keys(availability).map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["EarlyShift", "LateShift"].map((shiftType) => (
                  <tr key={shiftType}>
                    <td>{shiftType}</td>
                    {Object.keys(availability).map((day) => (
                      <td key={day}>
                        <div>
                          {Object.entries(availability[day][shiftType]).map(
                            ([employeeID, isAvailable]) => {
                              const employee = employees.find(
                                (emp) => emp.employeeID === employeeID
                              );
                              return (
                                <div
                                  key={employeeID}
                                  className="badge badge-secondary mb-1"
                                  style={{
                                    border: "1px solid black",
                                    color: "black",
                                  }}
                                >
                                  {employee
                                    ? `${employee.name}: ${isAvailable}`
                                    : `${employeeID}: ${isAvailable}`}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h4>
        Drag and drop the employees into the shift placeholders to assign them a
        shift.
        <br></br>
        Assign all cells properly in order to solve the game!
      </h4>

      <div className="employee-box">
        {employees.map((employee) => (
          <div
            key={employee.employeeID}
            className="employee-kiosk"
            draggable
            onDragStart={(e) => handleDragStart(e, employee)}
          >
            {"E: " + employee.name}
          </div>
        ))}
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Shifts</th>
            <th>Job-Description</th>
            {weekdays.map((weekday) => (
              <th key={weekday}>{weekday}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shiftTypes.map((shiftType) => (
            <tr key={shiftType}>
              <td className="align-middle">{shiftType}</td>
              <td>
                {Object.values(jobDescriptions).map((job, index) => (
                  <div
                    key={index}
                    className="subcell bg-light p-2 rounded mb-1"
                  >
                    {"Job " + index + ":\n" + job}
                  </div>
                ))}
              </td>
              {weekdays.map((weekday) => (
                <td key={weekday}>
                  {scheduleData[weekday][shiftType].map(
                    (subShift, subIndex) => (
                      <div
                        key={subIndex}
                        className="subcell bg-light p-2 rounded mb-1"
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={(e) =>
                          handleDrop(e, weekday, shiftType, subIndex)
                        }
                      >
                        {subShift.employee && `E: ${subShift.employee.name}`}
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() =>
                            handleRemoveFromShift(weekday, shiftType, subIndex)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div
              className={`alert ${
                tableStatus === "SOLVED" ? "alert-success" : "alert-danger"
              } mb-4`}
              role="alert"
            >
              <strong>Status: </strong>
              {tableStatus}
            </div>
            <small className="text-muted">
              {remainingCells} Cell(s) to be filled
            </small>
          </div>
          <div className="col-md-6 text-right">
            <div className="alert alert-info" role="alert">
              <strong>Total Preference: </strong> {totalPreference}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint1 ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 1:</strong>
              <br></br>
              Max. 1 Job per shift
            </div>
          </div>

          <div className="col-md-4">
            <div
              className={`alert ${
                constraint2 ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 2:</strong>
              <br></br>1 shift at a time
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint3 ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 3:</strong>
              <br></br>
              Max. 10 shifts per week
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint4 ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 4:</strong>
              <br></br>
              Min. skill qualification
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint5 ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 5:</strong>
              <br></br>
              Respect Availabilities!
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint6 ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 6:</strong>
              <br></br>
              Rotate shifts between employees
            </div>
          </div>
        </div>
      </div>
    </div> /* end div */
  );
}

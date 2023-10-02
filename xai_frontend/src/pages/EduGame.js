import React, { useState, useEffect, useCallback } from "react";
import "./EduGame.css";
import "bootstrap/dist/css/bootstrap.min.css";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shiftTypes = ["DayShift"]; //to simplify the EduGame, we just use one single shift

const jobDescriptions = {
  0: "Forklift",
  1: "Sorting",
  2: "Picking",
};

const staticShiftData = {
  Monday: { DayShift: [{}, {}, {}] },
  Tuesday: { DayShift: [{}, {}, {}] },
  Wednesday: { DayShift: [{}, {}, {}] },
  Thursday: { DayShift: [{}, {}, {}] },
  Friday: { DayShift: [{}, {}, {}] },
};

//Problem data
// Max Shifts und Min Shifts
const maxShifts = { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 };
const minShifts = { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1 };

const availability = {
  Monday: { DayShift: { 1: 0, 2: 1, 3: 1, 4: 0, 5: 1 } },
  Tuesday: { DayShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 } },
  Wednesday: { DayShift: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 } },
  Thursday: { DayShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 } },
  Friday: { DayShift: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 1 } },
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
  const [allConstraintsStatus, setAllConstraintsStatus] = useState({});

  //Constraints verletzt? false = unverletzt, grün | true = verletzt, rot
  const [constraint1Violated, setConstraint1] = useState(false); //No employee may work more than 1 shift per day.
  const [constraint2Violated, setConstraint2] = useState(true); //A job is to be done by exactly 1 employee.
  const [constraint3Violated, setConstraint3] = useState(true); //Min. and max. working times (number of shifts) must be complied with!
  const [constraint4Violated, setConstraint4] = useState(true); //An employee must meet the qualifications for a job.
  const [constraint5Violated, setConstraint5] = useState(true); //Availabilities of an employee must be respected.

  const handleDragStart = (event, employee) => {
    event.dataTransfer.setData("employee", JSON.stringify(employee));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const changeConstraintBoxColors = (constraintFlags) => {
    console.log("Constraint box colour change triggered!");
    setConstraint1(constraintFlags.constraint1Violated);
    setConstraint2(constraintFlags.constraint2Violated);
    setConstraint3(constraintFlags.constraint3Violated);
    setConstraint4(constraintFlags.constraint4Violated);
    setConstraint5(constraintFlags.constraint5Violated);
  };

  //TODO
  const checkHardConstraints = (updatedScheduleData) => {
    let allConstraintsStatus = {}; // Hier werden wir detaillierte Informationen speichern

    let constraintStatusReturn = {
      constraint1Violated: false,
      constraint2Violated: false,
      constraint3Violated: true,
      constraint4Violated: false,
      constraint5Violated: false,
    };

    Object.keys(updatedScheduleData).forEach((day) => {
      allConstraintsStatus[day] = {};
      Object.keys(updatedScheduleData[day]).forEach((shiftType) => {
        allConstraintsStatus[day][shiftType] = [];
        updatedScheduleData[day][shiftType].forEach((shift, subIndex) => {
          const employee = shift.employee;
          const constraintStatus = {
            constraint1Violated: true,
            constraint2Violated: false,
            constraint3Violated: true,
            constraint4Violated: true,
            constraint5Violated: false,
          };

          if (employee) {
            // Überprüfung von Constraint 1

            /*           // Überprüfung von Constraint 2
          if (!checkConstraint2(updatedScheduleData)) {
            constraintStatus.constraint2Violated = true;
            constraintStatusReturn.constraint2Violated = true;
          } */

            // Überprüfung von Constraint 3

            // Überprüfung von Constraint 4

            // Überprüfung von Constraint 5
            if (!isEmployeeAvailable(employee, day)) {
              constraintStatus.constraint5Violated = true;
              constraintStatusReturn.constraint5Violated = true;
            }
          }
          allConstraintsStatus[day][shiftType].push(constraintStatus);
        });
      });
    });

    // Überprüfung von Constraint 2 - außerhalb der Schleife
    if (!checkConstraint2(updatedScheduleData)) {
      console.log("IN CHECKCONSTRAINT2 checkHardConstraints()");
      constraintStatusReturn.constraint2Violated = true;
    }

    console.log("allConstraintsStatus");
    console.log(allConstraintsStatus);
    setAllConstraintsStatus(allConstraintsStatus);
    return constraintStatusReturn;
  };

  /*    // Überwachung von Änderungen in scheduleData
    useEffect(() => {
      const updatedConstraintsStatus = checkHardConstraints(scheduleData);
      setAllConstraintsStatus(updatedConstraintsStatus);
    }, [scheduleData, checkHardConstraints]); // Abhängigkeitsarray */

  const isEmployeeAvailable = (employee, day) => {
    // Verfügbarkeitsdaten sollten in einem Zustand oder einer anderen Datenstruktur gespeichert sein.
    // Zugriff auf die Verfügbarkeitsdaten für den betreffenden Mitarbeiter und Tag.
    const availabilityData = availability[day]["DayShift"][employee.employeeID];
    if (availabilityData === 1) {
      return true;
    } else {
      return false;
    }
  };

  //check if schedule is complete
  const checkConstraint2 = (updatedScheduleData) => {
    for (const day in updatedScheduleData) {
      for (const shiftType in updatedScheduleData[day]) {
        for (const subShift in updatedScheduleData[day][shiftType]) {
          const employee =
            updatedScheduleData[day][shiftType][subShift].employee;
          console.log("employee checkConstraint2");
          console.log(employee);
          if (!employee) {
            console.log("if-Bedingung erreicht!");
            return false; // Constraint verletzt, da kein Mitarbeiter zugeordnet ist
          }
        }
      }
    }
    return true; // Alle Jobs haben genau einen Mitarbeiter
  };

  const handleDrop = (event, day, shiftType, subIndex) => {
    event.preventDefault();
    const employee = JSON.parse(event.dataTransfer.getData("employee"));
    const updatedScheduleData = { ...scheduleData };
    updatedScheduleData[day][shiftType][subIndex].employee = employee;
    setScheduleData(updatedScheduleData); //Erst aktualisieren!

    // Überprüfung der Hard Constraints
    const constraintsStatus = checkHardConstraints(scheduleData);

    // Zugriff auf die Präferenzpunkte aus der jobPreference-Matrix
    const employeeID = parseInt(employee.employeeID);
    const preferencePoints = jobPreference[employeeID]
      ? jobPreference[employeeID][subIndex]
      : 0;

    // Präferenzpunkte aktualisieren
    setTotalPreference((prev) => prev + preferencePoints);

    // Constraints nach Prüfung aktualisieren
    setConstraint1(constraintsStatus.constraint1Violated);
    setConstraint2(constraintsStatus.constraint2Violated);
    setConstraint3(constraintsStatus.constraint3Violated);
    setConstraint4(constraintsStatus.constraint4Violated);
    setConstraint5(constraintsStatus.constraint5Violated);
  };

  const handleRemoveFromShift = (day, shiftType, subIndex) => {
    const updatedScheduleData = { ...scheduleData };

    // Speichere den entfernten Mitarbeiter für spätere Verwendung
    const removedEmployee =
      updatedScheduleData[day][shiftType][subIndex].employee;

    // Entferne den Mitarbeiter aus dem Zeitplan
    delete updatedScheduleData[day][shiftType][subIndex].employee;
    setScheduleData(updatedScheduleData);

    // Zugriff auf die Präferenzpunkte aus der jobPreference-Matrix
    if (removedEmployee) {
      const employeeID = parseInt(removedEmployee.employeeID); // Angenommen, employeeID ist ein String und muss in einen Integer umgewandelt werden
      const preferencePointsToSubtract = jobPreference[employeeID]
        ? jobPreference[employeeID][subIndex]
        : 0; // Standardmäßig 0, wenn keine Präferenzpunkte vorhanden sind

      changeConstraintBoxColors(checkHardConstraints(scheduleData)); //Constraint-boxes farblich updaten!

      // Subtrahiere die Präferenzpunkte
      setTotalPreference((prev) => prev - preferencePointsToSubtract);
    }
  };

  // Überprüfung des Status der Tabelle
  useEffect(() => {
    let remaining = 0;

    // Überprüfung der verbleibenden Zellen
    Object.values(scheduleData).forEach((day) => {
      Object.values(day).forEach((shift) => {
        remaining += shift.filter(
          (cell) => !cell.hasOwnProperty("employee")
        ).length;
      });
    });

    // Überprüfung der Constraints
    const allConstraintsMet = !(
      constraint1Violated ||
      constraint2Violated ||
      constraint3Violated ||
      constraint4Violated ||
      constraint5Violated
    );

    setRemainingCells(remaining);

    // Aktualisierung des Tischstatus
    setTableStatus(
      remaining === 0 && allConstraintsMet ? "SOLVED" : "UNSOLVED"
    );
  }, [
    scheduleData,
    constraint1Violated,
    constraint2Violated,
    constraint3Violated,
    constraint4Violated,
    constraint5Violated,
  ]);

  return (
    <div>
      <h1>EduGame with HTLM5 Drag and Drop API</h1>

      <h3>Scheduling Data:</h3>

      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>Minimum and maximum working times (number of shifts)</h4>
            <table className="table table-sm table-info">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Min Shifts Allowed</th>
                  <th>Max Shifts Allowed</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td>{employee.name}</td>
                    <td>{minShifts[employee.employeeID]}</td>
                    <td>{maxShifts[employee.employeeID]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*           <div className="col-md-4">
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
          </div> */}
          <div className="col-md-2">
            <h4>Job Preferences</h4>
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
                  {Object.keys(availability).map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.keys(availability).map((day) => (
                    <td key={day}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {Object.entries(availability[day]["DayShift"]).map(
                          ([employeeID, isAvailable]) => {
                            const employee = employees.find(
                              (emp) => emp.employeeID === employeeID
                            );
                            const availabilityText =
                              isAvailable === 1 ? "available" : "not available";
                            const cellColor =
                              isAvailable === 1 ? "lightgreen" : "orange"; // Bedingte Zuweisung der Farbe
                            return (
                              <div
                                key={employeeID}
                                className="badge badge-secondary mb-1"
                                style={{
                                  border: "1px solid black",
                                  color: "black",
                                  backgroundColor: cellColor, // Hinzugefügt hier
                                }}
                              >
                                {employee
                                  ? `${employee.name}: ${availabilityText}`
                                  : `${employeeID}: ${availabilityText}`}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
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
            <th>Job-Description</th>
            {weekdays.map((weekday) => (
              <th key={weekday}>{weekday}</th>
            ))}
          </tr>
        </thead>

        {/*      <tbody>
          {shiftTypes.map((shiftType) => (
            <tr key={shiftType}>
              <td>
                {Object.values(jobDescriptions).map((job, index) => (
                  <div
                    key={index}
                    className="subcell bg-light p-2 rounded mb-1"
                  >
                    {"Job " + (index + 1) + ":\n" + job}
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
        </tbody> */}

        {/* Stellen Sie sicher, dass allConstraintsStatus vorher berechnet wurde */}
        {shiftTypes.map((shiftType) => (
          <tr key={shiftType}>
            <td>
              {Object.values(jobDescriptions).map((job, index) => (
                <div key={index} className="subcell bg-light p-2 rounded mb-1">
                  {"Job " + (index + 1) + ":\n" + job}
                </div>
              ))}
            </td>
            {weekdays.map((weekday) => (
              <td key={weekday}>
                {scheduleData[weekday][shiftType].map((subShift, subIndex) => {
                  const constraintStatus = allConstraintsStatus[weekday];
                  const isViolated =
                    constraintStatus["DayShift"][subIndex][
                      "constraint5Violated"
                    ]; // Beispiel für Constraint 5
                  /*          console.log("isViolated");
          console.log(isViolated);
          console.log("constraintStatus[DayShift][subIndex][constraint5Violated]");
          console.log(constraintStatus["DayShift"][subIndex][constraint5Violated]); */
                  const className = isViolated
                    ? "bg-danger p-2 rounded mb-1"
                    : "bg-light p-2 rounded mb-1";

                  return (
                    <div
                      key={subIndex}
                      className={className} // Dynamische Klasse basierend auf dem Constraint-Status
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
                  );
                })}
              </td>
            ))}
          </tr>
        ))}
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
                constraint1Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 1:</strong>
              <br></br>
              No employee may work more than 1 shift per day.
            </div>
          </div>

          <div className="col-md-4">
            <div
              className={`alert ${
                constraint2Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 2:</strong>
              <br></br>A job is to be done by exactly 1 employee.
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint3Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 3:</strong>
              <br></br>
              Min. and max. working times (number of shifts) must be complied
              with!
            </div>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-md-4">
            <div
              className={`alert ${
                constraint4Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 4:</strong>
              <br></br>
              An employee must meet the qualifications for a job.
            </div>
          </div> */}
          <div className="col-md-4">
            <div
              className={`alert ${
                constraint5Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 5:</strong>
              <br></br>
              Availabilities of an employee must be respected.
            </div>
          </div>
          {/*           <div className="col-md-4">
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
          </div> */}
        </div>
      </div>
    </div> /* end div */
  );
}

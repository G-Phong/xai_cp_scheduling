import React, { useState, useEffect } from "react";
import "./EduGame.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  optimalShiftData1,
  optimalShiftData2,
  optimalShiftData3,
  totalPreference1,
  totalPreference2,
  totalPreference3,
} from "./EduGame_Solutions.js";

import {
  initialAllConstraintStatus,
  workingHoursData,
  weekdays,
  shiftTypes,
  jobDescriptions,
  staticShiftData,
  maxShifts,
  minShifts,
  availability,
  jobPreference,
  employees,
} from "./EduGame_data.js";

import GaugeChart from "react-gauge-chart";

export default function EduGame() {
  const [scheduleData, setScheduleData] = useState(staticShiftData);
  const [tableStatus, setTableStatus] = useState("UNSOLVED");
  const [remainingCells, setRemainingCells] = useState(0);
  const [totalPreference, setTotalPreference] = useState(0);
  const [allConstraintsStatus, setAllConstraintsStatus] = useState(
    initialAllConstraintStatus
  );
  const [currentData, setCurrentData] = useState(optimalShiftData1);
  const [currentTotalPreference, setCurrentTotalPreference] =
    useState(totalPreference1);

  const [isExpanded, setIsExpanded] = useState(false);

  // Constraints violated? false = not violated, green | true = violated, red
  const [constraint1Violated, setConstraint1] = useState(false); //No employee may work more than 1 shift per day.
  const [constraint2Violated, setConstraint2] = useState(true); //A job is to be done by exactly 1 employee.
  const [constraint3Violated, setConstraint3] = useState(true); //Min. and max. working times (number of shifts) must be complied with!
  const [constraint4Violated, setConstraint4] = useState(true); //An employee must meet the qualifications for a job.
  const [constraint5Violated, setConstraint5] = useState(true); //Availabilities of an employee must be respected.

  const [shiftCounts, setShiftCounts] = useState({
    John: 0,
    Alice: 0,
    Bob: 0,
    Emily: 0,
    Franck: 0,
  });

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

    // Check Hard Constraints and get the result once
    const constraintsStatus = checkHardConstraints(updatedScheduleData);

    const employeeID = parseInt(employee.employeeID);
    const preferencePoints = jobPreference[employeeID]?.[subIndex] || 0; // Use optional chaining

    // Update preference points
    setTotalPreference((prev) => prev + preferencePoints);

    // Update Constraints
    setConstraint1(constraintsStatus.constraint1Violated);
    setConstraint2(constraintsStatus.constraint2Violated);
    setConstraint3(constraintsStatus.constraint3Violated);
    setConstraint4(constraintsStatus.constraint4Violated);
    setConstraint5(constraintsStatus.constraint5Violated);

    // Calculate the new shift count for the employee
    /* const updatedShiftCount =
      updatedScheduleData[day][shiftType].filter(
        (subShift) => subShift.employee
      )?.length || 0;
 */

    /* const updatedShiftCount = updatedScheduleData[day][shiftType].filter(
      (subShift) => subShift.employee?.employeeID === employee.employeeID
    ).length; */

    /* WORKING CODE BELOW!!! */

    /* console.log("updatedScheduleData");
    console.log(updatedScheduleData);
    console.log("employeeID");
    console.log(employeeID);

    // Calculate the new total shift count for the employee across all days
    const updatedShiftCount = weekdays.reduce((totalShiftCount, day) => {
      const dayShifts = updatedScheduleData[day]["DayShift"];
      const dayShiftCountForEmployee = dayShifts.reduce((count, subShift) => {
        const employeeName = subShift.employee?.name;
        return employeeName === employee.name ? count + 1 : count;
      }, 0);
      return totalShiftCount + dayShiftCountForEmployee;
    }, 0);

    window.alert(updatedShiftCount);

    // Update the shift count for the employee in the shiftCounts object
    setShiftCounts((prevShiftCounts) => ({
      ...prevShiftCounts,
      [employee.name]: updatedShiftCount,
    })); */
  };

  const handleRemoveFromShift = (day, shiftType, subIndex) => {
    const updatedScheduleData = { ...scheduleData };
    const removedEmployee =
      updatedScheduleData[day][shiftType][subIndex].employee;

    // Remove the employee from the schedule
    delete updatedScheduleData[day][shiftType][subIndex].employee;
    setScheduleData(updatedScheduleData);

    if (removedEmployee) {
      const employeeID = parseInt(removedEmployee.employeeID);
      const preferencePointsToSubtract =
        jobPreference[employeeID]?.[subIndex] || 0;

      // Update constraint box colors
      changeConstraintBoxColors(checkHardConstraints(updatedScheduleData));

      // Subtract preference points
      setTotalPreference((prev) => prev - preferencePointsToSubtract);
    }
  };

  const changeConstraintBoxColors = (constraintFlags) => {
    console.log("Constraint box colour change triggered!");
    setConstraint1(constraintFlags.constraint1Violated);
    setConstraint2(constraintFlags.constraint2Violated);
    setConstraint3(constraintFlags.constraint3Violated);
    setConstraint4(constraintFlags.constraint4Violated);
    setConstraint5(constraintFlags.constraint5Violated);
  };

  const checkHardConstraints = (updatedScheduleData) => {
    let allConstraintsStatus = {};

    let constraintStatusReturn = {
      constraint1Violated: false,
      constraint2Violated: false,
      constraint3Violated: false,
      constraint4Violated: false,
      constraint5Violated: false,
    };

    Object.keys(updatedScheduleData).forEach((day) => {
      allConstraintsStatus[day] = {};
      Object.keys(updatedScheduleData[day]).forEach((shiftType) => {
        allConstraintsStatus[day][shiftType] = [];
        updatedScheduleData[day][shiftType].forEach((shift, subIndex) => {
          const employee = shift.employee;

          //Dictionary to be returned from the function
          const constraintStatus = {
            constraint1Violated: false,
            constraint2Violated: false,
            constraint3Violated: false,
            constraint5Violated: false,
          };

          if (employee) {
            //  Checking Constraint 3
            if (!checkConstraint3(updatedScheduleData)) {
              console.log("IN CHECKCONSTRAINT3 checkHardConstraints()");
              constraintStatus.constraint3Violated = true;
              constraintStatusReturn.constraint3Violated = true;
            }

            // Checking Constraint 5
            if (!isEmployeeAvailable(employee, day)) {
              constraintStatus.constraint5Violated = true;
              constraintStatusReturn.constraint5Violated = true;
            }
          }
          allConstraintsStatus[day][shiftType].push(constraintStatus);
        });
      });
    });

    // Checking Constraint 1 - outside the loop
    if (!checkConstraint1(updatedScheduleData)) {
      console.log("IN CHECKCONSTRAINT1 checkHardConstraints()");
      constraintStatusReturn.constraint1Violated = true;
      console.log(constraintStatusReturn);
    }

    // Checking Constraint 2 - outside the loop
    if (!checkConstraint2(updatedScheduleData)) {
      console.log("IN CHECKCONSTRAINT2 checkHardConstraints()");
      constraintStatusReturn.constraint2Violated = true;
    }

    console.log("allConstraintsStatus checkHardConstraints()");
    console.log(allConstraintsStatus);
    setAllConstraintsStatus(allConstraintsStatus);
    return constraintStatusReturn;
  };

  const isEmployeeAvailable = (employee, day) => {
    // Availability data should be stored in a state or another data structure.
    // Access availability data for the specific employee and day.
    const availabilityData = availability[day]["DayShift"][employee.employeeID];
    if (availabilityData === 1) {
      return true;
    } else {
      return false;
    }
  };

  const checkConstraint1 = (updatedScheduleData) => {
    const employeeJobCounts = {};
    let constraintViolated = false; // Flag to monitor violation status

    Object.keys(updatedScheduleData).some((day) => {
      return Object.keys(updatedScheduleData[day]).some((shiftType) => {
        return updatedScheduleData[day][shiftType].some((shift) => {
          const employee = shift.employee;
          if (employee) {
            if (!employeeJobCounts[day]) {
              employeeJobCounts[day] = {};
            }
            if (!employeeJobCounts[day][employee.name]) {
              employeeJobCounts[day][employee.name] = 0;
            }
            employeeJobCounts[day][employee.name] += 1;

            if (employeeJobCounts[day][employee.name] > 1) {
              constraintViolated = true;
              return true; // The .some() method will exit when `true` is returned
            }
          }
          return false;
        });
      });
    });

    return !constraintViolated; // Return the inverse of the flag, as the question is whether the constraint is NOT violated
  };

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

  const checkConstraint3 = (updatedScheduleData) => {
    // Object to store the number of shifts per employee
    // Initializing employee IDs from 1 to 5 with 0
    const employeeShiftCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let constraintViolated = false;

    // Iterate through all days and shifts to count the number of shifts for each employee
    Object.values(updatedScheduleData).forEach((day) => {
      Object.values(day).forEach((shift) => {
        shift.forEach((cell) => {
          const employee = cell.employee;
          if (employee) {
            if (!employeeShiftCounts[employee.employeeID]) {
              employeeShiftCounts[employee.employeeID] = 0;
            }
            employeeShiftCounts[employee.employeeID] += 1;
          }
        });
      });
    });

    console.log("employeeShiftCounts");
    console.log(employeeShiftCounts);

    console.log("minShifts");
    console.log(minShifts);

    console.log("maxShifts");
    console.log(maxShifts);

    // Check the minimum and maximum shift constraints for each employee
    Object.keys(employeeShiftCounts).forEach((employeeId) => {
      const count = employeeShiftCounts[employeeId];
      const min = minShifts[employeeId];
      const max = maxShifts[employeeId];

      if (count < min || count > max) {
        constraintViolated = true;
        console.log("constraint 3 violated!!");
      }
    });

    return !constraintViolated;
  };

  const showSolution = (optimalShiftData, totalPreferenceValue) => {
    if (tableStatus === "UNSOLVED") {
      alert(
        "Solve the game first, then have a look at the AI-generated solutions!"
      );
      return;
    }
    setCurrentData(optimalShiftData);
    setCurrentTotalPreference(totalPreferenceValue);
  };

  const getColorForArcs = (minShifts, maxShifts) => {
    const colors = [];

    console.log("minShifts");
    console.log(minShifts);
    console.log("maxShifts");
    console.log(maxShifts);
    console.log();

    // Add red arcs for values less than minShifts
    for (let i = 0; i < minShifts; i++) {
      colors.push("red");
    }

    // Add green arcs for values between minShifts and maxShifts
    for (let i = minShifts; i <= maxShifts; i++) {
      colors.push("green");
    }

    // Add red arcs for values greater than maxShifts
    for (let i = maxShifts + 1; i <= 9; i++) {
      colors.push("red");
    }

    console.log("colors:");
    console.log(colors);

    return colors;
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // The empty array ensures it only runs once on mount

  useEffect(() => {
    let remaining = 0;

    // Calculate remaining cells
    Object.values(scheduleData).forEach((day) => {
      Object.values(day).forEach((shift) => {
        remaining += shift.filter(
          (cell) => !cell.hasOwnProperty("employee")
        ).length;
      });
    });

    // Check if all constraints are met
    const allConstraintsMet =
      !constraint1Violated &&
      !constraint2Violated &&
      !constraint3Violated &&
      !constraint4Violated &&
      !constraint5Violated;

    setRemainingCells(remaining);

    // Update table status
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

  useEffect(() => {
    if (tableStatus === "SOLVED") {
      setIsExpanded(true);
    }
  }, [tableStatus]);

  useEffect(() => {
    const initialShiftCounts = {};

    for (const employee of employees) {
      initialShiftCounts[employee.name] = 0;
    }

    setShiftCounts(initialShiftCounts);
  }, [employees]);

  // Watch for changes in the scheduleData and update shiftCounts accordingly
  useEffect(() => {
    // Create a function to calculate the shift counts
    const calculateShiftCounts = () => {
      const newShiftCounts = {};

      for (const day of weekdays) {
        for (const shiftType of shiftTypes) {
          for (const subShift of scheduleData[day][shiftType]) {
            const employeeName = subShift.employee?.name;
            if (employeeName) {
              // If an employee is assigned to the subShift, increment their count
              newShiftCounts[employeeName] =
                (newShiftCounts[employeeName] || 0) + 1;
            }
          }
        }
      }

      return newShiftCounts;
    };

    // Calculate the initial shift counts when the component mounts
    setShiftCounts(calculateShiftCounts());
  }, [weekdays, shiftTypes, scheduleData]);

  return (
    <div className="eduGame">
      <h1>Shift Puzzle Game</h1>

      <div className="container-edugame">
        <br />
        <h4>Employees must take a certain amount of shifts:</h4>
        <br />
        <div className="row row-gaugeCharts">
          <div className="col-md-4 ">
            <div className="gauge-charts">
              {workingHoursData.map((user, index) => {
                const { name, minShifts, maxShifts } = user;

                // Get the number of assigned shifts from the state
                const assignedShifts = shiftCounts[name] || 0;

                // Calculate the percent based on assignedShifts and the range
                const percent = assignedShifts / 10;

                // Get the colors based on assignedShifts, minShifts, and maxShifts
                let colors = getColorForArcs(minShifts, maxShifts);

                return (
                  <div key={index}>
                    <h3>{user.name}</h3>
                    <GaugeChart
                      id={`gauge-chart-${index}`}
                      animate={true}
                      animDelay={200}
                      animateDuration={1000}
                      nrOfLevels={10} // Set the number of levels to 10
                      percent={percent}
                      colors={colors}
                      arcWidth={0.2}
                      formatTextValue={(value) =>
                        Math.round(value / 10).toString() + " shift(s)"
                      } // Display integers
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/*           <div className="col-md-4">
            <h2>Employee Job Preferences</h2>
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
          </div> */}
        </div>

        <div className="row-availability">
          <div className="col-md-8">
            <br />
            <br />
            <h4>Consider their availabilities:</h4>
            <br />
            <table className="table table-md table-info">
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
                              isAvailable === 1 ? "Available" : "Not Available";
                            const cellColor =
                              isAvailable === 1 ? "lightgreen" : "orange";
                            return (
                              <div
                                key={employeeID}
                                className="badge badge-secondary mb-1"
                                style={{
                                  border: "1px solid black",
                                  color: "black",
                                  backgroundColor: cellColor,
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

      <div className="row">
        <div className="col text-center">
          <br />
          <h3>
            Drag and Drop the employees below into the Week-Schedule to assign
            them shifts:
          </h3>
        </div>
      </div>

      <div className="employee-box">
        {employees.map((employee) => (
          <div
            key={employee.employeeID}
            className="employee-kiosk"
            draggable
            onDragStart={(e) => handleDragStart(e, employee)}
          >
            {"E: " + employee.name}
            <div>Shifts: {shiftCounts[employee.name]}</div>
          </div>
        ))}
      </div>

      <div className="table-responsive">
  <table className="table table-bordered table-striped table-info">
    <thead className="thead-dark">
      <tr>
        <th className="col-md-1 ">Job-Description</th>
        {weekdays.map((weekday) => (
          <th key={weekday} className="col-1">
            {weekday}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {shiftTypes.map((shiftType) => (
        <tr key={shiftType}>
          <td className="table-info">
            {Object.values(jobDescriptions).map((job, index) => (
              <div
                key={index}
                className="subcell bg-light  p-2 rounded mb-1"
              >
                {job}
              </div>
            ))}
          </td>
          {weekdays.map((weekday) => (
            <td key={weekday} className="col-1">
              {scheduleData[weekday][shiftType].map(
                (subShift, subIndex) => {
                  const constraintStatus = allConstraintsStatus[weekday];
                  const isViolated =
                    constraintStatus["DayShift"][subIndex][
                      "constraint5Violated"
                    ];
                  const className = isViolated
                    ? "bg-danger p-2 rounded mb-1"
                    : "bg-light p-2 rounded mb-1";

                  return (
                    <div
                      key={subIndex}
                      className={className}
                      onDragOver={(e) => handleDragOver(e)}
                      onDrop={(e) =>
                        handleDrop(e, weekday, shiftType, subIndex)
                      }
                    >
                      {subShift.employee && `E: ${subShift.employee.name}`}
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() =>
                          handleRemoveFromShift(
                            weekday,
                            shiftType,
                            subIndex
                          )
                        }
                      >
                        Remove
                      </button>
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


      <div className="container">
        <div className="row mb">
          <div className="col-12">
            <div
              className={`alert ${
                tableStatus === "SOLVED" ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              <strong>Status: </strong>
              {tableStatus}
            </div>
            <small className="text-muted">
              {remainingCells} Cell(s) to be filled
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-right">
            <div className="alert alert-info" role="alert">
              <strong>Total Preference: </strong> {totalPreference}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-3">
            <div
              className={`alert ${
                constraint1Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 1:</strong>
              <br />
              No employee may work more than 1 shift per day.
            </div>
          </div>

          <div className="col-md-3">
            <div
              className={`alert ${
                constraint2Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 2:</strong>
              <br />A job is to be done by exactly 1 employee.
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`alert ${
                constraint3Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 3:</strong>
              <br />
              Min. and max. working times (number of shifts) must be complied
              with!
            </div>
          </div>
          <div className="col-md-3">
            <div
              className={`alert ${
                constraint5Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 5:</strong>
              <br />
              Availabilities of an employee must be respected.
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="row justify-content-center mt-4">
        <div className="col-auto">
          <button
            className={`btn ${
              currentData !== optimalShiftData1
                ? "btn-outline-dark"
                : "btn-primary"
            }`}
            onClick={() => showSolution(optimalShiftData1, totalPreference1)}
          >
            AI solution 1
          </button>
        </div>
        <div className="col-auto">
          <button
            className={`btn ${
              currentData !== optimalShiftData2
                ? "btn-outline-dark"
                : "btn-primary"
            }`}
            onClick={() => showSolution(optimalShiftData2, totalPreference2)}
          >
            AI solution 2
          </button>
        </div>
        <div className="col-auto">
          <button
            className={`btn ${
              currentData !== optimalShiftData3
                ? "btn-outline-dark"
                : "btn-primary"
            }`}
            onClick={() => showSolution(optimalShiftData3, totalPreference3)}
          >
            AI solution 3
          </button>
        </div>
      </div>

      {/* Ausklappbarer Container */}
      {isExpanded && (
        <div className="expandable-container">
          <br></br>
          <h1>
            Congratulations! You solved the puzzle. Now click through the
            AI-generated solutions to compare.
          </h1>

          <div>
            <table className="table  table-bordered table-striped">
              <thead>
                <tr>
                  <th>Job-Description</th>
                  {weekdays.map((weekday) => (
                    <th key={weekday}>{weekday}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
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
                        {currentData[weekday][shiftType].map(
                          (subShift, subIndex) => {
                            const className = "bg-light p-2 rounded mb-1";

                            return (
                              <div key={subIndex} className={className}>
                                {subShift && `E: ${subShift.name}`}
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

            <div className="container">
              <div className="row mb">
                <div className="col-12">
                  <div
                    className={`alert ${
                      tableStatus === "SOLVED"
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                    role="alert"
                  >
                    <strong>Status: </strong>
                    {tableStatus}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 text-right">
                  <div className="alert alert-info" role="alert">
                    <strong>Total Preference: </strong> {currentTotalPreference}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

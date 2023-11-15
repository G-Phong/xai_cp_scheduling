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

  // Zustandsvariablen für den Timer
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [shiftCounts, setShiftCounts] = useState({
    John: 0,
    Alice: 0,
    Bob: 0,
    Emily: 0,
    Franck: 0,
  });

  const [isTableVisible, setTableVisible] = useState(true);

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

  let timerInterval;

  // Startfunktion für den Timer
  const startTimer = () => {
    setIsRunning(true);
    // Start the timer with an interval of 1000 milliseconds (1 second)
    timerInterval = setInterval(updateTimer, 1000);
  };

  // Stopfunktion für den Timer
  const stopTimer = () => {
    setIsRunning(false);
    // Clear the interval if it exists
    clearInterval(timerInterval);
  };

  // Updatefunktion für den Timer
  const updateTimer = () => {
    if (isRunning) {
      setTimer((prevTimer) => prevTimer + 1);
    }
  };

  // Updatefunktion für den Timer
  const resetTimer = () => {
    setTimer(0);
    // Clear the interval if it exists
    clearInterval(timerInterval);
  };

  // Funktion zur Formatierung der Zeit in Minuten und Sekunden
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;
    seconds = Math.round(seconds);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const jumpToSolution = () => {
    // Update the tableStatus state to "SOLVED"
    setTableStatus("SOLVED");
  };

  const toggleTable = () => {
    setTableVisible(!isTableVisible);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    startTimer();
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
      stopTimer();
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

  // Effekt für die Timer-Aktualisierung bei isRunning
  useEffect(() => {
    if (isRunning) {
      updateTimer();
    }
  }, [timer, isRunning]);

  // Effekt für die Timer-Aktualisierung bei Timer-Reset
  useEffect(() => {
    if (!isRunning) {
      setTimer(0); // Reset the timer to 0
    }
  }, [isRunning]);

  return (
    <div className="eduGame">
      <section class="header-section">
        <h1>Shift Puzzle Game 🧩</h1>
        <h4>Solve this puzzle and understand how shift scheduling works.</h4>
      </section>
      <section class="constraints-section">
        <div className="container-edugame">
          <h2>📜 Game Rules 📜</h2>
          <br />
          <h4>
            Your 5 employees must take a certain amount of shifts. Try to be in
            the green area.
          </h4>
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
                        textColor={"white"}
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
          </div>

          <div className="container mt-4 hard-constraints-container">
            <div className="row justify-content-center text-center">
              <br />
              <br />
              <h4>Your company has strict rules. Make sure you follow them.</h4>
              <br />
            </div>

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
                  No employee may work more than one shift per day.
                </div>
              </div>

              {/*   <div className="col-md-3">
            <div
              className={`alert ${
                constraint2Violated ? "alert-danger" : "alert-success"
              }`}
              role="alert"
            >
              <strong>Hard Constraint 2:</strong>
              <br />A job is to be done by exactly 1 employee.
            </div>
          </div> */}
              <div className="col-md-3">
                <div
                  className={`alert ${
                    constraint3Violated ? "alert-danger" : "alert-success"
                  }`}
                  role="alert"
                >
                  <strong>Hard Constraint 2:</strong>
                  <br />
                  An employee's specified workload must be adhered to.
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className={`alert ${
                    constraint5Violated ? "alert-danger" : "alert-success"
                  }`}
                  role="alert"
                >
                  <strong>Hard Constraint 3:</strong>
                  <br />
                  Only assign an employee to a shift if he/she is available.
                </div>
              </div>
            </div>
          </div>

          <div className="row-availability">
            <div className="col-md-8">
              <br />
              <h4>
                Employees can only work at certain times. Consider their
                availabilities.
              </h4>

              <table className="table table-md table-dark">
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
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {Object.entries(availability[day]["DayShift"]).map(
                            ([employeeID, isAvailable]) => {
                              const employee = employees.find(
                                (emp) => emp.employeeID === employeeID
                              );
                              const availabilityText =
                                isAvailable === 1
                                  ? "Available"
                                  : "Not Available";
                              const cellColor =
                                isAvailable === 1 ? "lightgreen" : "darkorange";
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

          <div className="container-challenge">
            <h2>
              ⬇️ Need an extra challenge? Consider employee preferences! ⬇️
            </h2>
            <button
              className="btn btn-primary btn-sm rounded mb-4"
              onClick={toggleTable}
            >
              {isTableVisible ? "Hide Preferences" : "Show Preferences"}
            </button>
            <br></br>
            {isTableVisible && (
              <div className="col-md-12 d-flex justify-content-md-center">
                <div>
                  <h3>Your employees have specific preferences for jobs.</h3>
                  <table className="table table-success table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Preference for Forklifting</th>
                        <th>Preference for Sorting</th>
                        <th>Preference for Picking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(jobPreference).map(
                        (employeeID, rowIndex) => {
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
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section class="solve-game-section">
        <h2>🎲 Solve the game 🎲</h2>
        <div className="row-solve">
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
              {employee.name}
              {/* <div>Shifts: {shiftCounts[employee.name]}</div> */}
            </div>
          ))}
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped table-info ">
            <thead>
              <tr>
                <th className="col-1">Job-Description</th>
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
                        className="subcell bg-primary p-2 rounded mb-1 d-flex justify-content-center align-items-center"
                        style={{ height: "80px" }}
                      >
                        {job}
                      </div>
                    ))}
                  </td>
                  {weekdays.map((weekday) => (
                    <td key={weekday} className="col-1">
                      {scheduleData[weekday][shiftType].map(
                        (subShift, subIndex) => {
                          const constraintStatus =
                            allConstraintsStatus[weekday];
                          const isViolated =
                            constraintStatus["DayShift"][subIndex][
                              "constraint5Violated"
                            ];

                          let className = "bg-light p-2 rounded mb-1";

                          if (subShift.employee) {
                            className = isViolated
                              ? "bg-danger p-2 rounded mb-1"
                              : "bg-success p-2 rounded mb-1";
                          } else {
                            className += " dotted-border"; // Hier fügen Sie die gestrichelte Border-Klasse hinzu
                          }

                          return (
                            <div
                              key={subIndex}
                              className={className}
                              onDragOver={(e) => handleDragOver(e)}
                              onDrop={(e) =>
                                handleDrop(e, weekday, shiftType, subIndex)
                              }
                              style={{ height: "80px" }}
                            >
                              <div className="tier-one d-flex justify-content-center align-items-center">
                                {subShift.employee
                                  ? subShift.employee.name
                                  : "> Place an Employee here <"}
                              </div>
                              <div className="tier-two">
                                {subShift.employee && (
                                  <button
                                    className="btn btn-sm btn-warning custom-small-button"
                                    /* style={{ width: '7vh', heigth: "1px", lineHeight: '1', fontSize: '0.8rem' }} */
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
                                )}
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

        <div className="edugame-container">
          <div className="row row-status">
            <div className="col-md-9">
              <h4>Progress-Bar: {remainingCells} cell(s) left!</h4>

              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${((15 - remainingCells) / 15) * 100}%`,
                    position: "relative",
                  }}
                  aria-valuenow={15 - remainingCells}
                  aria-valuemin="0"
                  aria-valuemax={15}
                >
                  {Math.round(((15 - remainingCells) / 15) * 100)}%
                </div>
              </div>

              <div className="timer-container">
                <p className="timer-text">
                  This timer measures your solving time:
                </p>
                <div id="timer" className="timer">
                  {formatTime(timer / 60)}
                </div>
                <button
                  className="btn btn-primary btn-sm reset-button"
                  onClick={resetTimer}
                >
                  Reset Timer
                </button>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className={`alert ${
                  tableStatus === "SOLVED" ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                <strong>Puzzle Status: </strong>
                {tableStatus}
                <p className="small">Please comply with all constraints.</p>
              </div>

              <div className="alert alert-primary" role="alert">
                <strong>Preference Score: </strong> {totalPreference}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Buttons */}
      <section class="ai-solutions-section">
        <h2>💻 Solutions 💻 </h2> {/* 🤖 */}
        <div className="row justify-content-center mt-4">
          <h3> Want to know how the AI solves the puzzle? Click below ⬇️ </h3>
        </div>
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
        <div className="row justify-content-center mt-4">
          <div className="col-auto text-center d-flex align-items-center">
            Don't feel like solving the puzzle by yourself?
          </div>
          <div className="col-auto">
            <button
              className="btn btn-info btn-outline-light"
              onClick={jumpToSolution}
            >
              ➡️ Jump directly to the AI solutions
            </button>
          </div>
        </div>
        {/* Ausklappbarer Container */}
        {isExpanded && (
          <div className="expandable-container">
            <br></br>
            <h2>
              Congratulations! You solved the puzzle. Now compare solutions.
            </h2>

            <div>
              <table className="table table-dark table-bordered table-striped">
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
                            className="subcell bg-dark p-2 rounded mb-1"
                          >
                            {job}
                          </div>
                        ))}
                      </td>
                      {weekdays.map((weekday) => (
                        <td key={weekday}>
                          {currentData[weekday][shiftType].map(
                            (subShift, subIndex) => {
                              const className = "bg-dark p-2 rounded mb-1";

                              return (
                                <div key={subIndex} className={className}>
                                  {subShift && `${subShift.name}`}
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

              <div className="container-ai-statistics">
                <p class="solution-time">
                  The AI took less than one second to get this solution and is{" "}
                  {(-100+((currentTotalPreference / totalPreference) * 100)).toFixed(
                    2
                  )}
                  % better in terms of preference satisfaction.
                </p>

                <div className="alert alert-primary" role="alert">
                  <strong>Preference Score: </strong> {currentTotalPreference}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

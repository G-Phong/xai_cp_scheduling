import React, { useState } from "react";
import "./EduGame.css";

//Global variables
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shiftTypes = ["EarlyShift", "LateShift"];

const shiftData = {};

const jobDescriptions = {
  0: "Forklift",
  1: "Sorting",
  2: "Picking",
};

export default function EduGame() {
  const [scheduleData, setScheduleData] = useState([]);
  const [employees, setEmployees] = useState([
    { employeeID: "1", name: "John" },
    { employeeID: "2", name: "Alice" },
    { employeeID: "3", name: "Bob" },
  ]);

  const handleDragStart = (event, employee) => {
    event.dataTransfer.setData("employee", JSON.stringify(employee));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, day, shiftType) => {
    event.preventDefault();
    const employee = JSON.parse(event.dataTransfer.getData("employee"));

    if (scheduleData[day][shiftType].length < 3) {
      const updatedScheduleData = { ...scheduleData };
      updatedScheduleData[day][shiftType].push({ employee });
      setScheduleData(updatedScheduleData);
    }
  };

  const handleRemoveFromShift = (day, shiftType, index) => {
    const updatedScheduleData = { ...scheduleData };
    updatedScheduleData[day][shiftType].splice(index, 1);
    setScheduleData(updatedScheduleData);
  };

  return (
    <div>
      <h1>EduGame with HTML5 DnD-API</h1>

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

      <table>
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
          <tr>
            <td>Day-shift</td>
            <td>Job1</td>
            {weekdays.map((weekday) => (
              <td
                key={weekday}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, weekday, "day")}
              >
                {scheduleData[weekday]["day"].map((shift, index) => (
                  <div key={index} className="subcell">
                    {"E: " + shift.employee.name}
                    <button
                      onClick={() =>
                        handleRemoveFromShift(weekday, "day", index)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>

        <tbody>
          <tr>
            <td>Night-shift</td>
            <td>Job2</td>
            {weekdays.map((weekday) => (
              <td
                key={weekday}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, weekday, "night")}
              >
                {scheduleData[weekday]["night"].map((shift, index) => (
                  <div key={index} className="subcell">
                    {"E: " + shift.employee.name}
                    <button
                      onClick={() =>
                        handleRemoveFromShift(weekday, "night", index)
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

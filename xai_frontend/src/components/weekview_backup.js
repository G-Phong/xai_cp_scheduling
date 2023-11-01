

import React, { useState, useEffect } from "react";
import "./WeekView.css";

function WeekView() {
  const [shiftPlanData, setShiftPlanData] = useState({
    Monday: {
      EarlyShift: [
        {
          employee: 4,
          job: 0,
        },
        {
          employee: 1,
          job: 1,
        },
        {
          employee: 2,
          job: 2,
        },
      ],
      LateShift: [
        {
          employee: 0,
          job: 0,
        },
        {
          employee: 1,
          job: 1,
        },
        {
          employee: 4,
          job: 2,
        },
      ],
    },
    Tuesday: {
      EarlyShift: [
        {
          employee: 0,
          job: 0,
        },
        {
          employee: 4,
          job: 1,
        },
        {
          employee: 1,
          job: 2,
        },
      ],
      LateShift: [
        {
          employee: 0,
          job: 0,
        },
        {
          employee: 4,
          job: 1,
        },
        {
          employee: 2,
          job: 2,
        },
      ],
    },
    Wednesday: {
      EarlyShift: [
        {
          employee: 2,
          job: 0,
        },
        {
          employee: 4,
          job: 1,
        },
        {
          employee: 1,
          job: 2,
        },
      ],
      LateShift: [
        {
          employee: 2,
          job: 0,
        },
        {
          employee: 4,
          job: 1,
        },
        {
          employee: 1,
          job: 2,
        },
      ],
    },
    Thursday: {
      EarlyShift: [
        {
          employee: 2,
          job: 0,
        },
        {
          employee: 0,
          job: 1,
        },
        {
          employee: 4,
          job: 2,
        },
      ],
      LateShift: [
        {
          employee: 3,
          job: 0,
        },
        {
          employee: 1,
          job: 1,
        },
        {
          employee: 2,
          job: 2,
        },
      ],
    },
    Friday: {
      EarlyShift: [
        {
          employee: 3,
          job: 0,
        },
        {
          employee: 0,
          job: 1,
        },
        {
          employee: 4,
          job: 2,
        },
      ],
      LateShift: [
        {
          employee: 3,
          job: 0,
        },
        {
          employee: 0,
          job: 1,
        },
        {
          employee: 4,
          job: 2,
        },
      ],
    },
  });
  const [statistics, setStatistics] = useState({
    num_employees: 5,
    num_jobs: 3,
    num_qualifications: 3,
    num_days: 5,
    num_shifts_per_day: 2,
  });

  return (
    <div>
      <h2>Weekview Work Schedule</h2>
      <ul>
        <li>
          <strong>Detailed Daily Breakdown:</strong> A complete overview of work
          shifts for each weekday.
        </li>
        <li>
          <strong>Two Main Shifts:</strong>
          <ul>
            <li>
              <em>Early Shift</em>
            </li>
            <li>
              <em>Late Shift</em>
            </li>
          </ul>
        </li>
        <li>
          <strong>Employee and Job Details:</strong> For each shift and day
          combination, the Employee-ID and Job-ID are displayed, clarifying who
          is assigned to which job.
        </li>

      </ul>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Early Shift</td>
            {Object.keys(shiftPlanData).map((day) => (
              <td key={day + "-Frühschicht"}>
                {shiftPlanData[day]["EarlyShift"].map((shift, index) => (
                  <div key={day + "-Frühschicht" + index} className="cell">
                    <div className="subcell">
                      {"Employee-ID: " + shift.employee}
                    </div>
                    <div className="subcell">{"Job-ID: " + shift.job}</div>
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            <td>Late Shift</td>
            {Object.keys(shiftPlanData).map((day) => (
              <td key={day + "-Spätschicht"}>
                {shiftPlanData[day]["LateShift"].map((shift, index) => (
                  <div key={day + "-Spätschicht" + index} className="cell">
                    <div className="subcell">
                      {"Employee-ID: " + shift.employee}
                    </div>
                    <div className="subcell">{"Job-ID: " + shift.job}</div>
                  </div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="container mt-4">
        <h2>Statistics</h2>

        <p>
          The Statistics table offers insights into the work schedule's
          composition:
        </p>
        <ul>
          <li>
            <strong>Total Employees:</strong> Indicates the total number of
            employees, with the current value being 5.
          </li>
          <li>
            <strong>Job Varieties:</strong> Shows the distinct number of jobs
            available, currently listed as 3.
          </li>
          <li>
            <strong>Qualification Types:</strong> Reflects the different
            qualifications required for the jobs, presently at 3.
          </li>
          <li>
            <strong>Days Covered:</strong> Represents the number of days in the
            week the schedule covers, which is 5 in this case.
          </li>
          <li>
            <strong>Shift Frequency:</strong> Details the number of shifts in a
            day, with 2 shifts being the current system.
          </li>
        </ul>

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

export default WeekView;

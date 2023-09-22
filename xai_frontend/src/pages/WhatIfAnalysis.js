import React, { useState, useEffect } from "react";
import WeekView2 from "../components/WeekView2.js";
import axios from "axios"; // JavaScript Library for HTTP-requests

// static reference solution
const staticShiftPlan = {
  schedule_data: {
    Monday: {
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
    Tuesday: {
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
          employee: 3,
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
    Friday: {
      EarlyShift: [
        {
          employee: 3,
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
  },
  solution_count: 2,
  statistics: {
    num_employees: 5,
    num_jobs: 3,
    num_qualifications: 3,
    num_days: 5,
    num_shifts_per_day: 2,
  },
};

// static preference matrix
const staticPreferences = [
  [50, 20, 15],
  [0, 100, 50],
  [90, 25, 45],
  [65, 50, 15],
  [50, 50, 60],
];

export default function WhatIfAnalysis() {
  // Status variable for the list of preferences
  const [preferencesList, setPreferencesList] = useState([0, 0, 0]);
  // State variable for the current value
  const [currentValueList, setCurrentValueList] = useState([50, 20, 15]);
  // State variable for the current value (initially identical to staticShiftPlan)
  const [solutionData, setSolutionData] = useState({
    schedule_data: {
      Monday: {
        EarlyShift: [
          { employee: 2, job: 0 },
          { employee: 4, job: 1 },
          { employee: 1, job: 2 },
        ],
        LateShift: [
          { employee: 0, job: 0 },
          { employee: 4, job: 1 },
          { employee: 2, job: 2 },
        ],
      },
      Tuesday: {
        EarlyShift: [
          { employee: 4, job: 0 },
          { employee: 1, job: 1 },
          { employee: 2, job: 2 },
        ],
        LateShift: [
          { employee: 2, job: 0 },
          { employee: 0, job: 1 },
          { employee: 4, job: 2 },
        ],
      },
      Wednesday: {
        EarlyShift: [
          { employee: 2, job: 0 },
          { employee: 4, job: 1 },
          { employee: 1, job: 2 },
        ],
        LateShift: [
          { employee: 3, job: 0 },
          { employee: 4, job: 1 },
          { employee: 1, job: 2 },
        ],
      },
      Thursday: {
        EarlyShift: [
          { employee: 0, job: 0 },
          { employee: 4, job: 1 },
          { employee: 2, job: 2 },
        ],
        LateShift: [
          { employee: 0, job: 0 },
          { employee: 1, job: 1 },
          { employee: 4, job: 2 },
        ],
      },
      Friday: {
        EarlyShift: [
          { employee: 3, job: 0 },
          { employee: 1, job: 1 },
          { employee: 4, job: 2 },
        ],
        LateShift: [
          { employee: 3, job: 0 },
          { employee: 0, job: 1 },
          { employee: 4, job: 2 },
        ],
      },
    },
    solution_count: 5,
    statistics: {
      num_employees: 5,
      num_jobs: 3,
      num_qualifications: 3,
      num_days: 5,
      num_shifts_per_day: 2,
    },
  });

  // State variable (standard)
  const [updatedPreferenceMatrix, setUpdatedPreferenceMatrix] = useState([
    [50, 20, 15],
    [0, 100, 50],
    [90, 25, 45],
    [65, 50, 15],
    [50, 50, 60],
  ]);

  // State variables
  const [sumShiftsPerEmployee, setSumShiftsPerEmployee] = useState({});
  const [individualPreferenceScore, setIndividualPreferenceScore] = useState(
    {}
  );

  // State variable for changed shifts
  const [changedShifts, setChangedShifts] = useState({
    Monday: {
      EarlyShift: [
        { isDifferent: false, job: 0 },
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

  // Function to solve the shift plan with new preferences
  const solveWithPreferences = () => {
    // Insert code here to recalculate the shift plan
    // Use preferencesList to access the new preferences
    // Assumption: You receive the new preference values in preferencesList

    // Update the current values
    setCurrentValueList(preferencesList);

    console.log("Updated preferences list sent!");
    console.log(preferencesList);

    // Send a POST request to the backend
    axios
      .post("http://localhost:5000/solve_shifts_what_if", {
        // Send the preference list as JSON
        job1Preference: preferencesList[0],
        job2Preference: preferencesList[1],
        job3Preference: preferencesList[2],
      })
      .then((response) => {
        // Process the response from the backend
        const solutionData = response.data; // Caution: Local variable!
        setSolutionData(response.data);

        console.log("POST Response Schedule");
        console.log(solutionData);

        // Update state variables with new data
        setSumShiftsPerEmployee(solutionData.sum_shifts_per_employee);
        setIndividualPreferenceScore(solutionData.individual_preference_score);

        // Compare the new solution with the previous one and mark the differences
        const changedShifts = findChangedShifts(staticShiftPlan, solutionData);
        console.log("After changed function:");
        console.log(changedShifts);
        setChangedShifts(changedShifts);

        // Update your UI with the results
        // Example: setSchedule(solutionData);
        console.log("POST request sent! Here are the updated preferences:\n");
        console.log(preferencesList);
        console.log("Backend response after solving:");
        console.log(response);

        if (solutionData == null) {
          console.log("Null Response!");
        } else {
          console.log("Data type of solutionData:", typeof solutionData);
          console.log("Contents of solutionData:", solutionData);
        }
      })
      .catch((error) => {
        // Handle errors if they occur
        console.error("Error sending request to the backend:", error);
      });
  };

  // Function to update preferences in the list
  const updatePreferences = (index, value) => {
    // Convert the value to an integer
    const intValue = parseInt(value);

    const updatedList = [...preferencesList];
    updatedList[index] = intValue;
    setPreferencesList(updatedList);

    // Create a copy of the current updated preference matrix
    const updatedMatrix = [...updatedPreferenceMatrix];

    // Replace the first row of the matrix with the updated preferences
    updatedMatrix[0] = updatedList;

    // Set the updated matrix in the state
    setUpdatedPreferenceMatrix(updatedMatrix);
  };

  /**
   * Compares two shift plans and determines which shifts have changed between them.
   * @param {object} oldShiftPlan - The old shift plan.
   * @param {object} newShiftPlan - The new shift plan.
   * @returns {object} An object containing the found changes in shifts per weekday and shift type.
   */
  function findChangedShifts(oldShiftPlan, newShiftPlan) {
    const changedShifts = {};

    // Check if the input parameters have the required structure
    if (
      oldShiftPlan.schedule_data &&
      newShiftPlan.schedule_data &&
      typeof oldShiftPlan.schedule_data === "object" &&
      typeof newShiftPlan.schedule_data === "object"
    ) {
      // Iterate through weekdays (Monday to Friday)
      const weekdays = Object.keys(oldShiftPlan.schedule_data);
      for (const weekday of weekdays) {
        changedShifts[weekday] = {};

        // Iterate through shift types (MorningShift and EveningShift)
        const shiftTypes = Object.keys(oldShiftPlan.schedule_data[weekday]);
        for (const shiftType of shiftTypes) {
          changedShifts[weekday][shiftType] = [];

          const oldShifts = oldShiftPlan.schedule_data[weekday][shiftType];
          const newShifts = newShiftPlan.schedule_data[weekday][shiftType];

          // Compare shifts in oldShifts and newShifts
          for (let i = 0; i < newShifts.length; i++) {
            const oldShift = oldShifts[i];
            const newShift = newShifts[i];

            // Compare shifts based on Employee and Job
            if (
              oldShift.employee !== newShift.employee ||
              oldShift.job !== newShift.job
            ) {
              changedShifts[weekday][shiftType].push({
                isDifferent: true,
                job: newShift.job,
              });
              /* console.log("oldShift");
              console.log(oldShift);
              console.log("newShift");
              console.log(newShift); */
            } else {
              changedShifts[weekday][shiftType].push({
                isDifferent: false,
                job: newShift.job,
              });
            }
          }
        }
      }
    }
    // Debug output of the found changes
    console.log("changedShifts:", changedShifts);

    return changedShifts;
  }

  return (
    <div className="container">
      <h1>What-If-Analysis</h1>
      <h2>
        Change preferences of Employee 0 here
        <br />
        (0 = no preference, 100 = full preference)
      </h2>
      <div className="row">
        {[0, 1, 2].map((index) => (
          <div className="col-md-4" key={index}>
            <label>Job {index + 1} Preference (1-100):</label>
            <div className="input-group">
              <input
                type="number"
                min="1"
                max="100"
                className="form-control"
                value={preferencesList[index]}
                onChange={(e) => updatePreferences(index, e.target.value)}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  Current Value: {currentValueList[index]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Solve Button */}
      <div className="row">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={solveWithPreferences}>
            Solve
          </button>
        </div>
      </div>

      {/* Weekly View */}
      <WeekView2
        shiftData={solutionData}
        changedShifts={changedShifts}
        staticShiftData={staticShiftPlan} // Static shift plan
        staticPreferenceMatrix={staticPreferences} // Static preference matrix
        updatedPreferenceMatrix={updatedPreferenceMatrix} // Updated preference matrix
        sumShiftsPerEmployee={sumShiftsPerEmployee} // Sum of shifts per employee
        individualPreferenceScore={individualPreferenceScore} // Individual preference score
      />
    </div>
  );
}

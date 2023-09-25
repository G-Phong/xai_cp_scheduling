import React, { useState, useEffect } from "react";
import WeekView2 from "../components/WeekView2.js";
import axios from "axios"; // JavaScript Library for HTTP-requests

// static reference solution
const staticShiftPlan = {
  schedule_data: [
    {
      id: "solution1",
      schedule: {
        Monday: {
          EarlyShift: [
            { employee: 4, job: 0 },
            { employee: 1, job: 1 },
            { employee: 2, job: 2 },
          ],
          LateShift: [
            { employee: 0, job: 0 },
            { employee: 1, job: 1 },
            { employee: 4, job: 2 },
          ],
        },
        Tuesday: {
          EarlyShift: [
            { employee: 0, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
          LateShift: [
            { employee: 0, job: 0 },
            { employee: 4, job: 1 },
            { employee: 2, job: 2 },
          ],
        },
        Wednesday: {
          EarlyShift: [
            { employee: 2, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
          LateShift: [
            { employee: 2, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
        },
        Thursday: {
          EarlyShift: [
            { employee: 2, job: 0 },
            { employee: 0, job: 1 },
            { employee: 4, job: 2 },
          ],
          LateShift: [
            { employee: 3, job: 0 },
            { employee: 1, job: 1 },
            { employee: 2, job: 2 },
          ],
        },
        Friday: {
          EarlyShift: [
            { employee: 3, job: 0 },
            { employee: 0, job: 1 },
            { employee: 4, job: 2 },
          ],
          LateShift: [
            { employee: 3, job: 0 },
            { employee: 0, job: 1 },
            { employee: 4, job: 2 },
          ],
        },
      },
      total_preference: "1750",
    },
    {
      id: "solution2",
      schedule: {
        Monday: {
          EarlyShift: [
            { employee: 2, job: 0 },
            { employee: 1, job: 1 },
            { employee: 4, job: 2 },
          ],
          LateShift: [
            { employee: 0, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
        },
        Tuesday: {
          EarlyShift: [
            { employee: 4, job: 0 },
            { employee: 0, job: 1 },
            { employee: 2, job: 2 },
          ],
          LateShift: [
            { employee: 0, job: 0 },
            { employee: 4, job: 1 },
            { employee: 2, job: 2 },
          ],
        },
        Wednesday: {
          EarlyShift: [
            { employee: 2, job: 0 },
            { employee: 1, job: 1 },
            { employee: 4, job: 2 },
          ],
          LateShift: [
            { employee: 2, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
        },
        Thursday: {
          EarlyShift: [
            { employee: 3, job: 0 },
            { employee: 4, job: 1 },
            { employee: 2, job: 2 },
          ],
          LateShift: [
            { employee: 3, job: 0 },
            { employee: 1, job: 1 },
            { employee: 4, job: 2 },
          ],
        },
        Friday: {
          EarlyShift: [
            { employee: 0, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
          LateShift: [
            { employee: 3, job: 0 },
            { employee: 0, job: 1 },
            { employee: 4, job: 2 },
          ],
        },
      },
      total_preference: "1780",
    },
  ],
  solution_count: 2,
  statistics: {
    num_employees: 5,
    num_jobs: 3,
    num_qualifications: 3,
    num_days: 5,
    num_shifts_per_day: 2,
  },
  sum_shifts_per_employee: { 0: "5", 1: "6", 2: "6", 3: "3", 4: "10" },
  individual_preference_score: {
    0: "190",
    1: "450",
    2: "405",
    3: "195",
    4: "540",
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
  const [solutionData, setSolutionData] = useState(staticShiftPlan);

  // State variable
  const [solutionCount, setSolutionCount] = useState(0);
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
  // State variable
  const [currentSolutionId, setCurrentSolutionId] = useState(0);

  // Function to solve the shift plan with new preferences
  const solveWithPreferences = () => {
    // Use preferencesList to access the new preferences
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
        setSolutionData(response.data);
        setSolutionCount(response.data.solution_count);

        console.log("POST Response Schedule");
        console.log(solutionData);

        // Update state variables with new data
        setSumShiftsPerEmployee(solutionData.sum_shifts_per_employee);
        setIndividualPreferenceScore(solutionData.individual_preference_score);

        // Compare the new solution with the previous one and mark the differences
        console.log("Listenzugriff")
        console.log(solutionData.schedule_data[0].schedule)
        const changedShifts = findChangedShifts(staticShiftPlan.schedule_data[0].schedule, solutionData.schedule_data[0].schedule);
        console.log("After changed function:");
        console.log(changedShifts);
        setChangedShifts(changedShifts);


        if (solutionData == null) {
          console.log("Null Response!");
        } else {
          console.log("Data type of solutionData:", typeof solutionData);
          console.log("Contents of solutionData:", solutionData);
        }

        //DEBUG PRINT
        console.log("DEBUG PRINT");
        console.log(solutionData);
        console.log(changedShifts);
        console.log(staticShiftPlan);
        console.log(staticPreferences);
        console.log(updatedPreferenceMatrix);
        console.log(sumShiftsPerEmployee);
        console.log(individualPreferenceScore);

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
      oldShiftPlan &&
      newShiftPlan &&
      typeof oldShiftPlan === "object" &&
      typeof newShiftPlan === "object"
    ) {
      // Iterate through weekdays (Monday to Friday)
      const weekdays = Object.keys(oldShiftPlan);
      for (const weekday of weekdays) {
        changedShifts[weekday] = {};

        // Iterate through shift types (MorningShift and EveningShift)
        const shiftTypes = Object.keys(oldShiftPlan[weekday]);
        for (const shiftType of shiftTypes) {
          changedShifts[weekday][shiftType] = [];

          const oldShifts = oldShiftPlan[weekday][shiftType];
          const newShifts = newShiftPlan[weekday][shiftType];

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
    else{console.log("ELSE BLOCK")}
    // Debug output of the found changes
    console.log("changedShifts:", changedShifts);

    return changedShifts;
  }

  const toggleSolution = () => {
    setCurrentSolutionId((prevId) => (prevId + 1) % solutionCount);
  };

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

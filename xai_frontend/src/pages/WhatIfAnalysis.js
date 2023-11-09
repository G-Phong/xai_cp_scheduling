import React, { useState, useEffect } from "react";

import axios from "axios"; // JavaScript Library for HTTP-requests

import { ResponsiveContainer } from "recharts";
import RadarPlot from "../components/RadarPlot";

import WeekView2 from "../components/WeekView2.js";
import { staticShiftPlan, staticPreferences } from "./staticData.js";

import AI_icon from "../Img/ai.png"; // Adjust the path to your icon file

import "./WhatIfAnalysis.css";

export default function WhatIfAnalysis() {
  // Status variable for the list of preferences
  const [preferencesList, setPreferencesList] = useState([50, 50, 50]);
  // State variable for the current value
  const [currentValueList, setCurrentValueList] = useState([50, 20, 15]);
  // State variable for the current value (initially identical to staticShiftPlan)
  const [solutionData, setSolutionData] = useState(staticShiftPlan);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // The empty array ensures it only runs once on mount

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

  //My personal preferences
  const [yourPreferences, setYourPreferences] = useState([
    { subject: "Forklift", You: 50 },
    { subject: "Sorting", You: 50 },
    { subject: "Picking", You: 50 },
  ]);

  // Function to update your preferences based on the slider values
  const updateYourPreferences = () => {
    const newPreferences = preferencesList.map((value, index) => ({
      subject: yourPreferences[index].subject,
      You: parseInt(value),
    }));
    setYourPreferences(newPreferences);
  };

  useEffect(() => {
    updateYourPreferences(); // Update your preferences when sliders change
  }, [preferencesList]);

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
        console.log("Listenzugriff");
        console.log(solutionData.schedule_data[0].schedule);
        const changedShifts = findChangedShifts(
          staticShiftPlan.schedule_data[0].schedule,
          solutionData.schedule_data[0].schedule
        );
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

    console.log("Preferences list updated!:");
    console.log(preferencesList);
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
    } else {
      console.log("ELSE BLOCK");
    }
    // Debug output of the found changes
    console.log("changedShifts:", changedShifts);

    return changedShifts;
  }

  const toggleSolution = () => {
    setCurrentSolutionId((prevId) => (prevId + 1) % solutionCount);
  };

  // Initialize checkboxes with false as default value
  let checkboxStatuses = new Array(10).fill(false);

  return (
    <div className="container-what-if">
      <h1>What-If-Scenarios</h1>
      <div className="row"> 
      {/*first column*/}
      <div className="col-md-6 centered-flex full-height">
      <div className="availability-mask">
        <h2>
          When are you available? <br />
        </h2>

        <div className="row-availability">
          <div className="col-4">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Shift Type</th>
                  <th scope="col">Monday</th>
                  <th scope="col">Tuesday</th>
                  <th scope="col">Wednesday</th>
                  <th scope="col">Thursday</th>
                  <th scope="col">Friday</th>
                </tr>
              </thead>

              <tbody>
                <tr key="Early Shift">
                  <td>
                    Early Shift <br /> 06.00 - 14.00
                  </td>
                  {[...Array(5)].map((_, index) => (
                    <td key={index}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`Early-Shift-${index}`}
                          defaultChecked={false}
                          onChange={(event) => {
                            // Update the checkbox status in the data structure
                            checkboxStatuses[index] = event.target.checked;

                            console.log("checkbox Statuses");
                            console.log(checkboxStatuses);

                            // Log the updated status if needed
                            console.log(
                              `Checkbox Early-Shift-${index} is now ${
                                event.target.checked ? "checked" : "unchecked"
                              }.`
                            );
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`Early-Shift-${index}`}
                        ></label>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr key="Late Shift">
                  <td>
                    Late Shift <br /> 06.00 - 14.00
                  </td>
                  {[...Array(5)].map((_, index) => (
                    <td key={index}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`Late-Shift-${index}`}
                          defaultChecked={false}
                          onChange={(event) => {
                            // Update the checkbox status in the data structure
                            checkboxStatuses[index + 5] = event.target.checked;

                            console.log("checkbox Statuses");
                            console.log(checkboxStatuses);

                            // Log the updated status if needed
                            console.log(
                              `Checkbox Late-Shift-${index} is now ${
                                event.target.checked ? "checked" : "unchecked"
                              }.`
                            );
                          }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <h2>
        What are your preferences? <br />
      </h2>
      <div className="sliders">
        {[
          { label: "Your preference for Forklifting", index: 0 },
          { label: "Your preference for Sorting", index: 1 },
          { label: "Your preference for Picking", index: 2 },
        ].map((item) => (
          <div key={item.index} className="slider-item">
            <label>
              {item.label} : {preferencesList[item.index]}
            </label>
            <div className="input-group">
              <input
                type="range"
                min="0"
                max="100"
                className="form-range"
                value={preferencesList[item.index]}
                onChange={(e) => updatePreferences(item.index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="spider-plot">
        <h5>Your Job Preferences</h5>
        <ResponsiveContainer height={300}>
          <RadarPlot data={yourPreferences} name={"You"} />
        </ResponsiveContainer>
      </div>
      </div>

          {/*second column*/}
      <div className="col-md-6 centered-flex full-height"> 
      <div className="availability-mask">
        <h2>
          When are you available? <br />
        </h2>

        <div className="row-availability">
          <div className="col-4">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Shift Type</th>
                  <th scope="col">Monday</th>
                  <th scope="col">Tuesday</th>
                  <th scope="col">Wednesday</th>
                  <th scope="col">Thursday</th>
                  <th scope="col">Friday</th>
                </tr>
              </thead>

              <tbody>
                <tr key="Early Shift">
                  <td>
                    Early Shift <br /> 06.00 - 14.00
                  </td>
                  {[...Array(5)].map((_, index) => (
                    <td key={index}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`Early-Shift-${index}`}
                          defaultChecked={false}
                          onChange={(event) => {
                            // Update the checkbox status in the data structure
                            checkboxStatuses[index] = event.target.checked;

                            console.log("checkbox Statuses");
                            console.log(checkboxStatuses);

                            // Log the updated status if needed
                            console.log(
                              `Checkbox Early-Shift-${index} is now ${
                                event.target.checked ? "checked" : "unchecked"
                              }.`
                            );
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`Early-Shift-${index}`}
                        ></label>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr key="Late Shift">
                  <td>
                    Late Shift <br /> 06.00 - 14.00
                  </td>
                  {[...Array(5)].map((_, index) => (
                    <td key={index}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`Late-Shift-${index}`}
                          defaultChecked={false}
                          onChange={(event) => {
                            // Update the checkbox status in the data structure
                            checkboxStatuses[index + 5] = event.target.checked;

                            console.log("checkbox Statuses");
                            console.log(checkboxStatuses);

                            // Log the updated status if needed
                            console.log(
                              `Checkbox Late-Shift-${index} is now ${
                                event.target.checked ? "checked" : "unchecked"
                              }.`
                            );
                          }}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <h2>
        What are your preferences? <br />
      </h2>
      <div className="sliders">
        {[
          { label: "Your preference for Forklifting", index: 0 },
          { label: "Your preference for Sorting", index: 1 },
          { label: "Your preference for Picking", index: 2 },
        ].map((item) => (
          <div key={item.index} className="slider-item">
            <label>
              {item.label} : {preferencesList[item.index]}
            </label>
            <div className="input-group">
              <input
                type="range"
                min="0"
                max="100"
                className="form-range"
                value={preferencesList[item.index]}
                onChange={(e) => updatePreferences(item.index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="spider-plot">
        <h5>Your Job Preferences</h5>
        <ResponsiveContainer height={300}>
          <RadarPlot data={yourPreferences} name={"You"} />
        </ResponsiveContainer>
      </div>
      </div>
      </div>

      <div className="button-container">
        {/* Generate Schedule Button */}
        <div className="row">
          <div className="col-md-12">
            <button
              className="btn btn-primary custom-button"
              onClick={solveWithPreferences}
            >
              <img src={AI_icon} alt="Custom Icon" className="custom-icon" />
              Generate schedule
            </button>
          </div>
        </div>

        {/* Set to Compare Button */}
        <div className="row">
          <div className="col-md-12">
            <button
              className="btn btn-primary custom-button"
              onClick={solveWithPreferences}
            >
              Set this schedule to compare
            </button>
          </div>
        </div>
      </div>

      <div className="schedule-container">
        <div className="schedule-view">
          <h2>Schedule A</h2>

          <WeekView2
            shiftData={solutionData}
            changedShifts={changedShifts}
            staticShiftData={staticShiftPlan} // Static shift plan
          />
        </div>

        <div className="schedule-view">
          <h2>Schedule B</h2>
        </div>
      </div>
    </div>
  );
}

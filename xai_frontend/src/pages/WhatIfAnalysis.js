import React, { useState, useEffect, useCallback } from "react";

import axios from "axios"; // JavaScript Library for HTTP-requests

import { ResponsiveContainer } from "recharts";
import RadarPlot from "../components/RadarPlot";
import PiePlot from "../components/PiePlot";
import StackedBarPlot from "../components/StackedBarPlot";
import BarPlot from "../components/BarPlot";

import WeekViewSchedule from "../components/WeekViewSchedule.js";
import {
  staticShiftPlan,
  initialStackedBarData,
  initialBarData,
} from "./staticData.js";

import AI_icon from "../Img/ai.png"; // Adjust the path to your icon file

import "./WhatIfAnalysis.css";

export default function WhatIfAnalysis() {
  // Status variables for the list of availabilities
  const [availabilityListA, setAvailabilityListA] = useState(
    new Array(10).fill(false)
  );
  const [availabilityListB, setAvailabilityListB] = useState(
    new Array(10).fill(false)
  );

  // Status variable for the list of preferences
  const [preferencesListA, setPreferencesListA] = useState([50, 50, 50]);
  const [preferencesListB, setPreferencesListB] = useState([40, 60, 70]);

  // State for conditional rendering
  const [generatedA, setGeneratedA] = useState(false);
  const [generatedB, setGeneratedB] = useState(false);

  // State variables for the shift schedule solutions
  const [solutionDataA, setSolutionDataA] = useState(staticShiftPlan);
  const [solutionDataB, setSolutionDataB] = useState(staticShiftPlan);
  const [activeSolutionIndex, setActiveSolutionIndex] = useState(0); //"lift state up for the child component"

  // State variable (standard)
  const [updatedPreferenceMatrix, setUpdatedPreferenceMatrix] = useState([
    [50, 20, 15],
    [0, 100, 50],
    [90, 25, 45],
    [65, 50, 15],
    [50, 50, 60],
  ]);

  const [stackedBarData, setStackedBarData] = useState(initialStackedBarData);
  const [barData, setBarData] = useState(initialBarData);

  //My personal preferences for scenario A and B
  const [yourPreferencesA, setYourPreferencesA] = useState([
    { subject: "Forklift", You: 50 },
    { subject: "Sorting", You: 50 },
    { subject: "Picking", You: 50 },
  ]);
  const [yourPreferencesB, setYourPreferencesB] = useState([
    { subject: "Forklift", You: 20 },
    { subject: "Sorting", You: 60 },
    { subject: "Picking", You: 80 },
  ]);

  // Function to update your preferences based on the slider values
  const updateYourPreferences = (
    preferencesList,
    yourPreferences,
    setYourPreferences
  ) => {
    const newPreferences = preferencesList.map((value, index) => ({
      subject: yourPreferences[index].subject,
      You: parseInt(value, 10),
    }));
    setYourPreferences(newPreferences);
  };

  // Generate solution with specific preferences and availabilities
  const generateSolution = (
    preferencesList,
    availabilityList,
    setSolutionData
  ) => {
    console.log("Updated preferences list sent!");
    console.log(preferencesList);

    // Send a POST request to the backend using axios-library
    axios
      .post("http://localhost:5000/solve_shifts_what_if", {
        job1Preference: preferencesList[0],
        job2Preference: preferencesList[1],
        job3Preference: preferencesList[2],
        availabilityList: availabilityList,
      })
      .then((response) => {
        // Process the response from the backend and set the state variable
        setSolutionData(response.data);
        console.log("SolutionData set & POST Response Schedule");
        console.log(response.data);

        // Now that the state is updated, you can call your update functions here
        updateStackedBarData(
          response.data,
          activeSolutionIndex,
          preferencesList
        );
        updateBarData(response.data, activeSolutionIndex);
      })
      .catch((error) => {
        // Handle errors if they occur
        console.error("Error sending request to the backend:", error);
      });
  };

  // Function to update preferences in the list
  const updatePreferences = (
    preferencesList,
    setPreferencesList,
    index,
    value
  ) => {
    // Convert the value to an integer
    const intValue = parseInt(value, 10);

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

  useEffect(() => {
    updateYourPreferences(
      preferencesListA,
      yourPreferencesA,
      setYourPreferencesA
    ); // Update your preferences when sliders change
  }, [preferencesListA]);

  useEffect(() => {
    updateYourPreferences(
      preferencesListB,
      yourPreferencesB,
      setYourPreferencesB
    ); // Update your preferences when sliders change
  }, [preferencesListB]);



  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // The empty array ensures it only runs once on mount

  const pieData = [
    { name: "Job 1", value: 600 },
    { name: "Job 2", value: 100 },
    { name: "Job 3", value: 300 },
  ];

  // Function to calculate preference satisfaction rates based on response_data and solutionIndex
  function calculatePreferenceSatisfaction(
    solution_data,
    solutionIndex,
    preferencesList
  ) {
    console.log("in function calculatePreferenceSatisfaction");

    // Get the individual preference scores for the given solutionIndex
    const individualPreferenceScore =
      solution_data.schedule_data[solutionIndex].individual_preference_score;

    console.log(individualPreferenceScore);

    // Get the sum of shifts per employee
    const sumShiftsPerEmployee =
      solution_data.schedule_data[solutionIndex].sum_shifts_per_employee;

    console.log(sumShiftsPerEmployee);

    const maxPreference1 = 100;
    const maxPreference2 = 90;
    const maxPreference3 = 65;
    const maxPreference4 = 60;

    // Calculate the highest preference from the preferencesList
    const maxPreference0 = Math.max(...preferencesList); //Problem: von der Präferenzliste wird der maximalwert genommen, aber das wird hier nur gemacht für "YOU"

    const maxPreferences = [
      maxPreference0,
      maxPreference1,
      maxPreference2,
      maxPreference3,
      maxPreference4,
    ];
    console.log("maxPreference0: " + maxPreference0);

    // Initialize an array to store the satisfaction rates for each employee
    const satisfactionRates = [];

    // Calculate the satisfaction rate for each employee
    for (const employeeId in individualPreferenceScore) {
      if (individualPreferenceScore.hasOwnProperty(employeeId)) {
        // Convert the preference score and sum of shifts to numbers
        const preferenceScore = parseInt(individualPreferenceScore[employeeId]);
        const sumShifts = parseInt(sumShiftsPerEmployee[employeeId]);

        // Calculate the maximum possible preference score for the employee
        const maxPossiblePreference = sumShifts * maxPreferences[employeeId];
        console.log(
          "Employee " +
            employeeId +
            " has a maxPref of: " +
            maxPreferences[employeeId]
        );

        /*     console.log(
          "maxPossPrefs: " +
            maxPossiblePreference +
            " for employee " +
            employeeId
        ); */

        // Calculate the satisfaction rate as a percentage
        const satisfactionRate =
          (preferenceScore / maxPossiblePreference) * 100;

        /*         console.log(
          "satisfactionRate: " +
            satisfactionRate +
            " for employee " +
            employeeId
        ); */

        const employeeNames = {
          0: "YOU",
          1: "Alice",
          2: "Bob",
          3: "Emily",
          4: "Franck",
        };

        // Push the satisfaction rate to the array
        satisfactionRates.push({
          name: employeeNames[employeeId],
          Satisfaction: satisfactionRate.toFixed(2), // Rounded to two decimal places
          Unfulfilled: (100 - satisfactionRate).toFixed(2), // Rounded to two decimal places
        });
      }
    }

    console.log("satisfactionRates:");
    console.log(satisfactionRates);
    // Return the array of satisfaction rates
    return satisfactionRates;
  }

  function updateBarData(solution_data, solutionIndex) {
    const sumShiftsPerEmployee =
      solution_data.schedule_data[solutionIndex].sum_shifts_per_employee;

    console.log("sum shifts per emplo");
    console.log(sumShiftsPerEmployee);

    const employeeNames = {
      0: "YOU",
      1: "Alice",
      2: "Bob",
      3: "Emily",
      4: "Franck",
    };

    const updatedBarData = Object.keys(sumShiftsPerEmployee).map(
      (employeeId) => ({
        name: employeeNames[employeeId],
        uv: parseInt(sumShiftsPerEmployee[employeeId]),
      })
    );
    console.log("updated bar data: ");
    console.log(updatedBarData);

    setBarData(updatedBarData);
  }

  // Function to update stackedBarData based on response_data and solution index
  const updateStackedBarData = useCallback ((
    solution_data,
    solutionIndex,
    preferencesList) => {
    console.log("StackedBarData was updated! solution_data :");
    console.log(solution_data);

    console.log("StackedBarData was updated! solutionIndex:");
    console.log(solutionIndex);

    console.log("StackedBarData was updated! preferencesList:");
    console.log(preferencesList);

    // Calculate the preference satisfaction rates based on response_data and solutionIndex
    const calculatedData = calculatePreferenceSatisfaction(
      solution_data,
      solutionIndex,
      preferencesList
    );

    console.log("StackedBarData before update: ");
    console.log(stackedBarData);
    // Update the stackedBarData state with the calculated data
    setStackedBarData(calculatedData);
    console.log("StackedBarData after update: ");
    console.log(stackedBarData);

    console.log("StackedBarData was updated! :");
    console.log(calculatedData);
  },[stackedBarData]);

  useEffect(() => {
    console.log("IN USE EFFECT");
    // Ensure that solutionDataA and preferencesListA are not null or undefined
    // and that solutionDataA has the schedule_data array with the correct index.
    if (
      solutionDataA &&
      solutionDataA.schedule_data &&
      Array.isArray(solutionDataA.schedule_data) &&
      preferencesListA
    ) {
      console.log("IN USE EFFECT - IF STATEMENT!!!!!!!!");
      console.log("updating with values: ");
      console.log(activeSolutionIndex);
      updateBarData(solutionDataA, activeSolutionIndex);
      updateStackedBarData(
        solutionDataA,
        activeSolutionIndex,
        preferencesListA
      );
    }
  }, [activeSolutionIndex, solutionDataA, preferencesListA, updateStackedBarData]);

  return (
    <div className="container-what-if">
      <h1>What-If-Scenarios</h1>
      <div className="row">
        {/*first column*/}
        <div className="col-md-6 centered-flex full-height">
          <div className="availability-mask">
            <h2>
              Scenario A <br />
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
                                const updatedAvailabilityListA = [
                                  ...availabilityListA,
                                ];
                                updatedAvailabilityListA[index] =
                                  event.target.checked;
                                setAvailabilityListA(updatedAvailabilityListA);

                                // Log the updated status
                                console.log("Availability List A:");
                                console.log(availabilityListA);
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
                                const updatedAvailabilityListA = [
                                  ...availabilityListA,
                                ];
                                updatedAvailabilityListA[index + 5] =
                                  event.target.checked;
                                setAvailabilityListA(updatedAvailabilityListA);

                                // Log the updated status
                                console.log("Availability List A:");
                                console.log(availabilityListA);
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
                  {item.label} : {preferencesListA[item.index]}
                </label>
                <div className="input-group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="form-range"
                    value={preferencesListA[item.index]}
                    onChange={(e) =>
                      updatePreferences(
                        preferencesListA,
                        setPreferencesListA,
                        item.index,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="spider-plot">
            <h5>Your Job Preferences</h5>
            <ResponsiveContainer height={300}>
              <RadarPlot data={yourPreferencesA} name={"You"} />
            </ResponsiveContainer>
          </div>

          {/* Generate Schedule Button */}
          {
            <div className="row">
              <div className="col-md-12">
                <button
                  className="btn btn-primary custom-button"
                  onClick={() => {
                    generateSolution(
                      preferencesListA,
                      availabilityListA,
                      setSolutionDataA
                    );
                    setActiveSolutionIndex(0);
                    setGeneratedA(true);
                  }}
                >
                  <img
                    src={AI_icon}
                    alt="Custom Icon"
                    className="custom-icon"
                  />
                  Generate schedule
                </button>
              </div>
            </div>
          }

          {/* Status Box */}
          <div className="row">
            <div className="col-md-12">
              <div className="status-box">
                <p>
                  {" "}
                  Status:{" "}
                  {solutionDataA["solution_count"] === 0
                    ? "Infeasible"
                    : "Optimal"}
                </p>
                <p>
                  Number of good solutions: {solutionDataA["solution_count"]}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule A */}
          {generatedA && (
            <div className="schedule-view">
              <h2>Schedule A</h2>
              <h3>
                {" "}
                Solution Nr. {activeSolutionIndex + 1} out of{" "}
                {solutionDataA["solution_count"]}
              </h3>
              <WeekViewSchedule
                shiftData={solutionDataA}
                activeSolutionIndex={activeSolutionIndex}
                setActiveSolutionIndex={setActiveSolutionIndex}
              />
            </div>
          )}

          {/* Here comes the comparison section */}
          {generatedA && (
            <div className="comparison-section">
              {/* Total Overall Preference Text */}
              <div className="total-preference">
                <h2>How good is the solution?</h2>

                <h3>
                  If you add up all satisfied preferences of this solution,
                  you'll get:{" "}
                  {(() => {
                    try {
                      return solutionDataA.schedule_data[activeSolutionIndex]
                        .total_preference;
                    } catch (error) {
                      return "n.a.";
                    }
                  })()}
                </h3>
              </div>

              {/* Overall Job Popularity */}
              {/*               <div className="job-popularity">
                <h3>How popular are the jobs amongst all?</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PiePlot data={pieData} activeIndex={0} onPieEnter={0} />
                </ResponsiveContainer>
              </div> */}

              {/* Preference Satisfaction Bar */}
              <div className="preference-satisfaction">
                <h3>
                  The best possible preference satisfaction rate for each
                  employee - according to the AI:
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <StackedBarPlot data={stackedBarData} />
                </ResponsiveContainer>
              </div>

              {/* Workload Ranking */}
              <div className="workload-ranking">
                <h3>How many shifts does everyone take?</h3>

                <ResponsiveContainer width="100%" height={400}>
                  <BarPlot data={barData} />
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/*second column*/}
        <div className="col-md-6 centered-flex full-height">
          <div className="availability-mask">
            <h2>
              Scenario B <br />
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
                                const updatedAvailabilityListB = [
                                  ...availabilityListB,
                                ];
                                updatedAvailabilityListB[index] =
                                  event.target.checked;
                                setAvailabilityListB(updatedAvailabilityListB);

                                /// Log the updated status
                                console.log("Availability List B");
                                console.log(availabilityListB);
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
                                const updatedAvailabilityListB = [
                                  ...availabilityListB,
                                ];
                                updatedAvailabilityListB[index + 5] =
                                  event.target.checked;
                                setAvailabilityListB(updatedAvailabilityListB);

                                // Log the updated status
                                console.log("Availability List B:");
                                console.log(availabilityListB);
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
                  {item.label} : {preferencesListB[item.index]}
                </label>
                <div className="input-group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="form-range"
                    value={preferencesListB[item.index]}
                    onChange={(e) =>
                      updatePreferences(
                        preferencesListB,
                        setPreferencesListB,
                        item.index,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="spider-plot">
            <h5>Your Job Preferences</h5>
            <ResponsiveContainer height={300}>
              <RadarPlot data={yourPreferencesB} name={"You"} />
            </ResponsiveContainer>
          </div>

          {/* Generate Schedule Button */}
          {
            <div className="row">
              <div className="col-md-12">
                <button
                  className="btn btn-primary custom-button"
                  onClick={() => {
                    generateSolution(
                      preferencesListB,
                      availabilityListB,
                      setSolutionDataB
                    );
                    setGeneratedB(true);
                  }}
                >
                  <img
                    src={AI_icon}
                    alt="Custom Icon"
                    className="custom-icon"
                  />
                  Generate schedule
                </button>
              </div>
            </div>
          }

          {/* Status Box */}
          <div className="row">
            <div className="col-md-12">
              <div className="status-box">
                <p>
                  {" "}
                  Status:{" "}
                  {solutionDataB["solution_count"] === 0
                    ? "Infeasible"
                    : "Optimal"}
                </p>
                <p>
                  Number of good solutions: {solutionDataB["solution_count"]}
                </p>
              </div>
            </div>
          </div>

          {/* Schedule B */}
          {generatedB && (
            <div className="schedule-view">
              <h2>Schedule B</h2>
              <WeekViewSchedule shiftData={solutionDataB} />
            </div>
          )}

          {/* Here comes the comparison section */}
          {generatedB && (
            <div className="comparison-section">
              {/* Total Overall Preference Text */}
              <div className="total-preference">
                <h2>How good is the solution?</h2>
                <h3>
                  Overall preference score:{" "}
                  {(() => {
                    try {
                      return solutionDataB.schedule_data[0].total_preference;
                    } catch (error) {
                      return "n.a.";
                    }
                  })()}
                </h3>

                {console.log("Total Preference: ")}
                {/*     {console.log(solutionDataA.schedule_data[0].total_preference)} */}
              </div>

              {/* Overall Job Popularity */}
              {/*               <div className="job-popularity">
                <h3>How popular are the jobs amongst all?</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PiePlot data={pieData} activeIndex={0} onPieEnter={0} />
                </ResponsiveContainer>
              </div> */}

              {/* Preference Satisfaction Bar */}
              <div className="preference-satisfaction">
                <h3>
                  The best possible preference satisfaction rate for each
                  employee - according to the AI:
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <StackedBarPlot data={stackedBarData} />
                </ResponsiveContainer>
              </div>

              {/* Workload Ranking */}
              <div className="workload-ranking">
                <h3>How many shifts does everyone take?</h3>

                <ResponsiveContainer width="100%" height={400}>
                  <BarPlot data={barData} />
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

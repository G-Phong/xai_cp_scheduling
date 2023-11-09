import React, { useState, useEffect } from "react";

import axios from "axios"; // JavaScript Library for HTTP-requests

import { ResponsiveContainer } from "recharts";
import RadarPlot from "../components/RadarPlot";

import WeekViewSchedule from "../components/WeekViewSchedule.js";
import { staticShiftPlan, staticPreferences } from "./staticData.js";

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

  // State variables for the shift schedule solutions
  const [solutionDataA, setSolutionDataA] = useState(staticShiftPlan);
  const [solutionDataB, setSolutionDataB] = useState(staticShiftPlan);

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
    solutionData,
    setSolutionData
  ) => {
    console.log("Updated preferences list sent!");
    console.log(preferencesList);

    // Send a POST request to the backend using axios-library
    axios
      .post("http://localhost:5000/solve_shifts_what_if", {
        // Send the preference list as JSON
        job1Preference: preferencesList[0],
        job2Preference: preferencesList[1],
        job3Preference: preferencesList[2],
        //Also send the availabilities
        availabilityList: availabilityList,
      })
      .then((response) => {
        // Process the response from the backend
        setSolutionData(response.data);

        console.log("POST Response Schedule");
        console.log(solutionData);

        // Update state variables with new data
        setSumShiftsPerEmployee(solutionData.sum_shifts_per_employee);
        setIndividualPreferenceScore(solutionData.individual_preference_score);
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
                  onClick={() =>
                    generateSolution(
                      preferencesListA,
                      availabilityListA,
                      solutionDataA,
                      setSolutionDataA
                    )
                  }
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
                    : "Feasible"}
                </p>
                <p>Number of Solutions: {solutionDataA["solution_count"]}</p>
              </div>
            </div>
          </div>

          <div className="schedule-view">
            <h2>Schedule A</h2>
            <WeekViewSchedule shiftData={solutionDataA} />
          </div>
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
                  onClick={() =>
                    generateSolution(
                      preferencesListB,
                      availabilityListB,
                      solutionDataB,
                      setSolutionDataB
                    )
                  }
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
                    : "Feasible"}
                </p>
                <p>Number of Solutions: {solutionDataB["solution_count"]}</p>
              </div>
            </div>
          </div>

          <div className="schedule-view">
            <h2>Schedule B</h2>

            <WeekViewSchedule shiftData={solutionDataB} />
          </div>
        </div>
      </div>

      <h1>
        {" "}
        --- HERE COMES THE COMPARISON SECTION --- <br /> <br /> <br /> <br />{" "}
        <br />
      </h1>
    </div>
  );
}

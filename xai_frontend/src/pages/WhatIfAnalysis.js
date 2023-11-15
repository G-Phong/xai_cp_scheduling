import React, { useState, useEffect } from "react";

import axios from "axios"; // JavaScript Library for HTTP-requests

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  Bar,
  Label,
} from "recharts";
import RadarPlot from "../components/RadarPlot";
import StackedBarPlot from "../components/StackedBarPlot";
import BarPlot from "../components/BarPlot";

import WeekViewSchedule from "../components/WeekViewSchedule.js";
import {
  staticShiftPlan,
  initialStackedBarData,
  zero_barData,
  zero_stackedBarData,
  initialBarData,
  initialSegmentedBarChartData,
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
  const [activeSolutionIndexA, setActiveSolutionIndexA] = useState(0); //"lift state up for the child component"
  const [activeSolutionIndexB, setActiveSolutionIndexB] = useState(0); //"lift state up for the child component"

  // State variable (standard)
  const [updatedPreferenceMatrix, setUpdatedPreferenceMatrix] = useState([
    [50, 20, 15],
    [0, 100, 50],
    [90, 25, 45],
    [65, 50, 15],
    [50, 50, 60],
  ]);

  const [stackedBarDataA, setStackedBarDataA] = useState(initialStackedBarData);
  const [stackedBarDataB, setStackedBarDataB] = useState(initialStackedBarData);
  const [barDataA, setBarDataA] = useState(initialBarData);
  const [barDataB, setBarDataB] = useState(initialBarData);
  const [segmentedBarDataA, setsegmentedBarDataA] = useState(
    initialSegmentedBarChartData
  );
  const [segmentedBarDataB, setsegmentedBarDataB] = useState(
    initialSegmentedBarChartData
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
    setSolutionData,
    activeSolutionIndex,
    setBarData,
    setStackedBarData
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
          preferencesList,
          setStackedBarData
        );
        updateBarData(response.data, activeSolutionIndex, setBarData);
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

  // Function to calculate preference satisfaction rates based on response_data and solutionIndex
  function calculatePreferenceSatisfaction(
    solution_data,
    solutionIndex,
    preferencesList
  ) {
    console.log("in function calculatePreferenceSatisfaction");
    console.log(solution_data.schedule_data[solutionIndex]);

    // Get the individual preference scores for the given solutionIndex
    const individualPreferenceScore =
      solution_data.schedule_data[solutionIndex].individual_preference_score;

    console.log(individualPreferenceScore);

    // Get the sum of shifts per employee
    const sumShiftsPerEmployee =
      solution_data.schedule_data[solutionIndex].sum_shifts_per_employee;

    console.log(sumShiftsPerEmployee);

    //Static exemplary data from model
    const maxPreference1 = 100;
    const maxPreference2 = 90;
    const maxPreference3 = 65;
    const maxPreference4 = 60;

    // Calculate the highest preference from the preferencesList
    const maxPreference0 = Math.max(...preferencesList);

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

        // Calculate the satisfaction rate as a percentage
        let satisfactionRate = (preferenceScore / maxPossiblePreference) * 100;

        /*         if(satisfactionRate > 100){
          window.alert("The satisfaction rate was higher than 100?! It is " + satisfactionRate.toString()
          + ". preferenceScore is " + preferenceScore.toString() 
          + ", maxPossiblePreference is " + maxPossiblePreference.toString()
          + ". Max preference value is " + maxPreference0.toString()
          );

        } */

        // Check if satisfaction rate exceeds 100 and set it to 100 if it does
        satisfactionRate = satisfactionRate > 100 ? 100 : satisfactionRate;

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

  function updateBarData(solution_data, solutionIndex, setBarData) {
    if (
      !solution_data ||
      !solution_data.schedule_data ||
      solutionIndex >= solution_data.schedule_data.length
    ) {
      // Handle the situation where the data is not as expected
      console.error(
        "Solution data is not available or the index is out of bounds."
      );
      return;
    }

    const solution = solution_data.schedule_data[solutionIndex];
    const sumShiftsPerEmployee = solution?.sum_shifts_per_employee;

    if (!sumShiftsPerEmployee) {
      // Handle the situation where sumShiftsPerEmployee is not defined
      console.error(
        "sum_shifts_per_employee is not available for the current index."
      );
      return;
    }

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
        uv: parseInt(sumShiftsPerEmployee[employeeId], 10),
      })
    );

    console.log("updated bar data: ");
    console.log(updatedBarData);

    setBarData(updatedBarData);
  }

  // Function to update stackedBarData based on response_data and solution index
  function updateStackedBarData(
    solution_data,
    solutionIndex,
    preferencesList,
    setStackedBarData
  ) {
    console.log("StackedBarData was updated! solution_data :");
    console.log(solution_data);

    console.log("StackedBarData was updated! solutionIndex:");
    console.log(solutionIndex);

    console.log("StackedBarData was updated! preferencesList:");
    console.log(preferencesList);

    // Check if the required data is present
    if (
      !solution_data ||
      !solution_data.schedule_data ||
      solutionIndex >= solution_data.schedule_data.length
    ) {
      console.error(
        "Solution data is not available or the index is out of bounds."
      );
      return; // Exit the function if data is not as expected
    }

    // Optional chaining to safely access individual_preference_score
    const individualPreferenceScore =
      solution_data.schedule_data[solutionIndex]?.individual_preference_score;

    // Check if individual_preference_score is available
    if (!individualPreferenceScore) {
      console.error(
        "individual_preference_score is not available for the current index."
      );
      return; // Exit the function if data is not as expected
    }

    // Calculate the preference satisfaction rates based on response_data and solutionIndex
    const calculatedData = calculatePreferenceSatisfaction(
      solution_data,
      solutionIndex,
      preferencesList
    );

    // Check if calculatedData is successfully generated
    if (!calculatedData) {
      console.error("Failed to calculate preference satisfaction.");
      return; // Exit the function if calculation failed
    }

    // Update the stackedBarData state with the calculated data
    setStackedBarData(calculatedData);

    console.log("StackedBarData was updated! :");
    console.log(calculatedData);
  }

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
      console.log(activeSolutionIndexA);
      updateBarData(solutionDataA, activeSolutionIndexA, setBarDataA);
      updateStackedBarData(
        solutionDataA,
        activeSolutionIndexA,
        preferencesListA,
        setStackedBarDataA
      );
      updateSegmentedBarData(
        solutionDataA,
        activeSolutionIndexA,
        setsegmentedBarDataA
      );
      console.log("segmentedBarDataA");
      console.log(segmentedBarDataA);
    }
  }, [activeSolutionIndexA, solutionDataA, preferencesListA]);

  useEffect(() => {
    console.log("IN USE EFFECT");
    // Ensure that solutionDataA and preferencesListA are not null or undefined
    // and that solutionDataA has the schedule_data array with the correct index.
    if (
      solutionDataB &&
      solutionDataB.schedule_data &&
      Array.isArray(solutionDataB.schedule_data) &&
      preferencesListB
    ) {
      console.log("IN USE EFFECT - IF STATEMENT!!!!!!!!");
      console.log("updating with values: ");
      console.log(activeSolutionIndexB);
      updateBarData(solutionDataB, activeSolutionIndexB, setBarDataB);
      updateStackedBarData(
        solutionDataB,
        activeSolutionIndexB,
        preferencesListB,
        setStackedBarDataB
      );
      updateSegmentedBarData(
        solutionDataB,
        activeSolutionIndexB,
        setsegmentedBarDataB
      );
    }
  }, [activeSolutionIndexB, solutionDataB, preferencesListB]);

  const CustomTooltipStackedBar = ({ active, payload, label }) => {
    if (active && payload && payload.length === 2) {
      const satisfactionValue = payload[0].value;
      const unfulfilledValue = payload[1].value;

      // Ensure that values are parsed as numbers
      const satisfaction = parseFloat(satisfactionValue);
      const unfulfilled = parseFloat(unfulfilledValue);

      const total = satisfaction + unfulfilled;
      const satisfactionPercentage =
        total !== 0 ? ((satisfaction / total) * 100).toFixed(1) : 0;

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "8px",
            border: "1px solid #888",
          }}
        >
          <p
            className="label"
            style={{ color: "purple" }}
          >{`${satisfactionPercentage}% of ${label}'s preferences were satisfied`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipBar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const uvValue = payload[0].value;
      const totalShifts = 30; // Assuming a total of 30 shifts in a week

      const percentageOfWork = ((uvValue / totalShifts) * 100).toFixed(1);

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "8px",
            border: "1px solid #888",
          }}
        >
          <p
            className="label"
            style={{ color: "purple" }}
          >{`${label} works ${uvValue} shifts this week.`}</p>
          <p className="desc">{`He/She is doing ${percentageOfWork}% of all the work this week.`}</p>
        </div>
      );
    }

    return null;
  };

  function updateSegmentedBarData(
    solutionData,
    solutionIndex,
    setSegmentedBarData
  ) {
    const mapping = {
      0: "You",
      1: "Alice",
      2: "Bob",
      3: "Emily",
      4: "Franck",
    };

    // Initialize the structure for the stacked bar chart
    const updatedData = {
      name: "Contributions",
      You: 0,
      Alice: 0,
      Bob: 0,
      Emily: 0,
      Franck: 0,
    };

    if (
      solutionData &&
      solutionData.schedule_data &&
      solutionIndex >= 0 &&
      solutionIndex < solutionData.schedule_data.length
    ) {
      const solution = solutionData.schedule_data[solutionIndex];
      Object.keys(mapping).forEach((index) => {
        const name = mapping[index];
        const score = parseInt(solution.individual_preference_score[index], 10);
        if (!isNaN(score)) {
          updatedData[name] = score;
        }
      });
    }
    console.log("updatedSegData");
    console.log(updatedData);

    setSegmentedBarData([updatedData]); // Update the state with the new data
  }

  return (
    <div className="container-what-if">
      <section className="what-if-header-section">
        <h1>What-If-Scenarios</h1>
      </section>
      <section className="what-if-main-section">
      <div className="row align-items-start">
        {/*first column*/}
        <div className="col-md-6 centered-flex">
          <div className="availability-mask">
            <h2>
              Scenario A <br />
              When are you available? <br />
            </h2>

            <div className="row-availability-what-if">
              <div className="col-md-12">
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
                  className="btn btn-primary generate-button"
                  onClick={() => {
                    generateSolution(
                      preferencesListA,
                      availabilityListA,
                      setSolutionDataA,
                      activeSolutionIndexA,
                      setBarDataA,
                      setStackedBarDataA
                    );
                    setActiveSolutionIndexA(0);
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
                Solution Nr. {activeSolutionIndexA + 1} out of{" "}
                {solutionDataA["solution_count"]}
              </h3>
              <WeekViewSchedule
                shiftData={solutionDataA}
                activeSolutionIndex={activeSolutionIndexA}
                setActiveSolutionIndex={setActiveSolutionIndexA}
              />
            </div>
          )}

          {/* Here comes the comparison section */}
          {generatedA && (
            <div className="comparison-section">
              {/* Total Overall Preference in a segmented bar chart */}
              <div className="total-preference">
                <br />
                <h3>
                  {" "}
                  The overall score of this solution:{" "}
                  {solutionDataA && solutionDataA.solution_count > 0
                    ? solutionDataA.schedule_data[activeSolutionIndexA]
                        .total_preference
                    : "-"}
                </h3>
                <br />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={segmentedBarDataA}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 10,
                      bottom: 50,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 2200]}>
                      <Label
                        value="The higher the overall score the better the solution"
                        offset={0}
                        position="insideBottom"
                        dy={35}
                      />
                    </XAxis>
                    <YAxis
                      type="category"
                      dataKey="name"
                      angle={-90}
                      position="insideLeft"
                      textAnchor="middle"
                      interval={0}
                      dx={-10}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="You" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Alice" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Bob" stackId="a" fill="#ffc658" />
                    <Bar dataKey="Emily" stackId="a" fill="#ff8042" />
                    <Bar dataKey="Franck" stackId="a" fill="#2A6979" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Preference Satisfaction Bar */}
              <div className="preference-satisfaction">
              <h3>How well are my preferences satisfied?               </h3>
                {solutionDataA && solutionDataA.solution_count > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stackedBarDataA}>
                      <XAxis dataKey="name">
                        <Label value="" offset={0} position="insideRight" />
                      </XAxis>
                      <YAxis type="number" domain={[0, 100]}>
                        <Label
                          value="Preference Satisfaction Rate"
                          offset={20} // Adjust the offset to add more space
                          angle={-90}
                          position="inside"
                          dx={-10}
                        />
                      </YAxis>

                      <Tooltip content={<CustomTooltipStackedBar />} />
                      <Legend
                        payload={[
                          {
                            value: "Preferences satisfied",
                            type: "rect",
                            color: "#800080",
                          },
                          {
                            value: "Missed Preferences",
                            type: "rect",
                            color: "white",
                          },
                        ]}
                      />
                      <Bar
                        dataKey="Satisfaction"
                        stackId="a"
                        fill="#800080"
                        name="Preferences satisfied"
                      />
                      <Bar
                        dataKey="Unfulfilled"
                        stackId="a"
                        fill="white"
                        name="Missed Preferences"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <StackedBarPlot data={zero_stackedBarData} />
                  </ResponsiveContainer>
                )}
                <br />
              </div>

              {/* Workload Ranking */}
              <div className="workload-ranking">
                <h3>How many shifts does everyone take?</h3>

                {solutionDataA && solutionDataA.solution_count > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barDataA}>
                      <XAxis dataKey="name" label={{ fill: "black" }}>
                        <Label value="" offset={0} position="insideRight" />
                      </XAxis>
                      <YAxis label={{ fill: "black" }}>
                        <Label
                          value="Number of shifts"
                          offset={15}
                          angle={-90}
                          position="center"
                        />
                      </YAxis>
                      <Tooltip content={<CustomTooltipBar />} />
                      <Legend
                        payload={[
                          {
                            value: "Number of Shifts",
                            type: "rect",
                            color: "#800080",
                          },
                        ]}
                        label={{ fill: "black" }}
                      />
                      <Bar dataKey="uv" fill="#800080" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarPlot data={zero_barData} />
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>

        {/*second column*/}

        <div className="col-md-6 centered-flex">
          <div className="availability-mask">
            <h2>
              Scenario B <br />
              When are you available? <br />
            </h2>

            <div className="row-availability-what-if">
              <div className="col-md-12">
                <table className="table table-bordered w-100">
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
            <div className="row-generate">
              <div className="col-md-12">
                <button
                  className="btn btn-primary text-align-left generate-button"
                  onClick={() => {
                    generateSolution(
                      preferencesListB,
                      availabilityListB,
                      setSolutionDataB,
                      activeSolutionIndexB,
                      setBarDataB,
                      setStackedBarDataB
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
              <h3>
                {" "}
                Solution Nr. {activeSolutionIndexB + 1} out of{" "}
                {solutionDataB["solution_count"]}
              </h3>
              <WeekViewSchedule
                shiftData={solutionDataB}
                activeSolutionIndex={activeSolutionIndexB}
                setActiveSolutionIndex={setActiveSolutionIndexB}
              />
            </div>
          )}

          {/* Here comes the comparison section */}
          {generatedB && (
            <div className="comparison-section">
              {/* Total Overall Preference Text */}
              <div className="total-preference">
                <br />
                <h3>
                  {" "}
                  The overall score of this solution:{" "}
                  {solutionDataB && solutionDataB.solution_count > 0
                    ? solutionDataB.schedule_data[activeSolutionIndexB]
                        .total_preference
                    : "-"}
                </h3>
                <br />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={segmentedBarDataB}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 10,
                      bottom: 50,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 2200]}>
                      <Label
                        value="The higher the overall score the better the solution"
                        offset={0}
                        position="insideBottom"
                        dy={35}
                      />
                    </XAxis>
                    <YAxis
                      type="category"
                      dataKey="name"
                      angle={-90}
                      position="insideLeft"
                      textAnchor="middle"
                      interval={0}
                      dx={-10}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="You" stackId="a" fill="#8884d8" />
                    <Bar dataKey="Alice" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="Bob" stackId="a" fill="#ffc658" />
                    <Bar dataKey="Emily" stackId="a" fill="#ff8042" />
                    <Bar dataKey="Franck" stackId="a" fill="#2A6979" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Preference Satisfaction Bar */}
              <div className="preference-satisfaction">
                <h3>How well are my preferences satisfied?               </h3>
                {solutionDataB && solutionDataB.solution_count > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stackedBarDataB}>
                      <XAxis dataKey="name">
                        <Label value="" offset={0} position="insideRight" />
                      </XAxis>
                      <YAxis type="number" domain={[0, 100]}>
                        <Label
                          value="Preference Satisfaction Rate"
                          offset={20} // Adjust the offset to add more space
                          angle={-90}
                          position="inside"
                          dx={-10}
                        />
                      </YAxis>
                      <Tooltip content={<CustomTooltipStackedBar />} />
                      <Legend
                        payload={[
                          {
                            value: "Preferences satisfied",
                            type: "rect",
                            color: "#800080",
                          },
                          {
                            value: "Missed Preferences",
                            type: "rect",
                            color: "white",
                          },
                        ]}
                      />
                      <Bar
                        dataKey="Satisfaction"
                        stackId="a"
                        fill="#800080"
                        name="Preferences satisfied"
                      />
                      <Bar
                        dataKey="Unfulfilled"
                        stackId="a"
                        fill="white"
                        name="Missed Preferences"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <StackedBarPlot data={zero_stackedBarData} />
                  </ResponsiveContainer>
                )}
                <br />
              </div>

              {/* Workload Ranking */}
              <div className="workload-ranking">
                <h3>How many shifts does everyone take?</h3>

                {solutionDataB && solutionDataB.solution_count > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barDataB}>
                      <XAxis dataKey="name" label={{ fill: "black" }}>
                        <Label value="" offset={0} position="insideRight" />
                      </XAxis>
                      <YAxis label={{ fill: "black" }}>
                        <Label
                          value="Number of shifts"
                          offset={15}
                          angle={-90}
                          position="center"
                        />
                      </YAxis>
                      <Tooltip content={<CustomTooltipBar />} />
                      <Legend
                        payload={[
                          {
                            value: "Number of Shifts",
                            type: "rect",
                            color: "#800080",
                          },
                        ]}
                        label={{ fill: "black" }}
                      />
                      <Bar dataKey="uv" fill="#800080" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarPlot data={zero_barData} />
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </section>
    </div>
  );
}

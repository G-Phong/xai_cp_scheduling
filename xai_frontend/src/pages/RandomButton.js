// React Libraries
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RandomButton() {
  const [anzahl, setAnzahl] = useState(0); // State for the generated random number
  const [gesamtanzahl, setGesamtanzahl] = useState(0); // Initialize with 0

  useEffect(() => {
    // Call the generateRandomNumber function only on the initial mount
    //generateRandomNumber();
  }, []); // Empty dependency array

  // Function to generate a random number by making an HTTP request to the server
  const generateRandomNumber = () => {
    axios
      .get("http://localhost:5000/randomButton")
      .then((response) => {
        // Update the 'anzahl' state with the received random number
        setAnzahl(response.data.anzahl);
        
        // Increment the 'gesamtanzahl' (total count of generated random numbers)
        setGesamtanzahl((prevGesamtanzahl) => prevGesamtanzahl + 1);
      })
      .catch((error) => {
        console.error("An error occurred while fetching data: ", error);
      });
  };

  return (
    <div>
      <h1>Random Button page</h1>

      <h1 className="custom-h1">Random Number (1 - 100): {anzahl}</h1>
      <h1 className="custom-h1">
        Total Count of Generated Random Numbers: {gesamtanzahl}
      </h1>
      <button
        onClick={generateRandomNumber}
        className="btn btn-primary btn-sm float-start"
      >
        Generate New Random Number
      </button>
    </div>
  );
}

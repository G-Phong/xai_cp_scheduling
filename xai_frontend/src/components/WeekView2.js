import { useState, useEffect } from "react";
import "./WeekView2.css"; // CSS Stylesheet

export default function WeekView2({
  shiftData,
  changedShifts,
  staticShiftData,
}) {
  // State-Hook für die hervorgehobenen Schichten
  const [highlightedShifts, setHighlightedShifts] = useState([]);

  useEffect(() => {
    // Wenn sich die geänderten Schichten ändern, setzen Sie den Zustand für hervorgehobene Schichten neu
    setHighlightedShifts(changedShifts);
  }, [changedShifts]);

  // Extrahiere schedule_data und statistics aus shiftData
  const { schedule_data, statistics } = shiftData;

  // Extrahiere die Wochentage aus schedule_data
  const weekdays = Object.keys(schedule_data);

  // Extrahiere die Schichttypen aus dem ersten Wochentag (angenommen, sie sind für alle Wochentage gleich)
  const shiftTypes = Object.keys(schedule_data[weekdays[0]]);

  return (
    <div>
      <h2>
        Weekview Work Schedule (Optimal Solutions: {shiftData.solution_count})
      </h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {weekdays.map((weekday) => (
              <th key={weekday}>{weekday}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {shiftTypes.map((shiftType) => (
            <tr key={shiftType}>
              <td>{shiftType}</td>
              {weekdays.map((weekday) => (
                <td key={weekday}>
                  {schedule_data[weekday][shiftType].map((shift, index) => {
                    const isHighlighted = highlightedShifts[weekday] &&
                      highlightedShifts[weekday][shiftType] &&
                      highlightedShifts[weekday][shiftType][index] &&
                      highlightedShifts[weekday][shiftType][index].isDifferent;

                    return (
                      <div
                        key={index}
                        className={`cell ${
                          isHighlighted ? "highlighted-cell" : ""
                        }`}
                      >
                        <div className="subcell">
                          {"Employee-ID: " + shift.employee}
                        </div>
                        <div className="subcell">{"Job-ID: " + shift.job}</div>
                      </div>
                    );
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Anzeige des statischen Schichtplans */}
      <h2>Statischer Schichtplan</h2>
      {staticShiftData && (
        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                {weekdays.map((weekday) => (
                  <th key={weekday}>{weekday}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shiftTypes.map((shiftType) => (
                <tr key={shiftType}>
                  <td>{shiftType}</td>
                  {weekdays.map((weekday) => (
                    <td key={weekday}>
                      {staticShiftData.schedule_data[weekday][shiftType].map(
                        (shift, index) => (
                          <div key={index} className={`cell static-cell`}>
                            <div className="subcell">
                              {"Employee-ID: " + shift.employee}
                            </div>
                            <div className="subcell">
                              {"Job-ID: " + shift.job}
                            </div>
                          </div>
                        )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="container mt-4">
        <h3>Statistics</h3>
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
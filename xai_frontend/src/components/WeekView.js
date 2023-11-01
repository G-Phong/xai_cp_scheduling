import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

//Optionally German Locale format
import de from "@fullcalendar/core/locales/de";

// Sample data representing shift planning for employees
const shiftPlanData = {
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
};

// Converts the shiftPlanData into FullCalendar events
function convertToEvents(shiftPlanData) {
  const events = [];
  const date = new Date(); // Today's date

  // Assume EarlyShift starts at 8:00 AM and LateShift starts at 4:00 PM
  const shiftDuration = 8;
  const earlyShiftStartTime = 6;
  const lateShiftStartTime = 14;

  date.setDate(date.getDate() - date.getDay() + 1); // Sets the date to the Monday of the current week

  // Loop through each day and its shifts
  for (const [day, shifts] of Object.entries(shiftPlanData)) {
    for (const [shiftType, assignments] of Object.entries(shifts)) {
      const shiftStartHour =
        shiftType === "EarlyShift" ? earlyShiftStartTime : lateShiftStartTime;

      // Process each assignment for the given shift type
      assignments.forEach((assignment) => {
        // Create a new date for the current event
        const eventDate = new Date(date);

        // Set the day of the week for the current event
        eventDate.setDate(
          eventDate.getDate() +
            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(
              day
            )
        );
        // Set the start time for the current event
        eventDate.setHours(shiftStartHour, 0, 0, 0);

        // Create an end date based on the shift duration
        const endDate = new Date(eventDate);
        endDate.setHours(eventDate.getHours() + shiftDuration);

        // Add the event to the events array
        events.push({
          title: `Employee: ${assignment.employee}, Job: ${assignment.job}`,
          start: eventDate,
          end: endDate,
          display: "auto",
        });
      });
    }
  }

  return events;
}

// Convert shiftPlanData to events
var events = convertToEvents(shiftPlanData);

let colors = ["#7a8b9d", "#7a9ec5", "#b0d3f8"]; // Beispiel-Farben
events.map((event, index) => {
  event.backgroundColor = colors[index % colors.length];
  return event;
});

// Main React component rendering the calendar
export default function WeekView() {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]} // Specify plugins to use
        initialView="timeGridWeek" // Start with a weekly view
        weekends={false} // Don't display weekends
        events={events.map((event, index) => {
          event.backgroundColor = colors[index % colors.length];
          return event;
        })}
        slotMinTime="05:00:00"
        // Provide the events data
        eventContent={renderEventContent} // Custom rendering for events
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }} // 24-hour format
        /* locale={en} */ // Optionally: set the locale to German
        dayHeaderFormat={{
          weekday: "short",
          day: "numeric",
          month: "numeric",
          year: "numeric",
          omitCommas: true,
        }} // European date format
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // 24-hour-format
        }}
      />
    </div>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b style={{ color: "black" }}>{eventInfo.timeText}</b> <br />
      <i style={{ color: "white" }}>{eventInfo.event.title}</i>
    </>
  );
}

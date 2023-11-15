export let initialAllConstraintStatus = {
    Monday: {
      DayShift: {
        0: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        1: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        2: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
      },
    },
    Tuesday: {
      DayShift: {
        0: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        1: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        2: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
      },
    },
    Wednesday: {
      DayShift: {
        0: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        1: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        2: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
      },
    },
    Thursday: {
      DayShift: {
        0: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        1: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        2: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
      },
    },
    Friday: {
      DayShift: {
        0: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        1: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
        2: {
          constraint1Violated: false,
          constraint3Violated: false,
          constraint4Violated: false,
          constraint5Violated: false,
        },
      },
    },
  };

 export const workingHoursData = [
  { name: "John",  minShifts: 2, maxShifts: 5 },
  { name: "Alice",  minShifts: 1, maxShifts: 5 },
  { name: "Bob", minShifts: 2, maxShifts: 5 },
  { name: "Emily",  minShifts: 1, maxShifts: 5 },
  { name: "Franck",  minShifts: 1, maxShifts: 5 },
];

export const workingHoursData_old = [
    { name: "John", assignedShifts: 2, minShifts: 2, maxShifts: 5 },
    { name: "Alice", assignedShifts: 3, minShifts: 1, maxShifts: 5 },
    { name: "Bob", assignedShifts: 1, minShifts: 2, maxShifts: 5 },
    { name: "Emily", assignedShifts: 6, minShifts: 1, maxShifts: 5 },
    { name: "Franck", assignedShifts: 3, minShifts: 1, maxShifts: 5 },
  ];
  

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const shiftTypes = ["DayShift"]; // To simplify EduGame, we use only one shift type

export const jobDescriptions = {
  0: "Forklifting",
  1: "Sorting",
  2: "Picking",
};

export const staticShiftData = {
  Monday: { DayShift: [{}, {}, {}] },
  Tuesday: { DayShift: [{}, {}, {}] },
  Wednesday: { DayShift: [{}, {}, {}] },
  Thursday: { DayShift: [{}, {}, {}] },
  Friday: { DayShift: [{}, {}, {}] },
};

// Problem data
export const maxShifts = { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 };
export const minShifts = { 1: 2, 2: 1, 3: 2, 4: 1, 5: 1 };

export const availability = {
  Monday: { DayShift: { 1: 0, 2: 1, 3: 1, 4: 0, 5: 1 } },
  Tuesday: { DayShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 } },
  Wednesday: { DayShift: { 1: 1, 2: 0, 3: 1, 4: 0, 5: 1 } },
  Thursday: { DayShift: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1 } },
  Friday: { DayShift: { 1: 1, 2: 0, 3: 0, 4: 1, 5: 1 } },
};

export const jobPreference = {
  1: { 0: 50, 1: 20, 2: 15 },
  2: { 0: 0, 1: 100, 2: 50 },
  3: { 0: 90, 1: 25, 2: 45 },
  4: { 0: 65, 1: 50, 2: 15 },
  5: { 0: 50, 1: 50, 2: 60 },
};

export const employees = [
  { employeeID: "1", name: "John" },
  { employeeID: "2", name: "Alice" },
  { employeeID: "3", name: "Bob" },
  { employeeID: "4", name: "Emily" },
  { employeeID: "5", name: "Franck" },
];
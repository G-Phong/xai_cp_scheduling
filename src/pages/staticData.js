// static reference solution
/* export const staticShiftPlan2 = {
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
}; */

// static reference solution
export const staticShiftPlan = {
  schedule_data: [
    {
      id: "solution1",
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
            { employee: 2, job: 0 },
            { employee: 1, job: 1 },
            { employee: 4, job: 2 },
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
            { employee: 1, job: 0 },
            { employee: 4, job: 1 },
            { employee: 0, job: 2 },
          ],
        },
        Thursday: {
          EarlyShift: [
            { employee: 3, job: 0 },
            { employee: 4, job: 1 },
            { employee: 2, job: 2 },
          ],
          LateShift: [
            { employee: 4, job: 0 },
            { employee: 1, job: 1 },
            { employee: 0, job: 2 },
          ],
        },
        Friday: {
          EarlyShift: [
            { employee: 3, job: 0 },
            { employee: 4, job: 1 },
            { employee: 1, job: 2 },
          ],
          LateShift: [
            { employee: 3, job: 0 },
            { employee: 0, job: 1 },
            { employee: 2, job: 2 },
          ],
        },
      },
      total_preference: "2020",
      sum_shifts_per_employee: {
        0: "5",
        1: "6",
        2: "6",
        3: "3",
        4: "10",
      },
      individual_preference_score: {
        0: "500",
        1: "450",
        2: "405",
        3: "195",
        4: "540",
      },
    },
  ],
  solution_count: 0,
};

// static preference matrix
export const staticPreferences = [
  [50, 20, 15],
  [0, 100, 50],
  [90, 25, 45],
  [65, 50, 15],
  [50, 50, 60],
];

export const zero_stackedBarData = [
  {
    name: "YOU",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Alice",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Bob",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Emily",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Franck",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
];

export const initialSegmentedBarChartData = [
  {
    name: "Contributions",
    You: 0, // value for You
    Alice: 0, // value for Alice
    Bob: 0, // value for Bob
    Emily: 0, // value for Emily
    Franck: 0, // value for Franck
  },
];

export const initialStackedBarData = [
  {
    name: "YOU",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Alice",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Bob",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Emily",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Franck",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
];

export const initialStackedBarData2 = [
  {
    name: "YOU",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Alice",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Bob",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Emily",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
  {
    name: "Franck",
    Satisfaction: 0,
    Unfulfilled: 0,
  },
];

export const initialBarData = [
  { name: "YOU", uv: 5 },
  { name: "Alice", uv: 4 },
  { name: "Bob", uv: 2 },
  { name: "Emily", uv: 3 },
  { name: "Franck", uv: 1 },
];

export const zero_barData = [
  { name: "YOU", uv: 0 },
  { name: "Alice", uv: 0 },
  { name: "Bob", uv: 0 },
  { name: "Emily", uv: 0 },
  { name: "Franck", uv: 0 },
];

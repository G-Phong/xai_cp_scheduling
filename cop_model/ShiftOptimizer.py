from ortools.sat.python import cp_model

import array as arr
import numpy as np
import time
import json

class VarArraySolutionPrinter(cp_model.CpSolverSolutionCallback):
    """
    Custom callback class for the CP-SAT solver, tailored for collecting and structuring
    employee shift-scheduling solutions. This class extends the CpSolverSolutionCallback
    and overrides the on_solution_callback method to adapt the solution to a human-centric
    format.

    Attributes:
        __variables (list): List of model variables to be monitored for solutions.
        __num_shifts_per_day (int): The number of different shift types in one day.
        __employee_job_preference_matrix (ndarray): A matrix representing the preference score of employees for various jobs.
        __employees (list): A list of unique identifiers for each employee.
        __schedule (list): A list of time intervals or shifts that need to be scheduled.
        __jobs (list): A list of unique identifiers for each job type.
        __solution_count (int): Keeps track of the number of solutions found.
        __all_solutions (list): Accumulates all solutions in a structured format for easy retrieval.
    
    Methods:
        on_solution_callback(): Overrides the method from CpSolverSolutionCallback to handle each new solution.
        structure_shift_data(): Transforms the raw solution data into a human-readable structured format.
        divisible(currentschedule, numbershifts, counter_day): Helper method to track the current day of the schedule.
        solution_count(): Returns the number of solutions found.
        get_all_solutions(): Returns a list of all structured solutions found.
    """

    def __init__(self, variables, employee_job_preference_matrix, employees, schedule, jobs):
        """Intiliazining the VarArraySolutionPrinter class"""
        cp_model.CpSolverSolutionCallback.__init__(self)
        self.__variables = variables
        self.__num_shifts_per_day = 2
        self.__employee_job_preference_matrix = employee_job_preference_matrix
        self.__solution_count = 0
        self.__employees = employees
        self.__schedule = schedule
        self.__jobs = jobs
        self.__all_solutions = []

    def on_solution_callback(self):
        """This method is called, when a solution is found."""
        self.__solution_count += 1

        current_solution = {}
        total_preference = 0
        for e in self.__employees:
            for s in self.__schedule:
                for j in self.__jobs:
                    index = e * (len(self.__schedule) * len(self.__jobs)) + s * len(self.__jobs) + j
                    if self.Value(self.__variables[index]) == 1:
                        #current_solution[(e, s, j)] = self.Value(self.__variables[index])
                        total_preference += self.__employee_job_preference_matrix[e, j]

        current_solution = self.structure_shift_data()

        self.__all_solutions.append({
            'solution': current_solution,
            'total_preference': total_preference
        })

        #print("Printing self.__all_solutions: ")
        #print(self.__all_solutions)

    def structure_shift_data(self):
        """Brings the shift solution data into a nice and representable format"""

        # Structured dictionary for schedule data
        schedule_data = {}

        day_data = {"EarlyShift": [], "LateShift": []} #set
 
        # Define weekdays for the output
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        counter_day = 1

        for s in self.__schedule:
            current_weekday = weekdays[counter_day - 1]
            counter_day = self.divisible(s + 1, self.__num_shifts_per_day, counter_day)

            # Initialize day_data for each shift type
            if current_weekday not in schedule_data:
                day_data = {
                    "EarlyShift": [],
                    "LateShift": []
                }
         

            shift_dict = {
                "EarlyShift": {},
                "LateShift": {}
            }

            for e in self.__employees:
                for j in self.__jobs:
                    index = e * (len(self.__schedule) * len(self.__jobs)) + s * len(self.__jobs) + j
                    if self.Value(self.__variables[index]) == 1:
                        shift_type = "EarlyShift" if s % 2 == 0 else "LateShift"
                        if j not in shift_dict[shift_type]:
                            shift_dict[shift_type][j] = []
                        shift_dict[shift_type][j].append({"employee": e, "job": j})

            # Add shifts to day_data
            for shift_type in ["EarlyShift", "LateShift"]:
                for job_id in sorted(shift_dict[shift_type].keys()):
                    day_data[shift_type].extend(shift_dict[shift_type][job_id])

            # Add day_data to schedule_data
            schedule_data[current_weekday] = day_data

        return schedule_data

    def divisible(self, currentschedule, numbershifts, counter_day):
        """Checks if the current shift index is divisible by the total number of shifts to update the day counter."""
        if currentschedule % numbershifts == 0:
            counter_day = counter_day + 1
        return counter_day

    def solution_count(self):
        """Returns number of optimal solutions found by the solver"""
        return self.__solution_count
    
    def get_all_solutions(self):
        """
        Returns a list of all collected solutions.

        Each item in the list is a dictionary with the following structure:
        
        {
            'solution': {
                'Weekday': {
                    'EarlyShift': [
                        {'employee': employee_id_1, 'job': job_id_1},
                        {'employee': employee_id_2, 'job': job_id_2},
                        ...
                    ],
                    'LateShift': [
                        {'employee': employee_id_1, 'job': job_id_1},
                        {'employee': employee_id_2, 'job': job_id_2},
                        ...
                    ]
                },
                ...
            },
            'total_preference': total_preference_value
        }

        - 'solution': A nested dictionary that provides the scheduling information.
            - 'Weekday': A key representing the weekday (e.g., "Monday").
                - 'EarlyShift'/'LateShift': Keys for different types of shifts.
                    - A list of dictionaries, each containing:
                        - 'employee': An identifier for an employee.
                        - 'job': An identifier for a job.

        - 'total_preference': An integer representing the total preference value of the corresponding solution.

        Returns:
            list: A list of dictionaries, each containing a solution and its corresponding total preference value.
        """
        return self.__all_solutions


class ShiftOptimizer:
    """
    A class for optimizing employee shift scheduling based on preferences and constraints.

    This class is designed to optimize the assignment of shifts to employees while taking into account various
    preferences and constraints, including employee preferences, qualifications, availability, and rotation preferences.

    Attributes:
        num_employees (int): The number of employees.
        num_jobs (int): The number of available jobs.
        num_qualifications (int): The number of qualification levels.
        num_days (int): The number of days in the shift plan.
        num_shifts_per_day (int): The number of shifts per day.
        employee_job_preference_matrix (numpy.ndarray): A matrix representing employee preferences for each job.
        employee_qualification_matrix (numpy.ndarray): A matrix representing employee qualifications.
        job_required_qualification_matrix (numpy.ndarray): A matrix representing the required qualifications for each job.
        employee_availability_matrix (numpy.ndarray): A matrix representing employee availability for each shift.
        rotation_preference_per_employee (array.array): An array representing the rotation preferences for each employee.

    Methods:
        __init__(self, employee_job_preference_matrix=None, num_employees=0, num_jobs=0,
                 num_qualifications=0, num_days=0, num_shifts_per_day=0):
            Initializes an instance of the ShiftOptimizer class with the given parameters.

        calculate_score(self, e, q, j, employee_qualification_matrix, job_required_qualification_matrix):
            Calculates a score based on employee qualifications and job requirements.
            (Note: This method is typically defined separately.)

        # Other methods related to optimization and constraint handling.

    Example Usage:
        optimizer = ShiftOptimizer()
    """ 
 
    def __init__(self, employee_job_preference_matrix=None, num_employees=0, num_jobs=0, num_qualifications=0, num_days=0, num_shifts_per_day=0):
        """
        Initializes an instance of the ShiftOptimizer class and initializes instance variables.

        Args:
            num_employees (int): The number of employees.
            num_jobs (int): The number of available jobs.
            num_qualifications (int): The number of qualification levels.
            num_days (int): The number of days in the shift plan.
            num_shifts_per_day (int): The number of shifts per day.
        """

        if employee_job_preference_matrix is None:
            print("Initializing ShiftOptimizer instance with default values!")
        else:
            print("Initializing ShiftOptimizer instance with MODIFIED preference matrix!")

        # Initialize instance variables
        self.num_employees = num_employees
        self.num_jobs = num_jobs
        self.num_qualifications = num_qualifications
        self.num_days = num_days
        self.num_shifts_per_day = num_shifts_per_day
        self.num_total_shifts = num_days * num_shifts_per_day

          # Initialize arrays and matrices
        self.max_shifts_per_employee = arr.array('i', [10, 10, 10, 10, 10])
        self.min_shifts_per_employee = arr.array('i', [5, 5, 5, 3, 3])
        self.employee_availability_matrix = np.array([[0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                                             [1, 1, 1, 0, 1, 1, 0, 1, 1, 0],
                                             [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
                                             [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
                                             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                                             ])
        self.employee_qualification_matrix = np.array([[1, 1, 2],
                                              [2, 1, 1],
                                              [3, 1, 2],
                                              [2, 3, 3],
                                              [2, 1, 2]
                                              ])
        self.job_required_qualification_matrix = np.array([[3, 3, 3],
                                                  [2, 1, 2],
                                                  [3, 2, 2]
                                                  ])
        self.x = (self.num_employees, self.num_jobs)
        self.employee_job_calculation_matrix = np.zeros(self.x, dtype=int)

        if employee_job_preference_matrix is None:
            self.employee_job_preference_matrix = np.array([[50, 20, 15],
                                                [0, 100, 50],
                                                [90, 25, 45],
                                                [65, 50, 15],
                                                [50, 50, 60]
                                                ])
        else: 
            self.employee_job_preference_matrix = employee_job_preference_matrix

        self.rotation_preference_per_employee = arr.array('i', [3, 3, 3, 3, 10])

        # Define ranges for iteration
        self.employees = range(self.num_employees)
        self.jobs = range(self.num_jobs)
        self.days = range(self.num_days)
        self.schedule = range(self.num_total_shifts)
        self.qualifications = range(self.num_qualifications)

        # Create the model
        self.model = cp_model.CpModel() #Objektverschachtelung

        # Create decision variables
        self.shifts = {}
        for e in self.employees:
            for s in self.schedule:
                for j in self.jobs:
                    self.shifts[(e, s, j)] = self.model.NewBoolVar('shift_n%id%is%i' % (e, s, j))

        # Define the objective: maximize employee preferences
        self.objective = sum(self.shifts[(e, s, j)] * self.employee_job_preference_matrix[e, j] for e in self.employees
                for s in self.schedule for j in self.jobs)
        self.model.Maximize(self.objective)

        # Create General Constraints
        # General Constraint1: Each employee works on a maximum of 1 job per shift
        for e in self.employees:
            for s in self.schedule:
                self.model.Add(sum(self.shifts[(e, s, j)] for j in self.jobs) <= 1)

        # General Constraint2: Each job on a shift must be assigned to exactly 1 employee
        for s in self.schedule:
            for j in self.jobs:
                self.model.Add(sum(self.shifts[(e, s, j)] for e in self.employees) == 1)

        # Create Specific Constraints
        # Specific Constraint1: Each employee works a minimum and maximum number of shifts per week
        for e in self.employees:
            num_shifts_of_employee = []
            for s in self.schedule:
                for j in self.jobs:
                    num_shifts_of_employee.append(self.shifts[(e, s, j)])
            self.model.Add(sum(num_shifts_of_employee) <= self.max_shifts_per_employee[e])
            self.model.Add(sum(num_shifts_of_employee) >= self.min_shifts_per_employee[e])

        # Specific Constraint2: Each employee must have the minimum skill/qualification for a task
        self.arr_length = self.num_employees * self.num_qualifications * self.num_jobs
        self.storage = np.zeros(self.arr_length, dtype=int)
        self.counter = 0

        # Calculate employee_job_calculation_matrix
        for e in self.employees:
            for j in self.jobs:
                for q in self.qualifications:
                    self.storage[self.counter] = self.calculate_score(e, q, j, self.employee_qualification_matrix,
                                                    self.job_required_qualification_matrix)
                    if self.counter % self.num_qualifications:
                        if self.storage[self.counter] + self.storage[self.counter - 1] + self.storage[self.counter - 2] == self.num_qualifications:
                            self.employee_job_calculation_matrix[e, j] = 1
                        else:
                            self.employee_job_calculation_matrix[e, j] = 0
                    self.counter = self.counter + 1

        # Use employee_job_calculation_matrix to define constraint on solution
        for e in self.employees:
            for j in self.jobs:
                if self.employee_job_calculation_matrix[e, j] == 0:
                    for s in self.schedule:
                        self.model.Add(self.shifts[(e, s, j)] == 0)

        # Specific Constraint3: Each employee can only be assigned to shifts when available
        for e in self.employees:
            for s in self.schedule:
                for j in self.jobs:
                    self.model.Add(self.shifts[(e, s, j)] <= self.employee_availability_matrix[e, s])

        # Specific Constraint4: Each employee is scheduled a maximum number of times for one task (rotation constraint)
        for e in self.employees:
            for j in self.jobs:
                self.model.Add(sum(self.shifts[(e, s, j)] for s in self.schedule) <= self.rotation_preference_per_employee[e])

        # Problem solver: Cp.Solver() searches for solutions
        self.solver = cp_model.CpSolver()

        # Create a solution printer
        self.solution_printer = VarArraySolutionPrinter(list(self.shifts.values()), self.employee_job_preference_matrix, self.employees, self.schedule, self.jobs)

        # Enumerate all solutions.
        self.solver.parameters.enumerate_all_solutions = True

        # Solve.
        self.status = self.solver.Solve(self.model, self.solution_printer)

        #print status
        print()
        print('Status = %s' % self.solver.StatusName(self.status))
        print('Number of solutions found: %i' % self.solution_printer.solution_count())
        print()

        print("__init__: COP_Solver was successfully initialized!")     

    def update_preferences(self, job1_preference, job2_preference, job3_preference):
        """
        Updates the job preferences in the ShiftOptimizer object for the first row only, then returns the new matrix.
        DOES NOT change the instance variable "employee_job_preference_matrix"!

        Args:
            job1_preference (int): preference value for job 1.
            job2_preference (int): preference value for job 2.
            job3_preference (int): preference value for job 3.
        """

        newPreferenceMatrix = self.employee_job_preference_matrix
        newPreferenceMatrix[0, :] = [job1_preference, job2_preference, job3_preference]

        print("New matrix will returned -> Looking at new preferences: ")
        print(newPreferenceMatrix)

        return newPreferenceMatrix
        
    def solve_shifts(self):
        """
        Solves the shift planning problem with updated preferences and returns the generated data.

        Returns:
            dict: A structured dictionary containing shift planning data (3-level nested dictionary).
            int: The number of optimal solutions.

            The outermost dictionary has weekdays (Monday, Tuesday, ...) as keys.
            For each weekday, there is another dictionary containing shift types (Early Shift, Late Shift) as keys.
            In each shift type dictionary, there is a list of dictionaries representing employee-to-job assignments for that shift.
        """

        print("Lösen des Problems mit aktualisierten Präferenzen für den ersten Mitarbeiter.")
        print("Betrachtung der neuen Präferenzen in SOLVE_SHIFTS:")
        print(self.employee_job_preference_matrix)

        # Start timing
        time_start = time.time()

        # Solve
        self.status = self.solver.Solve(self.model)

        #print status
        print()
        print('Status = %s' % self.solver.StatusName(self.status))
        print('Number of solutions found: %i' % self.solution_printer.solution_count())
        print()

        # Number of optimal solutions
        optimal_solution_count = self.solution_printer.solution_count()

        # Get all solutions from solution printer
        all_solutions = self.solution_printer.get_all_solutions()

        # Prepare the output dictionary
        output_data = {
            'number_of_solutions': optimal_solution_count,
            'solutions': [],
            #'total_preferences': []
        }

        # Iterate through all solutions and add them to the 'solutions' list
        for i, sol in enumerate(all_solutions):
            # Create an ID for the solution, e.g., "solution1", "solution2", ...
            solution_dict = {
                'id': f"solution{i+1}",
                'schedule': sol['solution'],  # Add the schedule to the solution
                'total_preference': str(sol['total_preference'])  # Add the total preference to the solution
            }

            # Add the entire dictionary to the 'solutions' list
            output_data['solutions'].append(solution_dict)

        print("output data: ")
        print(output_data)

        output_file_path = "output_data.txt"
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(output_data, output_file, indent=4)

        # Stop timing
        time_end = time.time()
        print(f"Solving took {time_end - time_start} seconds")

        # Return a tuple containing schedule data and optimal solution count
        return output_data

    def sum_shifts_per_employee(self):
        """
        Summarizes the number of shifts per employee and returns a dictionary
        containing the count of shifts per employee.

        Returns:
            dict: A dictionary containing the count of shifts per employee.

        Example output:
            number_shifts_per_employee = {
                '0': '12',  # Employee 0 has 12 shifts
                '1': '13',  # Employee 1 has 13 shifts
                '2': '11',  # Employee 2 has 11 shifts
                 ... and so on for all employees
            }
        """

        # Initialisieren des Wörterbuchs als dict[str][str]
        number_shifts_per_employee = {str(e): '0' for e in self.employees}

        counter_day = 1
        number_shifts_per_day = len(self.schedule) // len(self.employees)

        for s in self.schedule:
            counter_day = self.divisible(s + 1, number_shifts_per_day, counter_day)
            for e in self.employees:
                for j in self.jobs:
                    if self.solver.Value(self.shifts[(e, s, j)]) == 1:
                        # Umwandlung der Ganzzahl in eine Zeichenfolge und Aktualisierung des Wörterbuchs
                        number_shifts_per_employee[str(e)] = str(int(number_shifts_per_employee[str(e)]) + 1)

        return number_shifts_per_employee

    def calculate_individual_preference_score(self):
        """
        Calculates the total preference score per employee based on preferences.

        Returns:
            dict: A dictionary containing the total score per employee in the form of dict[str][str].

        Example output:
            individual_score = {
                '0': '300',
                '1': '450',
                # ... and so on for all employees
            }
        """

        # Initialisieren des Wörterbuchs als dict[str][str]
        individual_score = {str(e): '0' for e in self.employees}  # Initial value of '0' for each employee as a string

        for e in self.employees:
            for s in self.schedule:
                for j in self.jobs:
                    if self.solver.Value(self.shifts[(e, s, j)]) == 1:
                        # Umwandlung der bestehenden Zeichenfolge in eine Ganzzahl, Addition der Präferenzwertes, und erneute Umwandlung in eine Zeichenfolge
                        individual_score[str(e)] = str(int(individual_score[str(e)]) + self.employee_job_preference_matrix[e, j])

        return individual_score

    def divisible(self, currentschedule, numbershifts, counter_day):
        """
        This function checks if the current schedule index is divisible by the total number of shifts, thereby updating 
        a counter for the day. This can be particularly useful for delineating shift periods and facilitating explanations 
        in a temporal context.
        
        Parameters:
            currentschedule (int): The current index or iteration of the schedule being processed.
            numbershifts (int): The total number of shifts in a scheduling period.
            counter_day (int): The current day counter.
            
        Returns:
            int: The updated day counter.
        """
        if currentschedule % numbershifts == 0:
            counter_day = counter_day + 1
        return counter_day

    def calculate_score(self, employee, qualification, job, employee_qualification_matrix, job_required_qualification_matrix):
        """
        This function calculates the compatibility score for assigning a specific job to an employee based on their qualifications.
        It uses a binary scoring mechanism, where a score of 0 indicates the employee is overqualified for the job and a score of 1
        means the employee meets the job's qualification requirements.
        
        Parameters:
            employee (int): The identifier for the employee.
            qualification (int): The identifier for the qualification.
            job (int): The identifier for the job.
            employee_qualification_matrix (dict): A dictionary or 2D array containing the qualifications of each employee.
            job_required_qualification_matrix (dict): A dictionary or 2D array containing the qualifications required for each job.
            
        Returns:
            int: A binary score, either 0 or 1.
        """
        if employee_qualification_matrix[employee, qualification] > job_required_qualification_matrix[job, qualification]:
            return 0
        return 1
    
    def structure_shift_data(self):
        '''Brings shifts-variable into a nice structure'''

        # Structured dictionary for schedule data
        schedule_data = {}

        day_data = {"EarlyShift": [], "LateShift": []} #set
 
        # Define weekdays for the output
        weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        counter_day = 1

        for s in self.schedule:
            current_weekday = weekdays[counter_day - 1]
            counter_day = self.divisible(s + 1, self.num_shifts_per_day, counter_day)

            # Initialize day_data for each shift type
            if current_weekday not in schedule_data:
                day_data = {
                    "EarlyShift": [],
                    "LateShift": []
                }
         

            shift_dict = {
                "EarlyShift": {},
                "LateShift": {}
            }

            for e in self.employees:
                for j in self.jobs:
                    if self.solver.Value(self.shifts[(e, s, j)]) == 1:
                        shift_type = "EarlyShift" if s % 2 == 0 else "LateShift"
                        if j not in shift_dict[shift_type]:
                            shift_dict[shift_type][j] = []
                        shift_dict[shift_type][j].append({"employee": e, "job": j})

            # Add shifts to day_data
            for shift_type in ["EarlyShift", "LateShift"]:
                for job_id in sorted(shift_dict[shift_type].keys()):
                    day_data[shift_type].extend(shift_dict[shift_type][job_id])

            # Add day_data to schedule_data
            schedule_data[current_weekday] = day_data

        print("nicely structured")

        print(schedule_data)

        return schedule_data
    
  
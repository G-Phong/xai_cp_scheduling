# required imports
from ortools.sat.python import cp_model
import array as arr
import numpy as np
import time
import json

class ShiftOptimizer:
    """
    ShiftOptimizer ist eine Klasse zur Optimierung von Schichtplänen.
    Sie verwaltet die Problemparameter und ermöglicht die Lösung des Problems.
    """  
 
    #Konstruktor mit Standardwerten, falls keine Argumente übergeben werden
    def __init__(self, num_employees=0, num_jobs=0, num_qualifications=0, num_days=0, num_shifts_per_day=0):
        """
        Initialisiert eine Instanz der ShiftOptimizer-Klasse und initialisiert Instanzvariablen

        Args:
            num_employees (int): Die Anzahl der Mitarbeiter.
            num_jobs (int): Die Anzahl der verfügbaren Jobs.
            num_qualifications (int): Die Anzahl der Qualifikationsstufen.
            num_days (int): Die Anzahl der Tage im Schichtplan.
            num_shifts_per_day (int): Die Anzahl der Schichten pro Tag.
        """
        self.num_employees = num_employees
        self.num_jobs = num_jobs
        self.num_qualifications = num_qualifications
        self.num_days = num_days
        self.num_shifts_per_day = num_shifts_per_day
        self.num_total_shifts = num_days * num_shifts_per_day

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
        self.employee_job_preference_matrix = np.array([[50, 20, 15],
                                               [0, 100, 50],
                                               [90, 25, 45],
                                               [65, 50, 15],
                                               [50, 50, 60]
                                               ])
        self.rotation_preference_per_employee = arr.array('i', [3, 3, 3, 3, 10])

        # each variable is assigned a range (für die Iterierung mittels Schleifen)
        self.employees = range(self.num_employees)
        self.jobs = range(self.num_jobs)
        self.days = range(self.num_days)
        self.schedule = range(self.num_total_shifts)
        self.qualifications = range(self.num_qualifications)

        # Creation of the model
        self.model = cp_model.CpModel() #Objektverschachtelung

        # Creation of decision variable
        self.shifts = {}
        for e in self.employees:
            for s in self.schedule:
                for j in self.jobs:
                    self.shifts[(e, s, j)] = self.model.NewBoolVar('shift_n%id%is%i' % (e, s, j))

        # Definition of the objective: maximize employee preferences
        self.objective = sum(self.shifts[(e, s, j)] * self.employee_job_preference_matrix[e, j] for e in self.employees
                for s in self.schedule for j in self.jobs)
        self.model.Maximize(self.objective)

        # Creation of General Constraints
        # General_Constraint1: each employee works maximum on 1 job per shift
        # for each e and s the sum of all jobs must be smaller/equal to 1
        for e in self.employees:
            for s in self.schedule:
                self.model.Add(sum(self.shifts[(e, s, j)] for j in self.jobs) <= 1)

        # 4.2) General_Constraint2: each job on a shift has to be assigned to (only) exactly 1 employee e
        # for each s and j the sum of all employees must be equal to 1
        for s in self.schedule:
            for j in self.jobs:
                self.model.Add(sum(self.shifts[(e, s, j)] for e in self.employees) == 1)

        # 5) Creation of Specific  Constraints

        # 5.1) Specific constraint1: each employee works maximum of X shifts per week as well as a minimum of Y shifts per week
        # for each e the sum over all jobs and days must be smaller/equal to X and be larger/equal to Y

        # Counts number of shifts per employee, this sum should be smaller than the (individual) maximum working shifts per employee
        #in the same time this sum should be larger than the (individual) minimum working shifts per employee
        for e in self.employees:
            num_shifts_of_employee = []
            for s in self.schedule:
                for j in self.jobs:
                    num_shifts_of_employee.append(self.shifts[(e, s, j)])
            self.model.Add(sum(num_shifts_of_employee) <= self.max_shifts_per_employee[e])
            self.model.Add(sum(num_shifts_of_employee) >= self.min_shifts_per_employee[e])

        # 5.2) Specific constraint2: each employee needs to have a minimum skill/qualification to accomplish a task

        # calculate array length to create an array to store "Intermediate results", based on which
        # the employee_job_calculation_matrix will be calculated
        self.arr_length = self.num_employees * self.num_qualifications * self.num_jobs
        self.storage = np.zeros(self.arr_length, dtype=int)
        self.counter: int = 0

        # 5.2.1) step 1: calculate employee_job_calculation_matrix
        for e in self.employees:
            for j in self.jobs:
                for q in self.qualifications:
                    self.storage[counter] = self.calculate_score(e, q, j, self.employee_qualification_matrix,
                                                    self.job_required_qualification_matrix)

                    # after each number of qualifications, a sum will be calculated of the last 3 calculatedScores in the storage array
                    # if the sum = 3 (number of qualifications) -->employee has the necessary skills to absolve the job
                    # thus 1 will be saved in the employee_job_calculation_matrix
                    # otherwise if the sum < 3 (number of qualifications) -->employee does not have all the necessary skills to absolve the job
                    #because the employee does not have the required minimum qualification of at least 1 of the 3 qualifications
                    if counter % self.num_qualifications:
                        # -1,-2,-3 depends on number of qualifications, needs to be adjusted in case of change of qualifications!!
                        if self.storage[counter] + self.storage[counter - 1] + self.storage[counter - 2] == self.num_qualifications:
                            self.employee_job_calculation_matrix[e, j] = 1
                        else:
                            self.employee_job_calculation_matrix[e, j] = 0
                    counter = counter + 1

        print('employee_job_calculation_matrix:')
        print(self.employee_job_calculation_matrix)
        print()

        # 5.2.2) step 2: use employee_job_calculation_matrix to define constraint on solution
        # each time 0 occurs in the employee_job_calculation_matrix, the employee is not able to work on the respective job
        # attention starts counting for e and j at 0 and not at 1
        print('The employee-job restrictions are:')
        for e in self.employees:
            for j in self.jobs:
                if self.employee_job_calculation_matrix[e, j] == 0:
                    print('employee', e, 'can not work on job', j)
                    for s in self.schedule:
                        self.model.Add(self.shifts[(e, s, j)] == 0)
        print()

        # 5.3) Specific constraint3: each employee can only be assigned to shifts when he/she is available
        for e in self.employees:
            for s in self.schedule:
                for j in self.jobs:
                    self.model.Add(self.shifts[(e, s, j)] <= self.employee_availability_matrix[e, s])

        # 5.4) Specific constraint4: each employee is scheduled maximum a certain times for one task = rotation constraint
        #the sum of scheduled shifts per job per employee has to be smaller equal to the rotation preference per employee
        #thus smaller equal to the maximum of numbers of shifts per job per employee
        for e in self.employees:
            for j in self.jobs:
                self.model.Add(sum(self.shifts[(e, s, j)] for s in self.schedule) <= self.rotation_preference_per_employee[e])
        
        # Problem solver: Cp.Solver() searches for solutions
        self.solver = cp_model.CpSolver()

    def set_problem_parameters(self, num_employees, num_jobs, num_qualifications, num_days, num_shifts_per_day):

       self.num_employees = num_employees
       self.num_jobs = num_jobs
       self.num_qualifications = num_qualifications
       self.num_days = num_days
       self.num_shifts_per_day = num_shifts_per_day
       self.num_total_shifts = num_days * num_shifts_per_day
       

    def update_preferences(self, job1_preference, job2_preference, job3_preference):
        print("Updating preferences: ")
        print(job1_preference, job2_preference, job3_preference)
        self.employee_job_preference_matrix = np.array([[job1_preference, job2_preference, job3_preference],
                                               [0, 100, 50],
                                               [90, 25, 45],
                                               [65, 50, 15],
                                               [50, 50, 60]
                                               ])
        return
    

    def solve_shifts(self):
        # Lösen und Zeitmessung

        #Start timing
        time_start = time.time()

        #After this instruction the shifts[(e,s,j)] variable will be filled with solutions and accessible as instance var.
        self.solver.Solve(self.model)

        #stop time and print out the time taken to calculate a solution
        time_end = time.time()
        print(f"Solving took {time_end - time_start} seconds")

        # Ausgabe in einem strukturierten Dict -> wird von dieser Fuunktion zurückgegeben
        schedule_data = {}

        # Wochentage für die Ausgabe definieren
        weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]

        
        counter_day = 1
        # Schleife über die Tage (Montag, Dienstag, ...)
        for s in self.schedule:
            
            #Zuweisung von Tag und Schicht in schedule_data
            current_weekday = weekdays[counter_day-1]
            counter_day = self.divisible(s + 1, self.num_shifts_per_day, counter_day)

            # Hier wird ein separates day_data Dictionary für jede Schicht initialisiert
            if current_weekday not in schedule_data:
                day_data = {
                    "Frühschicht": [],  # Liste für die Frühschicht
                    "Spätschicht": []   # Liste für die Spätschicht
                }

            for e in self.employees:
                for j in self.jobs:
                    if self.solver.Value(self.shifts_solution[(e, s, j)]) == 1:

                        #Zuweisung von Mitarbeiter in day_data
                        if s % 2 == 0: 
                            day_data["Frühschicht"].append({"employee": e, "job": j})

                        else:
                            day_data["Spätschicht"].append({"employee": e, "job": j})

            # Die Tagesdaten zur schedule_data hinzufügen
            schedule_data[current_weekday] = day_data

        return schedule_data

    # TODO: Muss das eine Instanzmethode sein mit "self"?  
    def divisible(currentschedule, numbershifts, counter_day):
        if currentschedule % numbershifts == 0:
            counter_day = counter_day + 1
        return counter_day

    # TODO: Muss das eine Instanzmethode sein mit "self"?  
    # method that calculates if an employee has the required level of qualification for a job
    def calculate_score(employee, qualification, job, employee_qualification_matrix, job_required_qualification_matrix):
        if employee_qualification_matrix[employee, qualification] > job_required_qualification_matrix[job, qualification]:
            return 0
        return 1
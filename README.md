# CP_SAT

#About the project
The goal of this project is to optimally assign up to hundred employees (with unique skill sets and personal preferences) to jobs (which require certain qualifications) with the help of a matching algorithm. The ratio between employees and jobs is constantly 5 to 3.
In this project, a CP-SAT Solver is used, a Constraint Programming (CP) solver based on Boolean satisfiability (SAT). It is part of the open-source Google OR-Tools and maximizes the total preference score of all employees taking into account limitations.
#Installation
CP-SAT is a framework provided by the Google OR-Tools and is compatible with Python, C++, Java and C#.
It is imported in each project in the first line of code via:
from ortools.sat.python import cp_model
To learn how to use OR-Tools the Google developer are providing tutorials for Python:
https://developers.google.com/optimization/introduction/get_started
The complete documentation for OR-Tools is available at: https://developers.google.com/optimization/
Next to the CP-SAT import, this project also requires the import of numpy, array and time.
An example for the implementation of a basic employee-job matching problem solved by the CP-SAT Solver can be found on the Google Developer Website Google OR-Tools
https://developers.google.com/optimization/scheduling/employee_scheduling
However, in this example only shift requests of employees instead of the overall employee preferences are optimized.
Employees can only indicate their wish for a shift assignment but their individual preferences for different shifts and jobs are not taken into account.
#Functionality
The methods and steps to optimally assign employees to jobs is described in detail with comments in the Python source code. For any questions feel free to contact the author Sebastian Stohrer (sebastian.stohrer@tum.de). Depending on the employee job ratio different sub-projects were created to adapt the (size of) input arrays accordingly.
The solver advances through eight steps from defining the input data to printing the solution:

Definition of input data/sets
Creation of the model
Creation of the decision variable xesj
Formulation of the objective
Generation of the General Constraints
Generation of the Specific Constraints
Activation of the Problem Solver
Printing of the Solution

The output of the program is chronologically structured as follows:

Employee job calculation matrix
Overall schedule
Number of shifts per employee
Total preference score of all employees P
Individual total preference score per employee
Total average preference score per employee
Individual average preference score per employee
Individual maximum preference score per employee
Individual schedule per employee

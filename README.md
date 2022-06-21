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
1) Definition of input data/sets 
2) Creation of the model 
3) Creation of the decision variable xesj 
4) Formulation of the objective 
5) Generation of the General Constraints 
6) Generation of the Specific Constraints 
7) Activation of the Problem Solver 
8) Printing of the Solution

The output of the program is chronologically structured as follows:
1) Employee job calculation matrix
2) Overall schedule
3) Number of shifts per employee
4) Total preference score of all employees P
5) Individual total preference score per employee
6) Total average preference score per employee
7) Individual average preference score per employee 
8) Individual maximum preference score per employee 
9) Individual schedule per employee 

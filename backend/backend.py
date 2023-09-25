from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import logging
from cop_model.ShiftOptimizer import ShiftOptimizer

# Initialize Flask app and configure logging
app = Flask(__name__)
logging.basicConfig(filename='app.log', level=logging.DEBUG)

# Disable alphabetical sorting of dictionary keys for jsonify
app.json.sort_keys = False

# Enable Cross-Origin Resource Sharing
CORS(app)

# Define global variables for ShiftOptimizer object
num_employees = 5
num_jobs = 3
num_qualifications = 3
num_days = 5
num_shifts_per_day = 2

# Create an instance of ShiftOptimizer with global parameters
COP_optimizer = ShiftOptimizer(
    num_employees=num_employees,
    num_jobs=num_jobs,
    num_qualifications=num_qualifications,
    num_days=num_days,
    num_shifts_per_day=num_shifts_per_day
)

@app.route('/', methods=['GET'])
def root_endpoint():
    return jsonify(None)

@app.route('/schedule', methods=['GET'])
def get_schedule():
    schedule_data = COP_optimizer.solve_shifts()

    #Take care of sort_keys flag, it could change the ordering of keys when sending the JSON
    response_data = {
        "schedule_data": schedule_data,
        "statistics": {
            "num_employees": num_employees,
            "num_jobs": num_jobs,
            "num_qualifications": num_qualifications,
            "num_days": num_days,
            "num_shifts_per_day": num_shifts_per_day
        }
    }
    return jsonify(response_data)

@app.route('/solve_shifts_what_if', methods=['POST'])
def solve_shifts_with_preferences():
    request_data = request.get_json()
    logging.debug('Received request data: %s', request_data)
    
    job_preferences = [
        request_data.get(f"job{i+1}Preference") for i in range(num_jobs)
    ]
    
    updated_preference_matrix = COP_optimizer.update_preferences(*job_preferences)
    
    temp_optimizer = ShiftOptimizer(
        employee_job_preference_matrix=updated_preference_matrix,
        num_employees=num_employees,
        num_jobs=num_jobs,
        num_qualifications=num_qualifications,
        num_days=num_days,
        num_shifts_per_day=num_shifts_per_day
    )
    
    output_data = temp_optimizer.solve_shifts()

    logging.debug('Type of schedule_data: %s', output_data)
    
    individual_preference_score = temp_optimizer.calculate_individual_preference_score()
    sum_shifts_per_employee = temp_optimizer.sum_shifts_per_employee()

    response_data = {
        "schedule_data": output_data.get('solutions', []),
        "solution_count": output_data.get('number_of_solutions', 0),
        "statistics": {
            "num_employees": num_employees,
            "num_jobs": num_jobs,
            "num_qualifications": num_qualifications,
            "num_days": num_days,
            "num_shifts_per_day": num_shifts_per_day},
        "sum_shifts_per_employee": sum_shifts_per_employee,
        "individual_preference_score": individual_preference_score
        }
    
    logging.debug('Response data with solution_count: %s', response_data)

    return jsonify(response_data)


@app.route('/faq', methods=['GET'])
def get_FAQ():

    #TODO: Is there a GET-method necessary?
    data_FAQ = [
        {"question": "Question 1", "answer": "Answer to Question 1."},
        {"question": "Question 2", "answer": "Answer to Question 2."}
    ]
    return jsonify(data_FAQ)


@app.route('/randomButton', methods=['GET'])
def random_button():
    random_number = random.randint(1, 100)
    return jsonify({"number": random_number})


@app.route('/home', methods=['GET'])
def get_home_data():
    return jsonify(True)

if __name__ == '__main__':
    app.run(port=5000, debug=True)



    

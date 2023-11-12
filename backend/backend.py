from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import logging
from cop_model.ShiftOptimizer import ShiftOptimizer


# Initialize Flask app and configure logging
# app = Flask(__name__)
app = Flask(__name__, static_folder="../xai_frontend/build", static_url_path="/")
logging.basicConfig(filename="app.log", level=logging.DEBUG)

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
    num_shifts_per_day=num_shifts_per_day,
)


@app.route("/<path:path>", methods=["GET"])
def serve_file_in_dir(path):
    return send_from_directory("../xai_frontend/build", path)


@app.route("/", methods=["GET"])
# def root_endpoint():
# return send_from_directory('xai_frontend/public', 'index.html')


def root_endpoint2():
    return send_from_directory("../xai_frontend/build", "index.html")
    # return send_from_directory('../', 'react_test.html')
    # return jsonify(None)


@app.route("/schedule", methods=["GET"])
def get_schedule():
    schedule_data = COP_optimizer.solve_shifts()

    # Take care of sort_keys flag, it could change the ordering of keys when sending the JSON
    response_data = {
        "schedule_data": schedule_data,
        "statistics": {
            "num_employees": num_employees,
            "num_jobs": num_jobs,
            "num_qualifications": num_qualifications,
            "num_days": num_days,
            "num_shifts_per_day": num_shifts_per_day,
        },
    }
    return jsonify(response_data)


@app.route("/solve_shifts_what_if", methods=["POST"])
def solve_shifts_with_preferences():
    request_data = request.get_json()
    logging.debug("Received request data: %s", request_data)

    job_preferences = [request_data.get(f"job{i+1}Preference") for i in range(num_jobs)]

    updated_preference_matrix = COP_optimizer.update_preferences(*job_preferences)

    # Get the availabilityList from the request data
    availabilityList = request_data.get("availabilityList")

    print(availabilityList)

    # Convert the received availabilityList (list of booleans) to 1s and 0s
    availabilityList = [1 if availability else 0 for availability in availabilityList]

    print(availabilityList)

    updated_availability_matrix = COP_optimizer.update_availabilities(availabilityList)

    # Pass the availabilityList to the ShiftOptimizer constructor
    temp_optimizer = ShiftOptimizer(
        employee_job_preference_matrix=updated_preference_matrix,
        availabilityList=updated_availability_matrix,
        num_employees=num_employees,
        num_jobs=num_jobs,
        num_qualifications=num_qualifications,
        num_days=num_days,
        num_shifts_per_day=num_shifts_per_day,
    )

    output_data = temp_optimizer.solve_shifts()

    logging.debug("Type of schedule_data: %s", output_data)


    try:
        individual_preference_score = temp_optimizer.calculate_individual_preference_score()
        sum_shifts_per_employee = temp_optimizer.sum_shifts_per_employee()
    except Exception as e:
        # Handle the exception and provide default values
        print(f"An error occurred: {str(e)}")
        individual_preference_score = 0  # Provide a default value
        sum_shifts_per_employee = 0  # Provide a default value
        print("Using default values instead.")



    response_data = {
        "schedule_data": output_data.get("solutions", []),
        "solution_count": output_data.get("number_of_solutions", 0)
    }

    print(response_data)

    logging.debug("Response data with solution_count: %s", response_data)

    return jsonify(response_data)


@app.route("/faq", methods=["GET"])
def get_FAQ():
    # TODO: Is there a GET-method necessary?
    data_FAQ = [
        {"question": "Question 1", "answer": "Answer to Question 1."},
        {"question": "Question 2", "answer": "Answer to Question 2."},
    ]
    return jsonify(data_FAQ)


@app.route("/randomButton", methods=["GET"])
def random_button():
    random_number = random.randint(1, 100)
    return jsonify({"number": random_number})


@app.route("/home", methods=["GET"])
def get_home_data():
    return jsonify(True)


if __name__ == "__main__":
    app.run(port=5000, debug=True)

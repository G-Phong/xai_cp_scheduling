from flask import Flask, jsonify
from flask_cors import CORS

import random

#from reference_code.My_CP_Sat_Solver_Shifts_FINAL_5E_3J import solve_shifts
from My_CP_Sat_Solver_Shifts_FINAL_5E_3J import solve_shifts

# Eine Flask-Anwendung wird mit dem Namen der Hauptdatei erstellt (__name__).
# Dies erstellt eine Instanz der Flask-App
app = Flask(__name__)

# Das CORS-Modul wird auf die Flask-Anwendung angewendet, um Cross-Origin-Anfragen zu ermöglichen. 
# Dadurch können Anfragen von anderen Domains auf die API-Routen zugreifen.
CORS(app)

# Mit @app.route('/') wird eine Route definiert, die auf die Wurzel-URL zugreift. 
# Das methods=['GET'] gibt an, dass diese Route nur auf HTTP GET-Anfragen reagiert.
@app.route('/', methods=['GET'])
def anzahl_loesungen():
    #Beispiel: Zufallszahl zurücksenden
    # Generiere eine Zufallszahl zwischen 1 und 100
    zufallszahl = random.randint(1, 100) 
   
    return jsonify({"anzahl": zufallszahl})

# Hier sollen die Daten für den Wochenplan ans Frontend gesendet werden.
@app.route('/schedule', methods=['GET'])
def get_schedule():
    # TODO: Schichtplandaten sollen im JSON-Format übertragen werden
    schedule_JSON = {

        "Montag": {
            "Frühschicht": [
                {
                    "employee": "Employee 1",
                    "job": "Job 1"
                },
                {
                    "employee": "Employee 2",
                    "job": "Job 0"
                },
                {
                    "employee": "Employee 4",
                    "job": "Job 2"
                }
            ],
            "Spätschicht": [
                {
                    "employee": "Employee 1",
                    "job": "Job 1"
                },
                {
                    "employee": "Employee 2",
                    "job": "Job 2"
                },
                {
                    "employee": "Employee 4",
                    "job": "Job 0"
                }
            ]
        },
        "Dienstag": {
            "Frühschicht": [
                {
                    "employee": "Employee 0",
                    "job": "Job 0"
                },
                {
                    "employee": "Employee 2",
                    "job": "Job 2"
                },
                {
                    "employee": "Employee 4",
                    "job": "Job 1"
                }
            ],
            "Spätschicht": [
                {
                    "employee": "Employee 1",
                    "job": "Job 2"
                },
                {
                    "employee": "Employee 3",
                    "job": "Job 0"
                },
                {
                    "employee": "Employee 4",
                    "job": "Job 1"
                }
            ]
        },
        # Weitere Tage hinzufügen
    }

    schedule_data_COP = solve_shifts()

    return jsonify(schedule_data_COP)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

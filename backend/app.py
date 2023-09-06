from flask import Flask, jsonify
from flask_cors import CORS

import random
#import sys
#sys.path.append('C:\\TUM_MASTER\MASTERARBEIT_FML\\04_Python_Code\\xai_cp_scheduling')


#COP-Solver Library einfügen aus anderem Ordner
#from ShiftOptimizer import ShiftOptimizer
from cop_model.ShiftOptimizer import ShiftOptimizer


# Verwenden Sie ShiftOptimizer in Ihrer Anwendung


# Eine Flask-Anwendung wird mit dem Namen der Hauptdatei erstellt (__name__).
# Dies erstellt eine Instanz der Flask-App
app = Flask(__name__)

# Das CORS-Modul wird auf die Flask-Anwendung angewendet, um Cross-Origin-Anfragen zu ermöglichen. 
# Dadurch können Anfragen von anderen Domains auf die API-Routen zugreifen.
CORS(app)

# Instanz von ShiftOptimizer mit Parametern
COPoptimizer = ShiftOptimizer(num_employees=5,
                                num_jobs=3,
                                num_qualifications=3,
                                num_days=5,
                                num_shifts_per_day=2)

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
    }

    schedule_data = COPoptimizer.solve_shifts()
    print("Schedule")
    print(schedule_data)

    return jsonify(schedule_data)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

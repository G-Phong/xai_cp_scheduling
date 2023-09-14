from flask import Flask, jsonify, request
from flask_cors import CORS

import random
#import sys
#sys.path.append('C:\\TUM_MASTER\MASTERARBEIT_FML\\04_Python_Code\\xai_cp_scheduling')

import logging


#COP-Solver Library einfügen aus anderem Ordner
#from ShiftOptimizer import ShiftOptimizer
from cop_model.ShiftOptimizer import ShiftOptimizer

# Eine Flask-Anwendung wird mit dem Namen der Hauptdatei erstellt (__name__).
# Dies erstellt eine Instanz der Flask-App
app = Flask(__name__)

# Konfigurieren Sie das Logging
logging.basicConfig(filename='app.log', level=logging.DEBUG)


# The following config line will deactive the alphabetical sorting of the Dict-Keys from jsonify()
app.json.sort_keys = False

# Das CORS-Modul wird auf die Flask-Anwendung angewendet, um Cross-Origin-Anfragen zu ermöglichen. 
# Dadurch können Anfragen von anderen Domains auf die API-Routen zugreifen.
CORS(app)

# Die globalen Variablen für die Parameter für das ShiftOptimizer-Objekt
num_employees = 5
num_jobs = 3
num_qualifications = 3
num_days = 5 #den kann man zu Debugging-Zwecken mal variieren
num_shifts_per_day = 2


# Instanz von ShiftOptimizer mit globalen Parametern
COPoptimizer = ShiftOptimizer(num_employees=num_employees,
                                num_jobs=num_jobs,
                                num_qualifications=num_qualifications,
                                num_days=num_days,
                                num_shifts_per_day=num_shifts_per_day)

# Mit @app.route('/') wird eine Route definiert, die auf die Wurzel-URL zugreift. 
# Das methods=['GET'] gibt an, dass diese Route nur auf HTTP GET-Anfragen reagiert.
@app.route('/', methods=['GET'])
def anzahl_loesungen():
    
    #Redirect zu Home?   
    return jsonify(None)

# Hier sollen die Daten für den Wochenplan ans Frontend gesendet werden.
@app.route('/schedule', methods=['GET'])
def get_schedule():

    # Schichtplandaten sollen im JSON-Format übertragen werden
    schedule_data = COPoptimizer.solve_shifts()

    #print("Schedule")
    #print(schedule_data)

    """     # JSON-Daten in einen JSON-Text umwandeln
    schedule_json_text = json.dumps(schedule_data, indent=4) """
    
    """     # JSON-Text in eine Datei schreiben (z. B. "schedule_data.txt")
    with open("schedule_data.txt", "w") as file:
        file.write(schedule_json_text) """
    
        # Die globalen Variablen als Teil der Antwort senden
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
    
    #ACHTUNG: jsonify() ändert die Reihenfolge der Keys alphabetisch per default
    # Dies habe ich durch app.json.sort_keys = False jedoch global ausgeschaltet 
    return jsonify(response_data) 

# Ändere den bestehenden Endpoint, um Präferenzen zu akzeptieren und die Schichtplanung durchzuführen
@app.route('/solve_shifts_what_if', methods=['POST'])
def solve_shifts_endpoint():

        # Empfange die Präferenzen und andere Daten vom Frontend
        request_data = request.get_json()

        # Lognachricht generieren
        logging.debug('Request data aus endpoint: %s', request_data)

        print("Request data aus endpoint:")
        print(request_data)

        # Extrahiere die Präferenzen aus den Daten
        job1_preference = request_data.get("job1Preference")  
        job2_preference = request_data.get("job2Preference")  
        job3_preference = request_data.get("job3Preference")  
        # Weitere Daten extrahieren, falls vorhanden

        # Aktualisiere die Präferenzen im ShiftOptimizer-Objekt
        COPoptimizer.update_preferences(job1_preference, job2_preference, job3_preference)

        # Führe die Schichtplanung mit den neuen Präferenzen durch (Ein Tupel wird zurückgegeben!)
        schedule_data, optimal_solution_count = COPoptimizer.solve_shifts()

        # Die globalen Variablen als Teil der Antwort senden
        response_data = {
            "schedule_data": schedule_data,
            "solution_count": optimal_solution_count,
            "statistics": {
                "num_employees": num_employees,
                "num_jobs": num_jobs,
                "num_qualifications": num_qualifications,
                "num_days": num_days,
                "num_shifts_per_day": num_shifts_per_day
            }
        }

        print("Response data with solution_count: ")
        print(response_data) #debug purpose

        # Lognachricht mit Antwortdaten generieren
        logging.debug('Response data with solution_count: %s', response_data)

        return jsonify(response_data)



@app.route('/faq', methods=['GET'])
def get_FAQ():

    #TODO: FAQ senden
    #FAQ elements to be returned
    data_FAQ = "to be done"

    #Beispiel-FAQ
    data_FAQ = [
    {
        "question": "Frage 1",
        "answer": "Antwort auf Frage 1."
    },
    {
        "question": "Frage 2",
        "answer": "Antwort auf Frage 2."
    },
    ]


    """ 
    Erstelle eine Flask-API-Route, die die FAQ-Daten als JSON zurückgibt.

    Erstelle eine React-Komponente, die die FAQ-Daten von der Flask-API abruft.

    Render die FAQ-Daten in deiner React-Komponente und implementiere die Klappfunktionen.

    Verwende CSS, um das Erscheinungsbild der FAQ-Tabelle anzupassen.

    Stelle sicher, dass die Navigation zur FAQ-Seite in deinem React-Frontend ordnungsgemäß funktioniert.

    Bereite deine Flask-Anwendung und dein React-Frontend für die Bereitstellung vor, damit sie online verfügbar sind.
    
    """

    return jsonify(data_FAQ)

# Endpoint für die Datenabfrage in /home
@app.route('/randomButton', methods=['GET'])
def randomButton():
    
    #Beispiel: Zufallszahl zurücksenden
    # Generiere eine Zufallszahl zwischen 1 und 100
    zufallszahl = random.randint(1, 100) 
   
    return jsonify({"anzahl": zufallszahl})

# Endpoint für die Datenabfrage in /home
@app.route('/home', methods=['GET'])
def get_home_data():
    
    #TODO: sinnvolle Daten
    status = True
   
    return jsonify(status)


if __name__ == '__main__':
    app.run(port=5000, debug=True)

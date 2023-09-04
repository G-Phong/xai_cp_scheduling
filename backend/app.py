from flask import Flask, jsonify
from flask_cors import CORS
import random

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
    # TODO: Schichtplandaten soll im JSON-Format übertragen werden
    schedule_JSON = {
            
    "Montag": {
        "Frühschicht": [
        {
            "employee": "Max Mustermann",
            "job": "Produktion"
        }
        ],
        "Spätschicht": [
        {
            "employee": "Lisa Müller",
            "job": "Verpackung"
        }
        ]
    },
    "Dienstag": {
        "Frühschicht": [
        {
            "employee": "Hans Schmidt",
            "job": "Produktion"
        }
        ],
        "Spätschicht": [
        {
            "employee": "Anna Maier",
            "job": "Verpackung"
        }
        ]
    },
    "Mittwoch": {
        "Frühschicht": [
        {
            "employee": "Laura Wagner",
            "job": "Produktion"
        }
        ],
        "Spätschicht": [
        {
            "employee": "Markus Weber",
            "job": "Verpackung"
        }
        ]
    },
    "Donnerstag": {
        "Frühschicht": [
        {
            "employee": "Sophie Keller",
            "job": "Produktion"
        }
        ],
        "Spätschicht": [
        {
            "employee": "Paul Becker",
            "job": "Verpackung"
        }
        ]
    },
    "Freitag": {
        "Frühschicht": [
        {
            "employee": "Julia Lehmann",
            "job": "Produktion"
        }
        ],
        "Spätschicht": [
        {
            "employee": "Felix Braun",
            "job": "Verpackung"
        }
        ]
    }
    }

    
    return jsonify(schedule_JSON)

if __name__ == '__main__':
    app.run(port=5000, debug=True)

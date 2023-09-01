from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/anzahlLoesungen', methods=['GET'])
def anzahl_loesungen():
    #für dieses Beispiel senden wir einfach eine feste Zahl zurück.
    return jsonify({"anzahl": 42})

if __name__ == '__main__':
    app.run(port=5000, debug=True)

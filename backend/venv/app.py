from flask import Flask, jsonify # type: ignore

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({"message": "Backend is running successfully!"})

if __name__ == "__main__":
    app.run(debug=True)

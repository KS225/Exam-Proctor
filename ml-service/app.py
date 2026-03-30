from flask import Flask, request, jsonify
import numpy as np
import cv2
from detector import detect_frame

app = Flask(__name__)

@app.route("/")
def home():
    return "ML Proctor Service Running"

@app.route("/analyze", methods=["POST"])
def analyze():

    file = request.files["frame"]

    npimg = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    result = detect_frame(frame)

    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
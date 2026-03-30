from flask import Flask, request, jsonify
import base64
import numpy as np
import cv2

from proctor_ai import analyze_frame

app = Flask(__name__)


@app.route("/detect", methods=["POST"])
def detect():

    data = request.json
    image = data["image"]

    header, encoded = image.split(",", 1)

    img_bytes = base64.b64decode(encoded)
    npimg = np.frombuffer(img_bytes, np.uint8)

    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    result = analyze_frame(frame)

    return jsonify(result)


if __name__ == "__main__":
    app.run(port=6000)
from fastapi import FastAPI
import base64
import numpy as np
import cv2

from face_detector import FaceDetector

app = FastAPI()

detector = FaceDetector()


@app.post("/detect-face")
async def detect_face(data: dict):

    img_data = base64.b64decode(data["image"])

    np_arr = np.frombuffer(img_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    faces = detector.detect(frame)

    return {
        "face_detected": len(faces) > 0,
        "num_faces": len(faces),
        "faces": faces
    }
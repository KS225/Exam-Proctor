import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

def detect_eye_gaze(frame):

    h, w, _ = frame.shape

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb)

    if results.multi_face_landmarks is None:
        return {
            "status": "no_face"
        }

    face_landmarks = results.multi_face_landmarks[0]

    # -------- Landmarks --------

    left_eye_outer = face_landmarks.landmark[33]
    left_eye_inner = face_landmarks.landmark[133]
    left_iris = face_landmarks.landmark[468]

    right_eye_inner = face_landmarks.landmark[362]
    right_eye_outer = face_landmarks.landmark[263]
    right_iris = face_landmarks.landmark[473]

    # Convert to pixels

    lx1 = int(left_eye_outer.x * w)
    lx2 = int(left_eye_inner.x * w)
    lx_iris = int(left_iris.x * w)

    rx1 = int(right_eye_inner.x * w)
    rx2 = int(right_eye_outer.x * w)
    rx_iris = int(right_iris.x * w)

    # -------- Gaze ratio --------

    left_ratio = (lx_iris - lx1) / (lx2 - lx1 + 1e-6)
    right_ratio = (rx_iris - rx1) / (rx2 - rx1 + 1e-6)

    gaze_ratio = (left_ratio + right_ratio) / 2

    # -------- Direction --------

    if gaze_ratio < 0.35:
        gaze = "left"

    elif gaze_ratio > 0.65:
        gaze = "right"

    else:
        gaze = "center"

    # -------- Blink detection --------

    top_eye = face_landmarks.landmark[159]
    bottom_eye = face_landmarks.landmark[145]

    eye_height = abs(top_eye.y - bottom_eye.y)

    blink = eye_height < 0.01

    return {
        "status": "face_detected",
        "gaze": gaze,
        "blink": blink
    }
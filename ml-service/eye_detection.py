import cv2
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh
mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)

def detect_eye_direction(frame):

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = mesh.process(rgb)

    if not results.multi_face_landmarks:
        return "no_face"

    landmarks = results.multi_face_landmarks[0].landmark

    left_eye = landmarks[33]
    right_eye = landmarks[263]
    nose = landmarks[1]

    center = (left_eye.x + right_eye.x) / 2

    if nose.x < center - 0.02:
        return "looking_left"

    if nose.x > center + 0.02:
        return "looking_right"

    return "looking_center"
import cv2
import mediapipe as mp

mp_face_mesh = mp.solutions.face_mesh


class EyeGaze:

    def __init__(self):

        self.mesh = mp_face_mesh.FaceMesh(
            refine_landmarks=True,
            max_num_faces=1
        )

    def detect(self, frame):

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.mesh.process(img_rgb)

        if not results.multi_face_landmarks:
            return "center"

        face = results.multi_face_landmarks[0]

        h, w, _ = frame.shape

        # Right eye landmarks
        left = face.landmark[33]
        right = face.landmark[133]
        iris = face.landmark[468]

        left_x = left.x * w
        right_x = right.x * w
        iris_x = iris.x * w

        eye_width = right_x - left_x

        iris_pos = (iris_x - left_x) / eye_width

        if iris_pos < 0.35:
            return "left"

        if iris_pos > 0.65:
            return "right"

        return "center"
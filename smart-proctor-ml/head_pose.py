import cv2
import mediapipe as mp
import numpy as np

mp_face_mesh = mp.solutions.face_mesh


class HeadPose:

    def __init__(self):

        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=False,
            refine_landmarks=True,
            max_num_faces=1,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6
        )

        # smoothing buffers
        self.yaw_history = []
        self.pitch_history = []

    def smooth(self, value, history):

        history.append(value)

        if len(history) > 5:
            history.pop(0)

        return sum(history) / len(history)

    def get_pose(self, frame):

        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.face_mesh.process(img_rgb)

        if not results.multi_face_landmarks:
            return "center"

        face_landmarks = results.multi_face_landmarks[0]

        h, w, _ = frame.shape

        face_2d = []
        face_3d = []

        landmark_ids = [33, 263, 1, 61, 291, 199]

        for idx, lm in enumerate(face_landmarks.landmark):

            if idx in landmark_ids:

                x = int(lm.x * w)
                y = int(lm.y * h)

                face_2d.append([x, y])
                face_3d.append([x, y, lm.z])

        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)

        focal_length = w

        cam_matrix = np.array([
            [focal_length, 0, w / 2],
            [0, focal_length, h / 2],
            [0, 0, 1]
        ])

        dist_matrix = np.zeros((4, 1))

        success, rot_vec, trans_vec = cv2.solvePnP(
            face_3d,
            face_2d,
            cam_matrix,
            dist_matrix
        )

        rmat, _ = cv2.Rodrigues(rot_vec)

        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

        pitch = angles[0] * 360
        yaw = angles[1] * 360

        # smoothing
        pitch = self.smooth(pitch, self.pitch_history)
        yaw = self.smooth(yaw, self.yaw_history)

        if yaw > 15:
            return "right"

        if yaw < -15:
            return "left"

        if pitch > 18:
            return "down"

        if pitch < -15:
            return "up"

        return "center"
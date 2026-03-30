import cv2
import mediapipe as mp

mp_face = mp.solutions.face_detection


class FaceDetector:

    def __init__(self):

        self.detector = mp_face.FaceDetection(
            model_selection=0,
            min_detection_confidence=0.6
        )

    def detect(self, frame):

        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.detector.process(rgb)

        faces = []

        if results.detections:

            for detection in results.detections:

                bbox = detection.location_data.relative_bounding_box

                x = int(bbox.xmin * w)
                y = int(bbox.ymin * h)
                width = int(bbox.width * w)
                height = int(bbox.height * h)

                faces.append({
                    "x": x,
                    "y": y,
                    "w": width,
                    "h": height
                })

        return faces
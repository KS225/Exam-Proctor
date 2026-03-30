from fastapi import FastAPI
import base64
import numpy as np
import cv2

from face_detector import FaceDetector
from head_pose import HeadPose
from object_detector import ObjectDetector
from movement_analyzer import MovementAnalyzer
from eye_gaze import EyeGaze

app = FastAPI()

detector = FaceDetector()
pose = HeadPose()
object_detector = ObjectDetector()
movement = MovementAnalyzer()
gaze = EyeGaze()


# -----------------------------
# Check if student is too far
# -----------------------------
def face_too_far(faces, frame):

    if len(faces) == 0:
        return False

    h, w, _ = frame.shape

    face = faces[0]

    area = face["w"] * face["h"]
    frame_area = w * h

    ratio = area / frame_area

    return ratio < 0.03


# -----------------------------
# Main detection endpoint
# -----------------------------
@app.post("/detect")
async def detect(data: dict):

    try:
        image = data["image"]

        # Decode base64 image
        img_bytes = base64.b64decode(image)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Resize frame for better performance
        frame = cv2.resize(frame, (640, 480))

        # -----------------------------
        # FACE DETECTION
        # -----------------------------
        faces = detector.detect(frame)

        direction = "center"
        gaze_direction = "center"

        if len(faces) > 0:
            direction = pose.get_pose(frame)
            gaze_direction = gaze.detect(frame)

        # -----------------------------
        # MOVEMENT TRACKING
        # -----------------------------
        movement.update(direction)
        frequent = movement.frequent_movement()

        # -----------------------------
        # OBJECT DETECTION
        # -----------------------------
        objects, object_boxes = object_detector.detect(frame)

        boxes = []

        # Face boxes
        for f in faces:
            boxes.append({
                "box": [f["x"], f["y"], f["x"] + f["w"], f["y"] + f["h"]],
                "label": "Face"
            })

        # Object boxes (ensure correct format)
        for obj in object_boxes:
            boxes.append({
                "box": obj["box"],
                "label": obj["label"]
            })

        # -----------------------------
        # VIOLATION LOGIC
        # -----------------------------
        violations = []

        # Object violations
        if "cell phone" in objects:
            violations.append("Phone Detected")

        if "laptop" in objects:
            violations.append("Laptop Detected")

        # Face violations
        if len(faces) == 0:
            violations.append("Face Not Visible")

        if len(faces) > 1:
            violations.append("Multiple Faces Detected")

        if face_too_far(faces, frame):
            violations.append("Too Far From Screen")

        # Movement violations
        if frequent:
            violations.append("Frequent Head Movement")

        if direction in ["left", "right", "down"]:
            violations.append(f"Looking {direction}")

        # Final flags
        violation = len(violations) > 0

        # Clean object labels
        clean_objects = [obj.capitalize() for obj in objects]

        # -----------------------------
        # FINAL RESPONSE
        # -----------------------------
        return {
            "num_faces": len(faces),
            "faces": faces,

            "direction": direction,
            "gaze": gaze_direction,

            "objects": clean_objects,

            "boxes": boxes,

            "violation": violation,
            "violations": violations,
            "type": violations[0] if violations else None
        }

    except Exception as e:
        print("ML ERROR:", e)
        return {"error": str(e)}
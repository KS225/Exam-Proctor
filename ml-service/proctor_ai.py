import cv2
import mediapipe as mp
import numpy as np
from ultralytics import YOLO


# ===============================
# LOAD MODELS
# ===============================

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh

face_detector = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True
)

# YOLO model
yolo_model = YOLO("yolov8s.pt")


# ===============================
# HEAD POSE DETECTION (3D)
# ===============================

def detect_head_pose(frame):

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(rgb)

    if not results.multi_face_landmarks:
        return "center"

    face_landmarks = results.multi_face_landmarks[0]

    h, w, _ = frame.shape

    landmark_ids = [33, 263, 1, 61, 291, 199]

    face_2d = []
    face_3d = []

    for idx in landmark_ids:

        lm = face_landmarks.landmark[idx]

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

    dist_matrix = np.zeros((4, 1), dtype=np.float64)

    success, rot_vec, trans_vec = cv2.solvePnP(
        face_3d,
        face_2d,
        cam_matrix,
        dist_matrix
    )

    rmat, _ = cv2.Rodrigues(rot_vec)

    angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

    x = angles[0] * 360
    y = angles[1] * 360

    if y < -10:
        return "looking_left"

    if y > 10:
        return "looking_right"

    if x < -10:
        return "looking_down"

    if x > 10:
        return "looking_up"

    return "center"


# ===============================
# OBJECT DETECTION
# ===============================

def detect_objects(frame):

    boxes = []

    results = yolo_model(frame, conf=0.25)

    for r in results:

        for box in r.boxes:

            cls = int(box.cls[0])
            label = yolo_model.names[cls]

            confidence = float(box.conf[0])

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            print("Detected:", label)

            boxes.append({
                "label": f"{label} {confidence:.2f}",
                "box": [x1, y1, x2, y2]
            })

            if label in ["cell phone", "book", "laptop", "tablet"]:

                return True, label, boxes

    return False, None, boxes


# ===============================
# MAIN ANALYSIS FUNCTION
# ===============================

def analyze_frame(frame):

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    detection_results = face_detector.process(rgb)

    boxes = []

    if not detection_results.detections:

        return {
            "violation": True,
            "type": "no_face",
            "boxes": []
        }

    if len(detection_results.detections) > 1:

        return {
            "violation": True,
            "type": "multiple_faces",
            "boxes": []
        }

    h, w, _ = frame.shape

    for detection in detection_results.detections:

        bbox = detection.location_data.relative_bounding_box

        x1 = int(bbox.xmin * w)
        y1 = int(bbox.ymin * h)
        x2 = int((bbox.xmin + bbox.width) * w)
        y2 = int((bbox.ymin + bbox.height) * h)

        boxes.append({
            "label": "face",
            "box": [x1, y1, x2, y2]
        })

    # ===============================
    # HEAD POSE
    # ===============================

    head_direction = detect_head_pose(frame)

    if head_direction != "center":

        return {
            "violation": True,
            "type": head_direction,
            "boxes": boxes
        }

    # ===============================
    # OBJECT DETECTION
    # ===============================

    obj_violation, obj_type, obj_boxes = detect_objects(frame)

    boxes.extend(obj_boxes)

    if obj_violation:

        return {
            "violation": True,
            "type": obj_type,
            "boxes": boxes
        }

    return {
        "violation": False,
        "boxes": boxes
    }
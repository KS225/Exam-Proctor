from face_detection import detect_face
from head_pose import detect_head_pose
from object_detection import detect_objects
from violation_logger import log_violation

frame_counter = 0

last_persons = 0
last_phone = False
last_obj = False
last_boxes = []
last_labels = []


def analyze_frame(frame):

    global frame_counter
    global last_persons, last_phone, last_obj
    global last_boxes, last_labels

    frame_counter += 1

    violations = []

    faces = detect_face(frame)

    # Run YOLO every 10 frames but keep previous results
    if frame_counter % 10 == 0:

        persons, phone, obj, boxes, labels = detect_objects(frame)

        last_persons = persons
        last_phone = phone
        last_obj = obj
        last_boxes = boxes
        last_labels = labels

    persons = last_persons
    phone = last_phone
    obj = last_obj
    boxes = last_boxes
    labels = last_labels

    # NO FACE
    if len(faces) == 0:

        if phone:
            violations.append("phone_detected")

        elif obj:
            violations.append("object_detected")

        else:
            violations.append("no_face")

        return {
            "violations": violations,
            "boxes": boxes,
            "labels": labels
        }

    # MULTIPLE FACES
    if len(faces) > 1:
        violations.append("multiple_faces")

    # MULTIPLE PEOPLE
    if persons > 1:
        violations.append("multiple_people")

    # HEAD MOVEMENT
    head = detect_head_pose(frame)

    if head in ["looking_left", "looking_right", "looking_up", "looking_down"]:
        violations.append(head)

    # PHONE has priority
    if phone:
        violations.append("phone_detected")

    elif obj:
        violations.append("object_detected")

    return {
        "violations": violations,
        "boxes": boxes,
        "labels": labels
    }
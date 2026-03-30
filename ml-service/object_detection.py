from ultralytics import YOLO

model = YOLO("yolov8n.pt")

def detect_objects(frame):

    results = model(frame, conf=0.5, verbose=False)

    persons = 0
    phone = False
    object_detected = False

    boxes = []
    labels = []

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])
            label = model.names[cls]
            conf = float(box.conf[0])

            if conf < 0.5:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # 👤 PERSON
            if label == "person":
                persons += 1
                boxes.append([x1, y1, x2, y2])
                labels.append("Person")

            # 📱 PHONE
            elif label == "cell phone":
                phone = True
                object_detected = True
                boxes.append([x1, y1, x2, y2])
                labels.append("Phone")

            # 📚 OTHER OBJECTS
            elif label in ["book", "laptop"]:
                object_detected = True
                boxes.append([x1, y1, x2, y2])
                labels.append(label.capitalize())

    # 🚨 VIOLATION LOGIC
    violation = False
    violation_type = None

    if persons > 1:
        violation = True
        violation_type = "Multiple persons detected"

    elif phone:
        violation = True
        violation_type = "Phone detected"

    elif object_detected:
        violation = True
        violation_type = "Suspicious object detected"

    # ✅ RETURN JSON READY DATA
    return {
        "persons": persons,
        "phone": phone,
        "object_detected": object_detected,
        "boxes": boxes,
        "labels": labels,
        "violation": violation,
        "type": violation_type
    }
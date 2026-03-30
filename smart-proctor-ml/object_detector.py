from ultralytics import YOLO


class ObjectDetector:

    def __init__(self):

        # Balanced model (l is heavy, n/s is faster)
        self.model = YOLO("yolov8n.pt")

        # 🎯 Only cheating-related objects
        self.targets = [
            "cell phone",
            "laptop",
            "book"
        ]

    def detect(self, frame):

        # 🔥 Disable logs + better threshold
        results = self.model(frame, conf=0.5, verbose=False)

        boxes = []
        detections = set()  # avoid duplicates

        for r in results:

            for box in r.boxes:

                cls = int(box.cls[0])
                label = r.names[cls]
                conf = float(box.conf[0])

                if label not in self.targets:
                    continue

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # Add bounding box
                boxes.append({
                    "box": [x1, y1, x2, y2],
                    "label": label.capitalize()
                })

                detections.add(label)

        return list(detections), boxes
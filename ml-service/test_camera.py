import cv2
from smart_proctor import analyze_frame

cap = cv2.VideoCapture(0)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

while True:

    ret, frame = cap.read()

    frame = cv2.flip(frame,1)

    frame = cv2.resize(frame,(640,480))

    result = analyze_frame(frame)

    if result is None:
        result = {"violations": [], "boxes": [], "labels": []}

    # Draw bounding boxes
    for box, label in zip(result["boxes"], result["labels"]):

        x1, y1, x2, y2 = box

        cv2.rectangle(frame,(x1,y1),(x2,y2),(0,255,0),2)

        cv2.putText(
            frame,
            label,
            (x1,y1-10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0,255,0),
            2
        )

    text = ", ".join(result["violations"]) if result["violations"] else "No Violations"

    cv2.putText(frame,text,(20,40),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,(0,0,255),2)

    cv2.imshow("Exam Proctor",frame)

    if cv2.waitKey(1)==27:
        break

cap.release()
cv2.destroyAllWindows()
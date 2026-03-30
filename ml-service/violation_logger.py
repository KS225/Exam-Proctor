import cv2
import os
import time
from datetime import datetime

last_log = {}

if not os.path.exists("screenshots"):
    os.mkdir("screenshots")

def log_violation(frame, violation):

    now = time.time()

    if violation in last_log and now - last_log[violation] < 5:
        return

    last_log[violation] = now

    timestamp = datetime.now().strftime("%H-%M-%S")

    filename = f"screenshots/{violation}_{timestamp}.jpg"

    cv2.imwrite(filename, frame)

    with open("violations_log.txt","a") as f:
        f.write(f"{timestamp} - {violation} - {filename}\n")
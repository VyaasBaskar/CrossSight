from io import BytesIO
from ultralytics import YOLO
import cv2
import numpy as np
import base64

def __IM_DECODE(raw_img):
    img_bytes = BytesIO(raw_img.read())
    return cv2.imdecode(np.frombuffer(img_bytes.getvalue(), np.uint8), cv2.IMREAD_COLOR)

def __IM_ENCODE(img):
    img = cv2.resize(img, (160, 256))
    _, buffer = cv2.imencode(".jpg", img)
    return base64.b64encode(buffer).decode('utf-8')
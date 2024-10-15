from ultralytics import YOLO
import cv2
import numpy as np
import math

model = YOLO("crosswalk.pt", task="segment")

def __RUN_SEGMENTATION(img):
    height, width, channels = img.shape

    comp_img = np.zeros((height, width, channels), dtype=np.uint8)
    
    results = model(img, conf=0.84, iou=0.2)[0]

    if results is None or results.masks is None:
        return comp_img
    
    for mask, box in zip(results.masks, results.boxes):
        points = np.int32([mask.xy])

        cv2.fillPoly(comp_img, points, (255, 255, 255))

    return cv2.resize(comp_img, (160, 256))
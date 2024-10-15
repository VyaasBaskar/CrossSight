from ultralytics import YOLO
import cv2
import numpy as np
import math

from drawing import drawline

model = YOLO("crosswalk.pt", task="segment")

MODEL_CONFIDENCE = 0.84
MODEL_IOU = 0.2

def __RUN_SEGMENTATION(img):
    global model, MODEL_CONFIDENCE, MODEL_IOU
    
    height, width, channels = img.shape

    comp_img = np.zeros((height, width, channels), dtype=np.uint8)
    
    results = model(img, conf=MODEL_CONFIDENCE, iou=MODEL_IOU)[0]

    if results is None or results.masks is None:
        return comp_img
    
    for mask, box in zip(results.masks, results.boxes):
        points = np.int32([mask.xy])

        cv2.fillPoly(comp_img, points, (0, 255, 0))

    return cv2.resize(comp_img, (160, 256))

def __CALCULATE_SHAPE(mask_img):
    global model, MODEL_CONFIDENCE, MODEL_IOU

    edges = cv2.Canny(mask_img, 30, 100)

    lines = cv2.HoughLines(edges, 1, np.pi/180, threshold=30)

    # r, theta. x1, y1. x2, y2
    lineL = ((0.0, 0.0), (0.0, 0.0), (0.0, 0.0))
    lineR = ((0.0, 0.0), (0.0, 0.0), (0.0, 0.0))

    if lines is not None:
        for line in lines:
            rho, theta = line[0]

            angle = math.degrees(theta)

            if not ((angle >= 20 and angle <= 65) or (angle >= 115 and angle <= 150)):
                continue

            a = np.cos(theta)
            b = np.sin(theta)
            x0 = a * rho
            y0 = b * rho
            x1 = int(x0 + 1000 * (-b))
            y1 = int(y0 + 1000 * (a))
            x2 = int(x0 - 1000 * (-b))
            y2 = int(y0 - 1000 * (a))

            if (angle >= 20 and angle <= 65):
                lineL = ((rho, angle), (x1, y1), (x2, y2))
            if (angle >= 115 and angle <= 150):
                lineR = ((rho, angle), (x1, y1), (x2, y2))

    if (lineL[0][0] == 0.0 or lineR[0][0] == 0.0):
        return ((lineL, lineR), (0.0, 0.0))


    m_lineL = (lineL[1][1] - lineL[2][1]) / (lineL[1][0] - lineL[2][0])
    b_lineL = lineL[1][1] - (lineL[1][0] * m_lineL)
    
    m_lineR = (lineR[1][1] - lineR[2][1]) / (lineR[1][0] - lineR[2][0])
    b_lineR = lineR[1][1] - (lineR[1][0] * m_lineR)

    intersection_pt = ((b_lineR - b_lineL) / (m_lineL - m_lineR), (m_lineL * b_lineR - m_lineR * b_lineL) / (m_lineL - m_lineR))

    return ((lineL, lineR), intersection_pt)

def __DRAW_SHAPE(img, shape):
    lineL = shape[0][0]
    lineR = shape[0][1]

    if (lineL[0][0] != 0.0):
        drawline(img, lineL[1], lineL[2], (0, 0, 255), 2, 'dotted', 10)
    if (lineR[0][0] != 0.0):
        drawline(img, lineR[1], lineR[2], (0, 0, 255), 2, 'dotted', 10)

    return img

def __DRAW_MASK(img, mask):
    img = cv2.resize(img, (160, 256))
    mask = cv2.resize(mask, (160, 256))
    return cv2.addWeighted(img, 1, mask, 0.5, 0)

def __GET_DRIFT(img, shape):
    DRIFT_THRESH = 0.2

    if shape[1][0] == 0.0:
        return 0.0

    width = img.shape[1]
    pct_diff = 2.0 * shape[1][0] - (width / 2.0) / width

    return pct_diff
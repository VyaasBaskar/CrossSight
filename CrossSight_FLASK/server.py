from flask import Flask, request, send_file
from flask_cors import CORS

from crosswalk_seg import __RUN_SEGMENTATION, __CALCULATE_SHAPE, __DRAW_MASK, __DRAW_SHAPE, __GET_DRIFT
from img_utils import __IM_DECODE, __IM_ENCODE

import cv2

from time import time

app = Flask(__name__)

last_image: cv2.Mat | None = None 
mask_image: cv2.Mat | None = None
annotated_image: cv2.Mat | None = None

processing_time = 0.0

shape = None

def process_image():
    global mask_image, last_image, annotated_image, shape, processing_time

    try:
        start_time = time()
        mask_image = __RUN_SEGMENTATION(last_image)
        shape = __CALCULATE_SHAPE(mask_image)
        resized_last_image = cv2.resize(last_image, (160, 256))
        annotated_image = __DRAW_SHAPE(__DRAW_MASK(resized_last_image, mask_image), shape)
        processing_time = time() - start_time
    except Exception as exc:
        print("ERROR [Process Image]: Could not process image. Exiting...")
        print(exc)

@app.route('/upload', methods=['POST'])
def upload():
    global last_image

    if 'raw_img' not in request.files:
        print("ERROR [Upload]: Could not extract image from request. Exiting...")
        return {"success": 0}
    
    try:
        raw_img = request.files['raw_img']
        last_image = __IM_DECODE(raw_img)
    except Exception as exc:
        print("ERROR [Upload]: Could not decode image. Exiting...")
        print(exc)
        return {"success": 0}
    
    return {"success": 1}

@app.route('/get_annotated', methods=['GET'])
def get_annotated():
    global annotated_image

    process_image()

    if annotated_image is None:
        print("ERROR [Get Annotated]: Mask Image is None. Exiting...")
        return {"success": 0}
    
    try:
        return {"success": 1, "annotated_img": __IM_ENCODE(annotated_image), "processing_time": processing_time}
    except Exception as exc:
        print("ERROR [Get Annotated]: Error sending image. Exiting...")
        print(exc)
        return {"success": 0}
    
@app.route('/get_crosswalk_data', methods=['GET'])
def get_crosswalk_data():
    global shape

    if shape is None:
        print("ERROR [Get Shape]: Shape is None. Exiting...")
        return {"success": 0}
    
    return {"success": 1, "drift": __GET_DRIFT(shape), "detected": shape[0][0] != 0.0}


if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
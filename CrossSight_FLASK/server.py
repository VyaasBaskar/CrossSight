from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

from crosswalk_seg import __RUN_SEGMENTATION, __CALCULATE_SHAPE, __DRAW_MASK, __DRAW_SHAPE, __GET_DRIFT
from img_utils import __IM_DECODE, __IM_ENCODE

import speech_recognition as sr

from gpt import vehicular_detection, sign_reading

from transcribe import transcribe

import cv2

from time import time

app = Flask(__name__)

last_image: cv2.Mat | None = None 
mask_image: cv2.Mat | None = None
annotated_image: cv2.Mat | None = None

processing_time = 0.0

shape = None

last_cw = {"success": 0}

voice_cmds = []

text_audios = []

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    global text_audios

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400 #no return

    file = request.files['file']

    # print the file name
    print(file.filename)
    # store the file in the current directory
    file.save(file.filename)
    text = transcribe()
    text_audios.append(text)

@app.route('/send_image', methods=['POST'])
def send_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    print(file.filename)
    file.save("image.jpg")
    return jsonify("Image received")

@app.route('/gpt', methods=['POST'])
def gpt3():
    data = request.json
    message = data['message']
    response = chat_completion(message)
    return jsonify(response)


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
        cv2.imwrite("img.png", last_image)
    except Exception as exc:
        print("ERROR [Upload]: Could not decode image. Exiting...")
        print(exc)
        return {"success": 0}
    
    return {"success": 1}

@app.route('/get_annotated', methods=['GET'])
def get_annotated():
    global annotated_image, last_image

    process_image()

    if annotated_image is None:
        print("ERROR [Get Annotated]: Mask Image is None. Exiting...")
        return {"success": 0}
    
    try:
        return {"success": 1, "annotated_img": __IM_ENCODE(last_image), "processing_time": processing_time}
    except Exception as exc:
        print("ERROR [Get Annotated]: Error sending image. Exiting...")
        print(exc)
        return {"success": 0}
    
def get_crosswalk_data():
    global shape, annotated_image

    if shape is None:
        print("ERROR [Get Shape]: Shape is None. Exiting...")
        return {"success": 0}
    
    drift = __GET_DRIFT(annotated_image, shape)
    
    return {"success": 1, "drift": drift, "detected": drift != 0.0}

def loop_voice_cmds():
    global voice_cmds
    global last_cw

    new_cw = get_crosswalk_data()

    if new_cw["success"] == 1 and new_cw["detected"] and last_cw["success"] == 1 and not last_cw["detected"]:
        voice_cmds.append("Crosswalk detected.")
    elif new_cw["success"] == 1 and not new_cw["detected"] and last_cw["success"] == 1 and last_cw["detected"]:
        voice_cmds.append("Crosswalk lost.")
    elif new_cw["success"] == 1 and new_cw["drift"] > 0.3 and last_cw["success"] == 1 and abs(last_cw["drift"]) <= 0.3:
        voice_cmds.append("Drifting right.")
    elif new_cw["success"] == 1 and new_cw["drift"] < -0.3 and last_cw["success"] == 1 and abs(last_cw["drift"]) <= 0.3:
        voice_cmds.append("Drifting left.")
    elif new_cw["success"] == 1 and abs(new_cw["drift"]) < 0.3 and last_cw["success"] == 1 and abs(last_cw["drift"]) > 0.3:
        voice_cmds.append("Drift corrected.")
    last_cw = new_cw

    if len(text_audios) == 0:
        return
    
    text = text_audios.pop(0)
    text_list = text.split(" ")

    if ("cars" in text_list or ("cross"  in text_list and "street" in text_list)):
        voice_cmds.append(vehicular_detection(text))
    elif ("read" in text_list or "sign" in text_list):
        voice_cmds.append(sign_reading(text))
    # else:
    #     voice_cmds.append(chat_completion(text))
    

@app.route('/get_voice_cmd', methods=['GET'])
def get_voice_cmd():
    loop_voice_cmds()
    if (voice_cmds.__len__() == 0):
        return {"success": 0}
    else:
        return {"success": 1, "text": voice_cmds.pop(0)}



if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
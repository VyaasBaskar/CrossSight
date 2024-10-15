from flask import Flask, request, send_file
from io import BytesIO
from flask_cors import CORS

from ultralytics import YOLO
import cv2
import numpy as np

model = YOLO("crosswalk.pt", task="segment")

app = Flask(__name__)

@app.route('/upload_img', methods=['POST'])
def upload_img():
    print("Request received")
    print(request.files)
    if 'raw_img' not in request.files:
        print("Raw IMG not supplied")
        return {"success": 0}

    raw_img = request.files['raw_img']
    img_bytes = BytesIO(raw_img.read())

    img = cv2.imdecode(np.frombuffer(img_bytes.getvalue(), np.uint8), cv2.IMREAD_COLOR)
    results = model(img, conf=0.84, iou=0.2)[0]
    print(results)
    
    return {"success": 1}

if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
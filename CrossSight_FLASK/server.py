from flask import Flask, request, send_file
from flask_cors import CORS

from crosswalk_seg import __RUN_SEGMENTATION
from img_utils import __IM_DECODE, __IM_ENCODE

app = Flask(__name__)

@app.route('/crosswalk_detection', methods=['POST'])
def crosswalk_detection():
    print("Running Crosswalk Detection...")
    if 'raw_img' not in request.files:
        print("Could not extract image from request. Exiting...")
        return {"success": 0}
    
    raw_img = request.files['raw_img']
    img = __IM_DECODE(raw_img)
    
    comp_img = __RUN_SEGMENTATION(img)
    
    return {"success": 1, "annotated_img": __IM_ENCODE(img)}

if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
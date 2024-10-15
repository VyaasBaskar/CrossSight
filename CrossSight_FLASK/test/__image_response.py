from flask import Flask, request, send_file
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)

@app.route('/upload_img', methods=['POST'])
def upload_img():
    print("Request received")
    print(request.files)
    if 'raw_img' not in request.files:
        print("Raw IMG not supplied")
        return {"success": 0}, 400

    raw_img = request.files['raw_img']
    img_bytes = BytesIO(raw_img.read())
    
    return {"success": 1}

if __name__ == '__main__':
    CORS(app)
    app.run(host="0.0.0.0", port=5000, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  

pipe = pipeline("text-classification", model="vikram71198/distilroberta-base-finetuned-fake-news-detection")

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight'})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    
    result = pipe(text)[0]

    
    prediction = result['label']
    confidence = float(result['score'])  

    
    if prediction == "LABEL_0":
        prediction = "Fake News"
    elif prediction == "LABEL_1":
        prediction = "Real News"

    
    response = jsonify({
        "prediction": prediction,
        "confidence": confidence
    })
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

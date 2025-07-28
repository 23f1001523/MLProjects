from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.options import get_dropdown_options
# from utils.churn_predictor import predict_churn
from utils.ipl_predictor import predict_ipl
from utils.second_innings_predictor import run_second_innings_prediction
# from utils.recommender import recommend_movies


app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello World"



@app.route("/api/options", methods=["GET"])
def get_options():
    return jsonify(get_dropdown_options())

@app.route("/api/predict/ipl", methods=["POST"])
def predict_match_winner():
    data = request.json
    result = predict_ipl(data)
    return jsonify(result)

@app.route("/api/predict/second_innings", methods=["POST"])
def second_innings_route():
    try:
        data = request.get_json()
        print("Received data:", data)

        result = run_second_innings_prediction(data)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result)
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400
# @app.route("/api/predict/churn", methods=["POST"])
# def churn():
#     data = request.json
#     result = predict_churn(data)
#     return jsonify(result)


# @app.route("/api/recommend/movies", methods=["POST"])
# def recommend():
#     data = request.json
#     result = recommend_movies(data.get("movie"))
#     return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
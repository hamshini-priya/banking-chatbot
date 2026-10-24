import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set")

genai.configure(api_key=API_KEY)
app = Flask(__name__)

# Configure Gemini API using an environment variable
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY is not set. "
        "Set the environment variable before starting the app."
    )

genai.configure(api_key=API_KEY)


# Function to get response from Gemini API
def chatbot_response(user_input):
    try:
        model = genai.GenerativeModel("models/gemini-3.8-flash")
        response = model.generate_content(user_input)

        if hasattr(response, "text") and response.text:
            return response.text
        else:
            return "Sorry, I couldn't fetch a response. Please try again later."

    except Exception as e:
        app.logger.exception("Gemini API request failed")
        return "Sorry, something went wrong. Please try again later."


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        return jsonify({
            "message": "Welcome to the KVB Chatbot! "
                       "Send a POST request with 'message' to chat."
        })

    data = request.get_json(silent=True) or {}
    user_input = data.get("message")

    if not isinstance(user_input, str) or not user_input.strip():
        return jsonify({"error": "Please provide a valid message."}), 400

    response = chatbot_response(user_input)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=False)

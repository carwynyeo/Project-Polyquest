import pandas as pd
import numpy as np
from xgboost import XGBClassifier
import joblib

# Load the model and label encoder
model = joblib.load("./data/xgb_model.pkl")  # Replace with your trained model path
label_encoder = joblib.load("./data/label_encoder.pkl")  # Load the label encoder

# Load quiz questions from the CSV file
quiz_questions = pd.read_csv("./data/quiz-questions.csv")


# Function to take the quiz
def take_quiz():
    print(
        "Welcome to the course recommendation quiz! Please answer the following questions (1-5 scale):"
    )
    answers = []

    for index, question in quiz_questions.iterrows():
        while True:
            try:
                response = int(input(f"{question['Question']} (1-5): "))
                if response in [1, 2, 3, 4, 5]:
                    answers.append(response)
                    break
                else:
                    print("Invalid input. Please enter a number between 1 and 5.")
            except ValueError:
                print("Invalid input. Please enter a valid number.")

    return np.array(answers).reshape(1, -1)


# Function to make predictions
def predict_course(answers):
    # Predict and rank courses
    predicted_probabilities = model.predict_proba(answers)
    predicted_courses = label_encoder.inverse_transform(model.classes_)

    # Rank courses based on probabilities
    ranked_courses = sorted(
        zip(predicted_courses, predicted_probabilities[0]),
        key=lambda x: x[1],
        reverse=True,
    )

    print("\nYour recommended courses, ranked by fit:")
    for rank, (course, prob) in enumerate(ranked_courses, 1):
        print(f"{rank}. {course} (fit: {prob:.2f})")


# Main function to run the quiz and predict results
def main():
    answers = take_quiz()
    predict_course(answers)


if __name__ == "__main__":
    main()

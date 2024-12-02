import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import joblib
import numpy as np

# Update the path to the balanced dataset
responses_path = "./data/quiz-responses-balanced.csv"  # Ensure this path is correct
responses_df = pd.read_csv(responses_path)

# Separate features and target variable
X = responses_df.iloc[:, 1:-1]  # Features
y = responses_df["Recommended Course"]  # Target variable

# Encode the target variable
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Initialize the XGBoost classifier with class weights
xgb_model = XGBClassifier(
    random_state=42,
    scale_pos_weight=len(y_train) / (len(set(y_train)) * np.bincount(y_encoded)),
    use_label_encoder=False,
    eval_metric="mlogloss",
)

# Define the parameter grid for hyperparameter tuning
param_dist = {
    "n_estimators": [100, 200, 300],
    "max_depth": [3, 5, 7, 9],
    "learning_rate": [0.01, 0.1, 0.2],
    "subsample": [0.6, 0.8, 1.0],
    "colsample_bytree": [0.6, 0.8, 1.0],
}

# Perform Randomized Search for hyperparameter tuning
random_search = RandomizedSearchCV(
    estimator=xgb_model,
    param_distributions=param_dist,
    scoring="f1_weighted",
    cv=3,
    n_iter=50,  # Number of different combinations to try
    random_state=42,
    n_jobs=-1,
)

# Fit the Randomized Search model
random_search.fit(X_train, y_train)

# Use the best model from Randomized Search
best_model = random_search.best_estimator_

# Make predictions on the test set
y_pred = best_model.predict(X_test)

# Evaluate the model
report = classification_report(
    y_test,
    y_pred,
    target_names=label_encoder.inverse_transform(np.unique(y_encoded)),
)
print(report)

# Save the trained model to a file for future use
model_filename = "./data/xgb_model.pkl"
joblib.dump(best_model, model_filename)

# Save the label encoder for future predictions
label_encoder_filename = "./data/label_encoder.pkl"
joblib.dump(label_encoder, label_encoder_filename)

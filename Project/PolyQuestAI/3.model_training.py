import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

# Load the generated responses
responses_path = "./data/quiz-responses-balanced.csv"
responses_df = pd.read_csv(responses_path)

# Separate features and target variable
X = responses_df.iloc[
    :, 1:-1
]  # All columns except the first and last (recommended course and recommendation)
y = responses_df["Recommended Course"]  # Target variable

# Encode the target variable (recommended course)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)

# Initialize the Random Forest classifier
rf_model = RandomForestClassifier(random_state=42)

# Train the model
rf_model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = rf_model.predict(X_test)

# Get the unique classes from the predictions and the actual labels
unique_classes = sorted(set(y_test).union(set(y_pred)))

# Evaluate the model using only the present classes
report = classification_report(
    y_test,
    y_pred,
    labels=unique_classes,
    target_names=label_encoder.inverse_transform(unique_classes),
)
print(report)

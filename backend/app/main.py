"""
FastAPI Backend for Heart Disease Prediction
"""

from fastapi import FastAPI, HTTPException
import pickle
import numpy as np
import uvicorn
import os
from typing import List

# Import schemas from the schemas module
from schemas.input_output import (
    PatientData,
    PredictionResponse,
    HealthResponse,
    ModelInfoResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
)

# Initialize FastAPI app
app = FastAPI(
    title="Heart Disease Prediction API",
    description="API for predicting heart disease using LogisticRegression model",
    version="1.0.0",
)

# Load the trained model and preprocessing objects
MODEL_DIR = "models"
model_path = os.path.join(MODEL_DIR, "logistic_model.pkl")
scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
features_path = os.path.join(MODEL_DIR, "features.pkl")

# Global variables for model components
model = None
scaler = None
features = None


@app.on_event("startup")
async def load_model():
    """Load model and components on startup"""
    global model, scaler, features

    try:
        model = pickle.load(open(model_path, "rb"))
        scaler = pickle.load(open(scaler_path, "rb"))
        features = pickle.load(open(features_path, "rb"))
        print("Model and components loaded successfully")
    except FileNotFoundError as e:
        print(f"Error loading model: {e}")
        print("Model files not found. Please run the training script first.")


def process_patient_data(patient: PatientData):
    """
    Process patient data for prediction

    Args:
        patient: PatientData object

    Returns:
        Scaled input data ready for prediction
    """
    # Extract features in the correct order
    input_data = []
    for feature in features:
        # Get the value from the patient data
        input_data.append(getattr(patient, feature))

    # Convert to numpy array and reshape
    input_array = np.array(input_data).reshape(1, -1)

    # Scale the input data
    scaled_data = scaler.transform(input_array)

    return scaled_data


def make_prediction(scaled_data) -> PredictionResponse:
    """
    Make prediction using the loaded model

    Args:
        scaled_data: Scaled input data

    Returns:
        PredictionResponse object
    """
    # Make prediction
    prediction = model.predict(scaled_data)[0]
    prediction_proba = model.predict_proba(scaled_data)[0][1]  # Probability of class 1

    # Return prediction and probability
    return PredictionResponse(
        prediction=int(prediction),
        probability=float(prediction_proba),
        prediction_label="Heart Disease" if prediction == 1 else "No Heart Disease",
    )


@app.get("/", response_model=HealthResponse)
def read_root() -> HealthResponse:
    """API health check endpoint"""
    return HealthResponse(
        message="Heart Disease Prediction API",
        status="Model loaded successfully" if model is not None else "Model not loaded",
    )


@app.post("/predict", response_model=PredictionResponse)
def predict_heart_disease(patient: PatientData) -> PredictionResponse:
    """
    Predict heart disease based on patient data

    Args:
        patient: PatientData object with required medical attributes

    Returns:
        PredictionResponse with prediction results
    """
    if model is None or scaler is None or features is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please ensure the model was trained.",
        )

    scaled_data = process_patient_data(patient)
    return make_prediction(scaled_data)


@app.post("/batch-predict", response_model=BatchPredictionResponse)
def batch_predict_heart_disease(
    request: BatchPredictionRequest,
) -> BatchPredictionResponse:
    """
    Predict heart disease for multiple patients

    Args:
        request: BatchPredictionRequest containing a list of patient data

    Returns:
        BatchPredictionResponse with prediction results for all patients
    """
    if model is None or scaler is None or features is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please ensure the model was trained.",
        )

    predictions = []

    for patient in request.patients:
        scaled_data = process_patient_data(patient)
        prediction = make_prediction(scaled_data)
        predictions.append(prediction)

    return BatchPredictionResponse(predictions=predictions, count=len(predictions))


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info() -> ModelInfoResponse:
    """
    Return information about the model

    Returns:
        ModelInfoResponse with model details
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    return ModelInfoResponse(
        model_type=type(model).__name__,
        features=features,
        parameters=model.get_params(),
    )


# Run the API with uvicorn
if __name__ == "__main__":
    # Check if the model exists
    if not os.path.exists(model_path):
        print(
            f"Warning: Model file not found at {model_path}. Run training script first."
        )

        # Create models directory if it doesn't exist
        if not os.path.exists(MODEL_DIR):
            os.makedirs(MODEL_DIR)
            print(f"Created models directory: {MODEL_DIR}")

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

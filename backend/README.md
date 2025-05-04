# Heart Disease Prediction API Documentation

## Overview

This documentation covers a machine learning API that predicts the likelihood of heart disease based on patient medical data. The system consists of a trained logistic regression model and a FastAPI backend that serves predictions through RESTful endpoints.

## Model Information

- **Model Type**: Logistic Regression
- **Dataset Source**: Heart Disease Dataset
- **Features**: 13 clinical parameters including age, blood pressure, cholesterol, and other cardiac metrics
- **Performance**: Hyperparameter-tuned with cross-validation (see training metrics in the model training script)

## Setup and Installation

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation Steps

1. Clone the repository (or download the source code)

2. Create a virtual environment
   ```bash
   python -m venv .venv
   mac: `source venv/bin/activate`  
   windows: `venv\Scripts\activate`
   ```

3. Install required packages
   ```bash
   pip install -r requirements.txt
   ```

4. Download the dataset: done in notebook
   ```bash
   # Option 1: Using kagglehub (requires Kaggle account setup)
   pip install kagglehub
   # The model will download automatically when you run the training script
   
   # Option 2: Manual download
   # Download heart.csv from Kaggle and place it in the project root
   ```

5. Start the API server  
   Head to the /backend/app directory and use the command
   ```bash
   uvicorn main:app --reload
   ```
   to run the development server

The server will start at `http://localhost:8000`

## API Endpoints

### 1. Health Check
- **URL**: `/`
- **Method**: `GET`
- **Response**: Basic information about the API status
- **Example Response**:
  ```json
  {
    "message": "Heart Disease Prediction API",
    "status": "Model loaded successfully"
  }
  ```

### 2. Single Prediction
- **URL**: `/predict`
- **Method**: `POST`
- **Request Body**: JSON object with patient data (see schema below)
- **Response**: Prediction result including probability and label
- **Example Request**:
  ```json
  {
    "age": 63,
    "sex": 1,
    "cp": 3,
    "trestbps": 145,
    "chol": 233,
    "fbs": 1,
    "restecg": 0,
    "thalach": 150,
    "exang": 0,
    "oldpeak": 2.3,
    "slope": 0,
    "ca": 0,
    "thal": 1
  }
  ```
- **Example Response**:
  ```json
  {
    "prediction": 1,
    "probability": 0.89,
    "prediction_label": "Heart Disease"
  }
  ```

### 3. Batch Prediction
- **URL**: `/batch-predict`
- **Method**: `POST`
- **Request Body**: JSON array of patient data objects
- **Response**: Array of prediction results
- **Example Request**:
  ```json
  {
    "patients": [
      {
        "age": 63,
        "sex": 1,
        "cp": 3,
        "trestbps": 145,
        "chol": 233,
        "fbs": 1,
        "restecg": 0,
        "thalach": 150,
        "exang": 0,
        "oldpeak": 2.3,
        "slope": 0,
        "ca": 0,
        "thal": 1
      },
      {
        "age": 45,
        "sex": 0,
        "cp": 1,
        "trestbps": 130,
        "chol": 180,
        "fbs": 0,
        "restecg": 0,
        "thalach": 170,
        "exang": 0,
        "oldpeak": 0.0,
        "slope": 1,
        "ca": 0,
        "thal": 2
      }
    ]
  }
  ```

### 4. Model Information
- **URL**: `/model-info`
- **Method**: `GET`
- **Response**: Details about the model, including feature names and parameters
- **Example Response**:
  ```json
  {
    "model_type": "LogisticRegression",
    "features": ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"],
    "parameters": {
      "C": 0.1,
      "penalty": "l2",
      "solver": "liblinear",
      "max_iter": 1000
    }
  }
  ```

## Input Schema Description

| Field     | Type  | Description                                              | Allowed Values          |
|-----------|-------|----------------------------------------------------------|-------------------------|
| age       | int   | Age in years                                             | 0-120                   |
| sex       | int   | Biological sex                                           | 0 (female), 1 (male)    |
| cp        | int   | Chest pain type                                          | 0-3                     |
| trestbps  | int   | Resting blood pressure (mm Hg)                           | Any positive integer    |
| chol      | int   | Serum cholesterol (mg/dl)                                | Any positive integer    |
| fbs       | int   | Fasting blood sugar > 120 mg/dl                          | 0 (false), 1 (true)     |
| restecg   | int   | Resting electrocardiographic results                     | 0-2                     |
| thalach   | int   | Maximum heart rate achieved                              | Any positive integer    |
| exang     | int   | Exercise induced angina                                  | 0 (no), 1 (yes)         |
| oldpeak   | float | ST depression induced by exercise relative to rest       | Any float value         |
| slope     | int   | Slope of the peak exercise ST segment                    | 0-2                     |
| ca        | int   | Number of major vessels colored by fluoroscopy           | 0-4                     |
| thal      | int   | Thalassemia                                              | 0-3                     |


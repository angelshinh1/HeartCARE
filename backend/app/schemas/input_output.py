"""
Schema definitions for request and response data structures.
This module contains Pydantic models for input data validation and response formatting.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional


class PatientData(BaseModel):
    """
    Schema for patient data input for heart disease prediction
    """

    age: int = Field(..., description="Age in years", ge=0, le=120)
    sex: int = Field(..., description="Sex (1 = male, 0 = female)", ge=0, le=1)
    cp: int = Field(..., description="Chest pain type (0-3)", ge=0, le=3)
    trestbps: int = Field(..., description="Resting blood pressure (in mm Hg)", ge=0)
    chol: int = Field(..., description="Serum cholesterol in mg/dl", ge=0)
    fbs: int = Field(
        ...,
        description="Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)",
        ge=0,
        le=1,
    )
    restecg: int = Field(
        ..., description="Resting electrocardiographic results (0-2)", ge=0, le=2
    )
    thalach: int = Field(..., description="Maximum heart rate achieved", ge=0)
    exang: int = Field(
        ..., description="Exercise induced angina (1 = yes, 0 = no)", ge=0, le=1
    )
    oldpeak: float = Field(
        ..., description="ST depression induced by exercise relative to rest"
    )
    slope: int = Field(
        ..., description="Slope of the peak exercise ST segment", ge=0, le=2
    )
    ca: int = Field(
        ...,
        description="Number of major vessels (0-4) colored by flourosopy",
        ge=0,
        le=4,
    )
    thal: int = Field(
        ...,
        description="Thalassemia (0 = normal; 1 = fixed defect; 2 = reversable defect)",
        ge=0,
        le=3,
    )

    class Config:
        schema_extra = {
            "example": {
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
                "thal": 1,
            }
        }


class PredictionResponse(BaseModel):
    """
    Schema for prediction response
    """

    prediction: int = Field(
        ..., description="Binary prediction (1 = Disease, 0 = No Disease)"
    )
    probability: float = Field(..., description="Probability of heart disease")
    prediction_label: str = Field(..., description="Text label of the prediction")


class HealthResponse(BaseModel):
    """
    Schema for API health/status check response
    """

    message: str
    status: str


class ModelInfoResponse(BaseModel):
    """
    Schema for model information response
    """

    model_type: str
    features: List[str]
    parameters: Dict[str, Optional[object]]


class BatchPredictionRequest(BaseModel):
    """
    Schema for batch prediction requests
    """

    patients: List[PatientData]


class BatchPredictionResponse(BaseModel):
    """
    Schema for batch prediction responses
    """

    predictions: List[PredictionResponse]
    count: int

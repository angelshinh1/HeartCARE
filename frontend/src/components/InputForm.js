import React, { useState } from "react";
// import "../styles/InputForm.css";

const InputForm = () => {
  const [formData, setFormData] = useState({ 
    age: "", 
    bloodPressure: "", 
    cholesterol: "",
    heartRate: "",
    diabetic: "no",
    smoker: "no"
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setPrediction({
        risk: Math.random() > 0.5 ? "low" : "moderate",
        percentage: Math.floor(Math.random() * 30) + 10
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Enter Your Vitals</h2>
        <p>Fill in your health metrics for a personalized heart risk assessment</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input 
            id="age" 
            name="age" 
            type="number" 
            placeholder="Years" 
            onChange={handleChange} 
            value={formData.age}
            required 
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bloodPressure">Blood Pressure</label>
            <input 
              id="bloodPressure" 
              name="bloodPressure" 
              placeholder="120/80" 
              onChange={handleChange} 
              value={formData.bloodPressure}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cholesterol">Cholesterol</label>
            <input 
              id="cholesterol" 
              name="cholesterol" 
              placeholder="mg/dL" 
              onChange={handleChange} 
              value={formData.cholesterol}
              required 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="heartRate">Heart Rate</label>
            <input 
              id="heartRate" 
              name="heartRate" 
              placeholder="BPM" 
              onChange={handleChange} 
              value={formData.heartRate}
              required 
            />
          </div>
          
          <div className="form-group radio-group">
            <label>Are you diabetic?</label>
            <div className="radio-options">
              <label>
                <input 
                  type="radio" 
                  name="diabetic" 
                  value="yes" 
                  checked={formData.diabetic === "yes"}
                  onChange={handleChange} 
                /> Yes
              </label>
              <label>
                <input 
                  type="radio" 
                  name="diabetic" 
                  value="no" 
                  checked={formData.diabetic === "no"}
                  onChange={handleChange} 
                /> No
              </label>
            </div>
          </div>
        </div>
        
        <div className="form-group radio-group">
          <label>Do you smoke?</label>
          <div className="radio-options">
            <label>
              <input 
                type="radio" 
                name="smoker" 
                value="yes" 
                checked={formData.smoker === "yes"}
                onChange={handleChange} 
              /> Yes
            </label>
            <label>
              <input 
                type="radio" 
                name="smoker" 
                value="no" 
                checked={formData.smoker === "no"}
                onChange={handleChange} 
              /> No
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="predict-btn" 
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Predict Risk'}
        </button>
      </form>
      
      {prediction && (
        <div className={`result ${prediction.risk}`}>
          <h3>Risk Assessment</h3>
          <div className="risk-meter">
            <div 
              className="risk-indicator" 
              style={{width: `${prediction.percentage}%`}}
            ></div>
          </div>
          <p>Your heart risk is <strong>{prediction.risk}</strong> ({prediction.percentage}%)</p>
          <p className="recommendation">
            {prediction.risk === "low" 
              ? "Keep up the good work! Continue with your healthy lifestyle." 
              : "Consider consulting with a healthcare professional for personalized advice."}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputForm;

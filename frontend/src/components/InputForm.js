import React, { useState } from "react";

const InputForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "0",
    cp: "0",
    trestbps: "",
    chol: "",
    fbs: "0",
    restecg: "0",
    thalach: "",
    exang: "0",
    oldpeak: "",
    slope: "0",
    ca: "0",
    thal: "0"
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);

    try {
      // change to the api key in deployment
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(formData.age),
          sex: parseInt(formData.sex),
          cp: parseInt(formData.cp),
          trestbps: parseInt(formData.trestbps),
          chol: parseInt(formData.chol),
          fbs: parseInt(formData.fbs),
          restecg: parseInt(formData.restecg),
          thalach: parseInt(formData.thalach),
          exang: parseInt(formData.exang),
          oldpeak: parseFloat(formData.oldpeak),
          slope: parseInt(formData.slope),
          ca: parseInt(formData.ca),
          thal: parseInt(formData.thal)
        }),
      });
      const result = await response.json();
      setPrediction({
        risk: result.prediction_label,
        percentage: (result.probability * 1000).toFixed(3),
      });

    } catch (error) {
      console.error("Error calling API:", error);
      setPrediction({ risk: "unknown", percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Heart Risk Prediction</h2>
      <form onSubmit={handleSubmit}>
      <input className="form-field" type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
      
      <select className="form-field" name="sex" value={formData.sex} onChange={handleChange}>
        <option value="0">Female</option>
        <option value="1">Male</option>
      </select>

      <select className="form-field" name="cp" value={formData.cp} onChange={handleChange}>
        <option value="0">Typical Angina</option>
        <option value="1">Atypical Angina</option>
        <option value="2">Non-anginal Pain</option>
        <option value="3">Asymptomatic</option>
      </select>

      <input className="form-field" type="number" name="trestbps" placeholder="Resting BP" value={formData.trestbps} onChange={handleChange} required />
      <input className="form-field" type="number" name="chol" placeholder="Cholesterol" value={formData.chol} onChange={handleChange} required />

      <select className="form-field" name="fbs" value={formData.fbs} onChange={handleChange}>
        <option value="0">FBS &lt; 120 mg/dl</option>
        <option value="1">FBS &gt; 120 mg/dl</option>
      </select>

      <select className="form-field" name="restecg" value={formData.restecg} onChange={handleChange}>
        <option value="0">Normal</option>
        <option value="1">ST-T Abnormality</option>
        <option value="2">Left Ventricular Hypertrophy</option>
      </select>

      <input className="form-field" type="number" name="thalach" placeholder="Max Heart Rate" value={formData.thalach} onChange={handleChange} required />

      <select className="form-field" name="exang" value={formData.exang} onChange={handleChange}>
        <option value="0">No Exercise-induced Angina</option>
        <option value="1">Yes</option>
      </select>

      <input className="form-field" type="number" step="0.1" name="oldpeak" placeholder="Oldpeak" value={formData.oldpeak} onChange={handleChange} required />

      <select className="form-field" name="slope" value={formData.slope} onChange={handleChange}>
        <option value="0">Upsloping</option>
        <option value="1">Flat</option>
        <option value="2">Downsloping</option>
      </select>

      <select className="form-field" name="ca" value={formData.ca} onChange={handleChange}>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>

      <select className="form-field" name="thal" value={formData.thal} onChange={handleChange}>
        <option value="0">Normal</option>
        <option value="1">Fixed Defect</option>
        <option value="2">Reversible Defect</option>
        <option value="3">Other</option>
      </select>

      <button
        type="submit"
        className="predict-btn"
        disabled={isLoading}
      >
        {isLoading ? "Predicting..." : "Predict Risk"}
      </button>

    </form>

      {prediction && (
        <div className={`result ${prediction.risk}`}>
          <h3>Risk Assessment</h3>
          <p>Risk: <strong>{prediction.risk}</strong></p>
          <p>Chance: <strong>{prediction.percentage}%</strong></p>
        </div>
      )}
    </div>
  );
};

export default InputForm;

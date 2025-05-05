import React, { useState } from "react";
import "../styles/InputForm.css";

const InputForm = () => {
  const [formData, setFormData] = useState({ age: "", bloodPressure: "", cholesterol: "" });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://your-backend.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setPrediction(data.result);
  };

  return (
    <div className="form-container">
      <h2>Enter Your Vitals</h2>
      <form onSubmit={handleSubmit}>
        <input name="age" placeholder="Age" onChange={handleChange} required />
        <input name="bloodPressure" placeholder="Blood Pressure" onChange={handleChange} required />
        <input name="cholesterol" placeholder="Cholesterol" onChange={handleChange} required />
        <button type="submit">Predict</button>
      </form>
      {prediction && <div className="result">Prediction: {prediction}</div>}
    </div>
  );
};

export default InputForm;

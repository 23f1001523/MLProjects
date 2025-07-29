import React, { useState } from "react";

function ChurnCustomers() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "M",
    estimated_salary: "",
    calls_made: "",
    sms_sent: "",
    data_used: "",
    state: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
    "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    for (const key in formData) {
      if (!formData[key]) {
        setError(`Please fill out the ${key.replace("_", " ")} field.`);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/churn/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">📊 Customer Churn Prediction</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          {["age", "estimated_salary", "calls_made", "sms_sent", "data_used"].map((field, index) => (
            <div className="col-md-6 mb-3" key={field}>
              <label className="form-label text-capitalize">{field.replace("_", " ")}</label>
              <input
                type="number"
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="col-md-6 mb-3">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">State</label>
            <select
              className="form-control"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary px-4">Predict</button>
        </div>
      </form>

      {result && (
        <div className="alert alert-info mt-4 text-center">
          <h5>
            {result.churn === 1 ? "⚠️ Likely to Churn" : "✅ Not Likely to Churn"}
          </h5>
          <p><strong>Probability:</strong> {result.probability}</p>
        </div>
      )}
    </div>
  );
}

export default ChurnCustomers;

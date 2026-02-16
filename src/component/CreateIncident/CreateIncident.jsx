import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api"; // central API URL

const CreateIncident = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    service: "",
    severity: "SEV1",
    status: "",
    owner: "", // backend expects "owner"
    summary: "",
  });

  const services = ["Auth", "Payments", "Backend", "Frontend", "Database"];
  const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];
  const statuses = ["Open", "Mitigated", "Resolved"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSeverityChange = (severity) => {
    setFormData((prev) => ({
      ...prev,
      severity,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating incident:", errorData);
        alert("Failed to create incident");
        return;
      }

      const data = await response.json();
      console.log("Incident created:", data);
      alert("Incident created successfully!");
      navigate("/"); // redirect to incident list
    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      service: "",
      severity: "SEV1",
      status: "",
      owner: "",
      summary: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Create Incident
        </h1>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Incident Tracker
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Create New Incident
            </h3>

            {/* Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Issue Title..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Service */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Severity
              </label>
              <div className="flex items-center gap-6">
                {severities.map((severity) => (
                  <label
                    key={severity}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={severity}
                      checked={formData.severity === severity}
                      onChange={() => handleSeverityChange(severity)}
                      className="w-4 h-4 text-gray-800 border-gray-300 focus:ring-2 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner{" "}
                <span className="ml-2 text-gray-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Describe the incident..."
                rows="5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-8 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Create Incident
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api.js";

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    service: "",
    severity: "SEV1",
    status: "Open",
    assignedTo: "",
    occurredAt: "",
    summary: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchIncident = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/incidents/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setFormData({
          title: data.title || "",
          service: data.service || "",
          severity: data.severity || "SEV1",
          status: data.status || "Open",
          assignedTo: data.owner || "",
          occurredAt: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString()
            : "",
          summary: data.summary || "",
        });
      } catch (err) {
        console.error("Load error:", err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchIncident();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];
  const statuses = ["Open", "Mitigated", "Resolved"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!id) {
      console.log("No ID provided");
      return;
    }
    setSaving(true);

    const payload = {
      title: formData.title,
      severity: formData.severity,
      status: formData.status,
      owner: formData.assignedTo || null,
      summary: formData.summary || null,
    };

    fetch(`${API_BASE_URL}/incidents/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((updated) => {
        console.log("Changes saved:", updated);
        navigate("/");
      })
      .catch((err) => {
        console.error("Save error:", err.message);
      })
      .finally(() => setSaving(false));
  };

  const handleCancel = () => {
    console.log("Changes cancelled");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Incident Detail
        </h1>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Card Header */}
          <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Incident Tracker
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-600">
              Loading incident...
            </div>
          ) : (
            <form onSubmit={handleSaveChanges} className="p-6">
              {/* Incident Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {formData.title}
              </h3>

              {/* Service Field (Read-only) */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service:
                  <span className="ml-2 font-normal text-gray-800">
                    {formData.service}
                  </span>
                </label>
              </div>

              {/* Severity Dropdown */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Severity:
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  {severities.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status:
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned To Field */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assigned To:
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>

              {/* Occurred At Field (Read-only) */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occurred At:
                  <span className="ml-2 font-normal text-gray-800">
                    {formData.occurredAt}
                  </span>
                </label>
              </div>

              {/* Summary Textarea */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2.5 bg-gray-700 text-white rounded hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-2.5 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;

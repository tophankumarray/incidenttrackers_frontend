import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api.js";

const IncidentList = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState(["SEV1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const services = ["SEV1", "SEV2", "SEV3", "SEV4"];

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
    setCurrentPage(1);
  };

  const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-gray-200 text-gray-700";
      case "resolved":
        return "bg-gray-300 text-gray-700";
      case "mitigated":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 5);

        // Add severity filters (from selectedServices)
        if (selectedServices.length > 0) {
          params.append("severity", selectedServices.join(","));
        }

        // Add status filter
        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        const res = await fetch(
          `${API_BASE_URL}/incidents?${params.toString()}`,
          {
            signal: controller.signal,
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Client-side search filter if searchQuery exists
        let filteredIncidents = data.data || [];
        if (searchQuery.trim()) {
          filteredIncidents = filteredIncidents.filter((incident) =>
            incident.title.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        setIncidents(filteredIncidents);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    return () => controller.abort();
  }, [currentPage, selectedServices, statusFilter, searchQuery]);

  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Incident List
          </h1>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Incident Tracker
              </h2>
              <button
                onClick={() => navigate("/create")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                New Incident
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Filters Section */}
            <div className="px-6 py-4 space-y-4">
              {/* Service Filter */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Service
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-4">
                  {services.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="w-4 h-4 rounded border-gray-300 text-gray-700 focus:ring-2 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status and Search */}
              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="all">Status</option>
                  <option value="Open">Open</option>
                  <option value="Mitigated">Mitigated</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                >
                  Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      <div className="flex items-center gap-1">
                        Severity
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incidents.map((incident) => (
                    <tr
                      key={incident.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <button
                          onClick={() => navigate(`/incident/${incident._id}`)}
                          className="text-gray-700 hover:text-gray-700 cursor-pointer font-medium"
                        >
                          {incident.title}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {incident.severity}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded ${getStatusStyles(incident.status)}`}
                        >
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {incident.createdAt
                          ? new Date(incident.createdAt).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {incident.owner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 mr-4">
                Page 1 of {totalPages}
              </span>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                &lt;&lt;
              </button>
              {[1, 2, 3, 3, 10].map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded transition ${
                    currentPage === page && idx === 0
                      ? "bg-gray-300 text-gray-800 font-medium"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentList;

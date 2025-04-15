import { useEffect, useState, useContext } from "react";
import React from "react";
import { AppContext } from "../Context/AppContext";
import {
  Calendar,
  Clock,
  Users,
  IndianRupee,
  Check,
  AlertTriangle,
  Clock3,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

const CampaignList = () => {
  const { backendUrl } = useContext(AppContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const res = await fetch(`${backendUrl}/api/campaign/getcampaigns`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await res.json();
        setCampaigns(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [backendUrl]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusDetails = (status) => {
    switch (status) {
      case "scheduled":
        return {
          icon: <Clock3 className="w-4 h-4" />,
          color: "bg-blue-100 text-blue-800",
          label: "Scheduled",
        };
      case "sent":
        return {
          icon: <Check className="w-4 h-4" />,
          color: "bg-green-100 text-green-800",
          label: "Sent",
        };
      case "failed":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: "bg-red-100 text-red-800",
          label: "Failed",
        };
      default:
        return {
          icon: <Clock3 className="w-4 h-4" />,
          color: "bg-gray-100 text-gray-800",
          label: "Unknown",
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="max-w-[25rem] md:max-w-[35rem] lg:max-w-6xl mx-auto">
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-lg lg:text-2xl font-bold text-gray-800">Campaign History</h1>
        <p className="text-gray-500 text-xs lg:text-md">
          View and manage your marketing campaigns
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <div className="p-2">
                <p className="text-xs font-medium text-gray-500 mb-2 px-2">
                  Status
                </p>
                {["all", "scheduled", "sent", "failed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                      statusFilter === status
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status === "all" && " Campaigns"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-600">
            Loading campaigns...
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => {
                  const statusDetails = getStatusDetails(campaign.status);
                  return (
                    <tr key={campaign._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            {campaign.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {campaign.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {campaign.message}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Calendar className="inline h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(campaign.scheduleTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          {campaign.totalRecipients}
                        </div>
                        <div className="text-xs text-gray-500">
                          Group: {campaign.group}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <IndianRupee className="inline h-4 w-4 mr-1 text-gray-400" />
                        {campaign.totalCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}
                        >
                          {statusDetails.icon}
                          <span className="ml-1">{statusDetails.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No campaigns found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search or filter"
                : "Get started by creating a new campaign"}
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default CampaignList;

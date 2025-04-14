import { useState, useContext } from "react";
import React from "react";
import { UserPlusIcon } from "lucide-react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";

function AddShopper() {
  const { backendUrl, currency } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    lastTransactionDate: "",
    totalSpent: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${backendUrl}/api/shopper/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Shopper added successfully!");
        setFormData({
          name: "",
          phoneNumber: "",
          lastTransactionDate: "",
          totalSpent: "",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-br">
      <div className="max-w-sm md:max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Add New Shopper
        </h2>
        <p className="text-center text-sm text-gray-500 mb-5">
          This page is only for manually adding test data to verify SMS
          functionality.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Country code
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="lastTransactionDate"
                className="block text-sm font-medium text-gray-700"
              >
                Last Purchase
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="lastTransactionDate"
                  name="lastTransactionDate"
                  value={formData.lastTransactionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="totalSpent"
                className="block text-sm font-medium text-gray-700"
              >
                Total Spent
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {currency}
                </div>
                <input
                  type="number"
                  id="totalSpent"
                  name="totalSpent"
                  placeholder="0.00"
                  value={formData.totalSpent}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 cursor-pointer ${
              loading ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Register Shopper
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddShopper;

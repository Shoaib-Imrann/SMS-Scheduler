import { useState, useContext } from 'react';
import React from 'react';
import { MessageSquarePlus, Calendar, Send, Users, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AppContext } from "../Context/AppContext";

function CreateCampaign() {
  const { backendUrl, currency, userData } = useContext(AppContext);
  const [campaignName, setCampaignName] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shoppers, setShoppers] = useState([]);
  const [error, setError] = useState(null);

  const groupOptions = [
    { label: 'All Shoppers', value: 'all' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
  ];

  const fetchShoppers = async (group) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/shopper/getShoppersGroup?group=${group}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setShoppers(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleGroupChange = (e) => {
    const group = e.target.value;
    setSelectedGroup(group);
    if (group) fetchShoppers(group);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Check if the selected group has zero shoppers
    if (shoppers.length === 0) {
      toast.error("There are no shoppers in this group to launch the campaign.");
      setIsSubmitting(false);
      return;
    }
  
    // Calculate total SMS cost
    const totalSMS = Math.ceil(characterCount / 160) * shoppers.length;
    const smsCost = totalSMS * 7.5;
  
    if (userData.creditBalance < smsCost) {
      toast.error(`Insufficient funds!`);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const authToken = localStorage.getItem('authToken');
      console.log('Auth Token:', authToken);
  
      const response = await axios.post(`${backendUrl}/api/campaign/launch`, {
        name: campaignName,
        message: message,
        scheduleTime: scheduleDate,
        group: selectedGroup,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      // Log the response for debugging
      console.log("Response from backend:", response);
  
      if (response.status === 201) {
        // Successful response from backend
        console.log("Campaign launched:", response.data);
        setShowSuccess(true);
        toast.success('Campaign scheduled successfully! 🎉');
  
        // Update credit balance after the campaign is successfully launched
        const updateBalanceResponse = await axios.patch(
          `${backendUrl}/api/user/updateCreditBalance`,
          { amount: smsCost },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        // If balance updated successfully, show success
        if (updateBalanceResponse.status === 200) {
          toast.success('funds updated!');
        } else {
          toast.error('Failed to update funds.');
        }
  
        setCampaignName("");
        setMessage("");
        setScheduleDate("");
        setSelectedGroup("");
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Handle unexpected status
        toast.error('Failed to launch campaign.');
      }
    } catch (error) {
      console.error("Launch failed:", error);
  
      // Log the error for debugging
      if (error.response) {
        console.log('Error details:', error.response);
        toast.error(error.response?.data?.message || "Failed to launch campaign.");
      } else {
        // If no response from server (network error)
        toast.error('Network error, please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const shopperCount = shoppers.length;
  const smsCost = (shopperCount * 7.50).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[90vh]">
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
          <CheckCircle className="w-5 h-5 mr-2" />
          Campaign scheduled successfully!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-1">Campaign Details</h2>
          <p className="text-sm text-gray-500">Create your message and set delivery time</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                placeholder="E.g., Summer Sale Promotion"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none "
                required
              />
            </div>

            <div>
              <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Date
              </label>
              <div className="relative">
                
                <input
                  type="datetime-local"
                  id="scheduleDate"
                  name="scheduleDate"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none "
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message Content
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setCharacterCount(e.target.value.length);
              }}
              rows="5"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none "
              required
            />
            <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
              <div>
                {characterCount > 160 ? (
                  <span className="flex items-center text-amber-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Message will be split into multiple SMS
                  </span>
                ) : (
                  <span>{160 - characterCount} characters remaining</span>
                )}
              </div>
              <div>{Math.ceil(characterCount / 160)} SMS needed</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-md font-medium text-gray-700">Select Recipient Group</h3>
            </div>

            <select
              name="selectedGroup"
              value={selectedGroup}
              onChange={handleGroupChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none "
              required
            >
              <option value="" disabled>Select a group</option>
              {groupOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-1">
            <div>
              Campaign will be sent to group: <span className="font-medium">{selectedGroup}</span>
            </div>
            <div>Total Shoppers: <span className="font-semibold">{shopperCount}</span></div>
            <div>Total Cost: <span className="font-semibold">{currency}{smsCost}</span> (at {currency}7.50 per SMS)</div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting || !selectedGroup}
              className={`flex items-center px-6 py-2 rounded-lg text-white font-medium cursor-pointer ${
                isSubmitting || !selectedGroup
                  ? "bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Launch Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCampaign;

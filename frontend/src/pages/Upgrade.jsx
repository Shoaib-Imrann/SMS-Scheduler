import React, { useContext, useState, useEffect } from "react";
import { IndianRupee, CreditCard, Wallet, AlertCircle } from "lucide-react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import razorpayLogo from "../assets/razorpay_logo.png";

const Upgrade = () => {
  const [amount, setAmount] = useState(60); // Default amount
  const { backendUrl, userData } = useContext(AppContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const predefinedAmounts = [60, 100, 300];
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Load Razorpay checkout script so window.Razorpay exists
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setAmount(value);
    if (value < 60) {
      setError("Minimum amount is ₹60");
    } else {
      setError("");
    }
  };

  const handlePayment = async () => {
    if (amount < 60) {
      setError("Minimum amount is ₹60");
      return;
    }

    setIsProcessing(true);
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem("authToken");

      // Create an order by calling your backend route
      const orderResponse = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = orderResponse.data;

      // Set up Razorpay options with the order id from backend
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount, // This is already in paise
        currency: order.currency,
        order_id: order.id, // Use the order id received from backend
        name: "Order Payment",
        description: "Add funds to your account",
        handler: async function (response) {
          try {
            // Verify the payment by calling your backend's verify route with auth token
            await axios.post(
              `${backendUrl}/api/payment/verify-order`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          } catch (err) {
            setError("Payment verification failed");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        prefill: {
          name: userData?.name || "User Name",
          email: userData?.email || "user@example.com",
          contact: userData?.contact || "1234567890",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError("Order creation failed");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-50">
      <div className="bg-transparent p-8 rounded-2xl w-full max-w-md mb-10">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 ml-3">Add Funds</h2>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  Payment successful! Your account has been updated. Please
                  refresh the page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preset amounts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                onClick={() => {
                  setAmount(presetAmount);
                  setError("");
                }}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium 
                  ${
                    amount === presetAmount
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-200 border border-gray-200"
                  }
                `}
              >
                ₹{presetAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount input */}
        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Custom Amount (Min ₹60)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              min="60"
              value={amount}
              onChange={handleAmountChange}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}
        </div>

        {/* Payment button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || amount < 60}
          className={`
            w-full py-3 px-4 flex items-center justify-center rounded-lg text-white font-medium cursor-pointer
            ${
              isProcessing || amount < 60
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {isProcessing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay ₹{amount}
            </>
          )}
        </button>

        {/* Payment info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-1">
            Secure payment powered by {""}
            {razorpayLogo && (
              <img src={razorpayLogo} alt="Razorpay" className="h-5" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;

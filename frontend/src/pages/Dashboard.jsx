import React from "react";
import { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquarePlus,
  History,
  UserPlus,
  CreditCard,
  LogOut,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const { backendUrl, currency, userData } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      to: "/dashboard",
      text: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: "/dashboard/create-campaign",
      text: "Create Campaign",
      icon: <MessageSquarePlus className="w-5 h-5" />,
    },
    {
      to: "/dashboard/history",
      text: "History",
      icon: <History className="w-5 h-5" />,
    },
    {
      to: "/dashboard/add-shopper",
      text: "Add Shopper",
      icon: <UserPlus className="w-5 h-5" />,
    },
  ];

  const showMainContent = location.pathname === "/dashboard";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-gray-200">
        <div className="flex items-center h-16 px-6"></div>

        <div className="flex flex-col justify-between flex-grow">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.text}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              className="flex items-center w-full px-5 cursor-pointer py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              onClick={() => {
                localStorage.removeItem("authToken"); // Clear authToken from localStorage
                window.location.href = "/login"; // Redirect to login or desired page
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Logo for mobile */}
            <div className="md:hidden">
              {/* <img className="h-8 w-auto" src="/logo.svg" alt="Logo" /> */}
            </div>

            {/* User profile and credits */}
            <div className="flex items-center space-x-4 w-full justify-between">
              <div
                className="flex items-center ml-2 md:ml-0 pl-3 h-9 bg-gray-800 hover:bg-gray-900  transition-colors text-white rounded-lg cursor-pointer"
                onClick={() => (window.location.href = "/dashboard/upgrade")}
              >
                <CreditCard className="w-4 h-4 text-white mr-2" />
                <span className="text-xs text-white">
                  Funds:{" "}
                  <span className="font-medium">
                    {currency}
                    {userData.creditBalance}
                  </span>
                </span>
                <button className="ml-4 text-white px-1.5 text-sm cursor-pointer border-l-[0.5px] border-white rounded-r-lg ">
                  <ArrowUp className="w-5 h-9" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="hidden md:block ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    Hello,{" "}
                    <span className="font-semibold text-blue-600">
                      {userData.name}
                    </span>
                    ! 👋
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white  p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* Dashboard Home Content */}
        {showMainContent ? (
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="my-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Quick Stats
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">Total Campaigns</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {userData.campaigns}
                    </p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-700">Total Shoppers</p>
                    <p className="text-2xl font-bold text-green-900">
                      {userData.shoppers}
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-100 rounded-lg">
                    <p className="text-sm text-indigo-700">Messages Sent</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {userData.messagesSent}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {navItems.slice(1).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all"
                  >
                    <div className="p-3 bg-indigo-50 rounded-full mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {item.text}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      {item.text === "Create Campaign" &&
                        "Launch a new SMS marketing campaign"}
                      {item.text === "History" &&
                        "View your past campaign performance"}
                      {item.text === "Add Shopper" &&
                        "Register a new customer to your database"}
                    </p>
                  </NavLink>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

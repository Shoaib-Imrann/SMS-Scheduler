import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import React from "react";

const Check = ({ children }) => {
  const { isLoggedIn, globalLoading } = useContext(AppContext);

  if (globalLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default Check;

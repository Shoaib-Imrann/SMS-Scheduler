import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Edit, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AppContext } from "../Context/AppContext";

function Signup() {
  const { backendUrl, setIsLoggedIn, getUserData, userData, isLoggedIn } =
    useContext(AppContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && userData) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, userData, navigate]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendEmailOTP = async () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email address.");
      return;
    }

    setLoading(true);

    try {
      const responsePromise = axios.post(
        `${backendUrl}/api/email/send-email-otp`,
        { email }
      );

      toast.promise(responsePromise, {
        loading: "Sending OTP to your email...",
        success: (res) => {
          if (res.data && res.data.success) {
            localStorage.setItem("otpToken", res.data.otpToken);
            setEmailOtpSent(true);
            setEmailOtp("");
            setTimer(30); // set timer to 30 seconds, you naughty genius!
            return res.data.message || "OTP sent to your email.";
          } else {
            throw new Error(
              res.data.message || "Email already exists, Please Login!"
            );
          }
        },
        error: (error) =>
          error.message ||
          "An unexpected error occurred. Please try again later.",
      });
    } catch (error) {
      console.error("Error sending email OTP:", error);
    }

    setLoading(false);
  };

  const handleVerifyEmailOTP = async () => {
    if (!email || !emailOtp) {
      toast.error("Email, OTP are required.");
      return;
    }

    const token = localStorage.getItem("otpToken");
    if (!token) {
      toast.error("OTP token is missing. Please try again.");
      return;
    }

    setLoading(true);

    await toast
      .promise(
        axios.post(
          `${backendUrl}/api/email/verify-email-otp`,
          { email, otp: emailOtp, username, password },
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        {
          loading: "Verifying email OTP...",
          success: (response) => {
            setEmailOtp("");
            navigate("/dashboard");
            return response.data.message || "Email verified successfully!";
          },
          error: (error) =>
            error.response?.data?.message ||
            error.response?.data?.error ||
            "An unexpected error occurred. Please try again later.",
        }
      )
      .catch((error) => {
        console.error("Error verifying OTP:", error);
      });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 relative">
      <div className="absolute w-max top-[3%] left-0 right-0 mx-auto"></div>
      <div className="w-full max-w-[400px] py-20 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start px-6 w-full">
          <div className="flex flex-col w-full justify-center items-center">
            <h1 className="text-2xl lg:text-3xl font-serif text-center my-5">
              SignUp
            </h1>
            <div className="w-full">
              {!emailOtpSent && (
                <div className="mb-4 mt-6 text-sm">
                  <TextField
                    fullWidth
                    id="username"
                    label="Username"
                    variant="outlined"
                    type="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    InputProps={{ classes: { input: "prevent-zoom" } }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: { xs: "0.875rem", md: "1rem" },
                      },
                    }}
                  />
                </div>
              )}

              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={checkEmail}
                required
                InputProps={{ classes: { input: "prevent-zoom" } }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.875rem", md: "1rem" },
                  },
                }}
              />

              {emailOtpSent && (
                <>
                  <div className="flex w-full items-center gap-4">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      className="w-auto h-[45px] px-4 my-2 border border-gray-300 rounded-[4px] prevent-zoom"
                    />
                    <button
                      disabled={timer > 0}
                      onClick={handleSendEmailOTP}
                      className="w-auto px-5 h-[45px] uppercase rounded-[4px] text-white font-medium disabled:bg-gray-300 bg-zinc-800 hover:bg-zinc-950 text-xs lg:text-sm flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="md:w-6 md:h-6 w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      ) : timer > 0 ? (
                        `Resend (${timer}s)`
                      ) : (
                        "Resend"
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 mb-5">
                    Please check your email for the OTP
                  </p>
                </>
              )}

              {!emailOtpSent && (
                <>
                  <div className="my-4">
                    <TextField
                      fullWidth
                      id="password"
                      label="Password"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        classes: { input: "prevent-zoom" },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.875rem", md: "1rem" },
                        },
                        "& .MuiInputLabel-root": {
                          fontSize: { xs: "0.875rem", md: "1rem" },
                        },
                      }}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                onClick={
                  emailOtpSent ? handleVerifyEmailOTP : handleSendEmailOTP
                }
                className="uppercase w-full h-[48px] text-sm lg:text-base bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center justify-center cursor-pointer mt-5"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : emailOtpSent ? (
                  "Verify OTP"
                ) : (
                  "Continue"
                )}
              </button>
              {!emailOtpSent && (
                <>
                  <div className="flex justify-center items-center my-8 text-xs lg:text-sm">
                    <hr className="w-1/2 mr-2" />
                    OR
                    <hr className="w-1/2 ml-2" />
                  </div>
                  <a
                    href="/login"
                    className="uppercase w-full h-[45px] text-sm lg:text-base flex justify-center items-center mt-2 border transition border-gray-900 hover:bg-gray-900 hover:text-white py-2 rounded-lg"
                  >
                    Login
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

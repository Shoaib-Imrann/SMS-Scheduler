import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Edit, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AppContext } from "../Context/AppContext";

function Login() {
  const { backendUrl, setIsLoggedIn, getUserData, userData, isLoggedIn } =
    useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //     useEffect(() => {
  //       if (isLoggedIn && userData) {
  //           navigate('/dashboard');
  //       }
  //   }, [isLoggedIn, userData, navigate]);

  const handleEmail = async () => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(backendUrl + "/api/email/check-email", {
        email,
      });
      if (response.data.success) {
        setCheckEmail(true);
      } else {
        toast.error(response.data.message || "Invalid email, Please register");
      }
    } catch (error) {
      console.error("Error :", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!password) {
      toast.error("Password is required.");
      return;
    }
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendUrl + "/api/email/login", {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authToken);
        setIsLoggedIn(true);
        toast.success("Login successful!");
        getUserData();
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Invalid details");
      }
    } catch (error) {
      console.error("Error :", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 relative">
      <div className=" absolute w-max top-[3%] left-0 right-0 mx-auto "></div>
      <div className="w-full max-w-[400px] py-20 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start px-6  w-full">
          <div className="flex flex-col w-full justify-center items-center">
            <h1 className="text-2xl lg:text-3xl font-serif text-center">
              Log in
            </h1>
            {checkEmail && (
              <h1 className="text-xl text-gray-700 font-serif text-center mt-5">
                Welcome back
              </h1>
            )}
            <div className="w-full">
              <div className="mb-4 mt-6 text-sm">
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
                  InputProps={{
                    endAdornment: checkEmail && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setCheckEmail(false), setPassword("");
                          }}
                          edge="end"
                        >
                          <Edit size={20} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    classes: {
                      input: "prevent-zoom",
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: {
                        xs: "0.875rem",
                        md: "1rem",
                      },
                    }, // text-sm equivalent
                    "& .MuiInputLabel-root": {
                      fontSize: {
                        xs: "0.875rem",
                        md: "1rem",
                      },
                    },
                  }}
                />
              </div>
              {checkEmail && (
                <>
                  <div className="mb-4">
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
                        classes: {
                          input: "prevent-zoom",
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: {
                            xs: "0.875rem",
                            md: "1rem",
                          },
                        }, // text-sm equivalent
                        "& .MuiInputLabel-root": {
                          fontSize: {
                            xs: "0.875rem",
                            md: "1rem",
                          },
                        },
                      }}
                    />
                  </div>
                  {/* <div className="mb-10 text-xs md:text-sm hover:underline">
                      <a href="/reset-password" className="text-blue-600">
                        Forgot password?
                      </a>
                    </div> */}
                </>
              )}

              <button
                type="submit"
                onClick={checkEmail ? handleLogin : handleEmail}
                className="uppercase w-full h-[48px] text-sm lg:text-base bg-gray-800 hover:bg-gray-900 text-white rounded-lg flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  "Continue"
                )}
              </button>
              {!checkEmail && (
                <>
                  <div className="flex justify-center items-center my-8 text-xs lg:text-sm">
                    <hr className="w-1/2 mr-2"></hr>OR
                    <hr className="w-1/2 ml-2"></hr>
                  </div>
                  <p className="text-xs lg:text-sm">
                    Don&apos;t have an account?{" "}
                  </p>
                  <a
                    href="/"
                    className="uppercase w-full h-[45px] text-sm lg:text-base flex justify-center items-center mt-2 border transition border-gray-900 hover:bg-gray-900 hover:text-white py-2 rounded-lg"
                  >
                    Signup
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

export default Login;

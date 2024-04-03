import React, { useContext, useState } from "react";
import backgroundImage from "../../bg.jpg";
import "../../App.css";
import logo from "../Members/small-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../lib/fetch";
import { checkInternetConnection } from "../../lib/network";
import Loading from "../Modal/Loading";
import PopupModal from "../Modal/PopupModal";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state variable
  const authCtx = useContext(AuthContext);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const viewPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  const handleSubmit = async () => {
    setIsProcessing(true); // Set isProcessing to true when API call starts

    // Construct the request body
    const requestBody = {
      email,
      password,
      rememberMe: isChecked,
    };

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setIsProcessing(false);
        Swal.fire({
          title: "INTERNET DISCONNECTED",
          text: "Please reconnect and try again",
          icon: "error",
        });
        return;
      }
      // Send a POST request to the dummy endpoint
      const response = await login(requestBody);
      console.log(response);

      if (response.success === true) {
        authCtx.authenticate(response.token);
        authCtx.setId(response.data.user._id);
        authCtx.setUser(response.data.user);

        setIsProcessing(false);
        Swal.fire({
          title: "Success",
          text: "Logged in Successfully",
          icon: "success",
        });
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Error:", error.response);
      // handleShowPopup(
      //   error.response.data.message || "Incorrect email or password",
      //   "error"
      // );
      Swal.fire({
        title: "Error",
        text: "Incorrect email or password",
        icon: "error",
      });
    } finally {
      setIsProcessing(false); // Set isProcessing to false when API call completes
    }
  };

  if (isProcessing) {
    return <Loading isLoggin={isProcessing} color={"white"} />;
  }

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        message={message}
        title={type === "success" ? "Successful" : "Failed"}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center position-relative">
        <div className="md:w-1/2 pl-6 md:pl-40 pr-6 md:pr-40 mt-10 flex flex-column ">
          {/* <div
            onClick={() => navigate(-1)}
            className='flex items-center position-absolute top-0 start-20 mt-5'
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className='mr-2 ml-3 top-bk'
            />
            <span className='ml-4 top-bk'>Back</span>
          </div> */}
          <img src={logo} width={100} />
          <div className="mt-16">
            <h2 className="text-3xl font-semibold user-h2 mb">Welcome Back</h2>
            <p className="user-p mt-2 mb-5">Login</p>
            <div className="mb-8 mt-9">
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="position-relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="position-absolute top-5 end-0 translate-middle">
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  onClick={viewPasswordHandler}
                  className="mr-1 ml-3 text-muted"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="form-checkbox h-4 w-4 text-purple-500 transition duration-150 ease-in-out"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="rememberMe" className="ml-2 rem">
                  Remember me
                </label>
              </div>{" "}
              &nbsp;
              <Link
                to="/forgot"
                className="text-blue-500 fp hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <br />
            <button
              type="button"
              className="w-full main-bg text-white py-2 rounded duration-300"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Process..." : "Login"}
            </button>
          </div>
          <br />
          <p className="text-center">
            Don't have an account?{" "}
            <span className="fp">
              <Link to="/signup">Sign Up</Link>
            </span>
          </p>
        </div>
        {/* Hide the image container on smaller screens (mobile) */}
        <div className="md:w-1/2 hidden md:block">
          <div className="h-screen">
            <img
              src={backgroundImage}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

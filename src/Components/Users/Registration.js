import React, { useContext, useState } from "react";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { sponsorSignup, signup } from "../../lib/fetch";
import Loading from "../Modal/Loading";
import { AuthContext } from "../../context/AuthContext";
import { checkInternetConnection } from "../../lib/network";
import PopupModal from "../Modal/PopupModal";
import backgroundImage from "../../bg.jpg";

const SignUp = () => {


  const [isChecked, setIsChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoPassword, setNgoPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state variable

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const authCtx = useContext(AuthContext);
  let navigate = useNavigate();


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setUserType(tab);
  };

  const viewPasswordHandler = () => {
    setShowPassword(!showPassword);
  };
  const viewPasswordHandler2 = () => {
    setShowPassword2(!showPassword2);
  };

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  const handleIndividualSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    const data = {
      name,
      email,
      password,
    };
    if (!name || !email || !password || !passwordConfirm) {
      setIsProcessing(false);
      Swal.fire({
        title: "Invalid fields",
        text: "Please Fill in the required fields",
        icon: "error",
      });

      return;
    }
    if (password !== passwordConfirm) {
      setIsProcessing(false);
      Swal.fire({
        title: "Invalid field",
        text: "Please your passwords must match",
        icon: "error",
      });
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
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

      const response = await signup(data);
      console.log(response);
      if (response.success === true) {
        authCtx.authenticate(response.token);
        setIsProcessing(false);
        Swal.fire({
          title: "Success",
          text: `An OTP has been sent to your email address`,
          icon: "success",
        });
        setTimeout(() => {
          navigate("/verify");
        }, 5000);
        return;
      }
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        title: "Error",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    } finally {
      setIsProcessing(false); // Set processing state back to false
    }
  };

  const handleSponsorSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true); // Set processing state to true
    const data = {
      name: ngoName,
      email: ngoEmail,
      password: ngoPassword,
    };
    if (!ngoName || !ngoEmail || !ngoPassword) {
      setIsProcessing(false);
      Swal.fire({
        title: "Error",
        text: "Please Fill in the required fields",
        icon: "error",
      });
      return;
    }
    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setIsProcessing(false);
        Swal.fire({
          title: "INTERNET DISCONNECTED",
          text: "Please reconnect and try again",
          icon: "error",
        });
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }
      const response = await sponsorSignup(data);
      console.log(response);
      if (response.success === true) {
        setIsProcessing(false);
        authCtx.authenticate(response.token);
        Swal.fire({
          title: "Success",
          text: "An OTP has been sent to your email address",
          icon: "success",
        });
        setTimeout(() => setShowPopup(false), 5000);
        setTimeout(() => {
          navigate("/verify");
        }, 5000);
        return;
      }
    } catch (error) {
      console.error("Error:", error.response);
      Swal.fire({
        title: "Error",
        text: `${error.response.data.message}`,
        icon: "error",
      });

      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setIsProcessing(false); // Set processing state back to false
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
    <div className="flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 pl-6 md:pl-40 pr-6 md:pr-40">
        {/* <div onClick={() => navigate(-1)} className='flex items-center mb-4'>
          <FontAwesomeIcon icon={faChevronLeft} className='mr-2 top-bk' />
          <span className='top-bk'>Back</span>
        </div> */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold user-h2 mb-6">Get Started</h2>
          <p className="user-p">Create Account</p>
          <br />
          {/* <div className="mb-4 flex justify-center">
            <button
              className={`py-2 px-4 ${
                activeTab === "individual"
                  ? "main-bg text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={() => handleTabChange("individual")}
            >
              Donor
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "sponsor"
                  ? "main-bg text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={() => handleTabChange("sponsor")}
            >
              Sponsor
            </button>
          </div> */}
          {activeTab === "individual" && (
            <form className="" onSubmit={handleIndividualSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  id="email"
                  placeholder="Email Address"
                  className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
                <div className="position-absolute top-5 end-0 translate-middle">
                  <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    onClick={viewPasswordHandler}
                    className="mr-1 ml-3 text-muted"
                  />
                </div>
              </div>
              <div className="position-relative mb-4">
                <input
                  type={showPassword2 ? "text" : "password"}
                  id="password"
                  placeholder="Verify Password"
                  className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <div className="position-absolute top-5 end-0 translate-middle">
                  <FontAwesomeIcon
                    icon={showPassword2 ? faEye : faEyeSlash}
                    onClick={viewPasswordHandler2}
                    className="mr-1 ml-3 text-muted"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="form-checkbox h-4 w-4 text-red-500 transition duration-150 ease-in-out"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <Link to="#"> <p htmlFor="rememberMe" className="ml-2 rem">
                    i agree to <span className="top-bk">Terms & Condition</span>
                  </p></Link>
                </div>
              </div>
              <br />
              <button
                type="submit"
                className="w-full main-bg text-white py-2 rounded"
                disabled={isProcessing} // Disable the button when processing
              >
                {isProcessing ? "Process..." : "Sign Up"}{" "}
                {/* Change button text based on processing state */}
              </button>
            </form>
          )}
          {activeTab === "sponsor" && (
            <form className="mt-16" onSubmit={handleSponsorSubmit}>
              <div className="mb-8">
                <input
                  type="text"
                  id="name"
                  placeholder="Sponsor Name"
                  className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  placeholder="Sponsor Email Address"
                  className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                  value={ngoEmail}
                  onChange={(e) => setNgoEmail(e.target.value)}
                />
              </div>
              <div className="position-relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                  value={ngoPassword}
                  onChange={(e) => setNgoPassword(e.target.value)}
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
                    className="form-checkbox h-4 w-4 text-red-500 transition duration-150 ease-in-out"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="rememberMe" className="ml-2 rem">
                    i agree to <span className="top-bk"><a
                      href="/terms-conditions"
                      className="text-primary underline underlne-offset-8"
                    >Terms & Condition</a></span>
                  </label>
                </div>
              </div>
              <br />
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded"
              >
                Sign Up
              </button>
            </form>
          )}
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="fp">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="md:w-1/2 hidden md:block">
        <div className="h-screen">
          <img
            src={backgroundImage}
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;

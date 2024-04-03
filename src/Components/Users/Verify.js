import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { checkInternetConnection } from "../../lib/network";
import { verify } from "../../lib/fetch";
import Loading from "../Modal/Loading";
import PopupModal from "../Modal/PopupModal";

export default function Verify() {
  const [otpCode, setOtpCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // New state variable

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  let navigate = useNavigate();

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const data = {
      otpCode,
    };
    if (!otpCode) {
      setIsProcessing(false);
      // handleShowPopup("Please Provide an OTP", "error");
      // setTimeout(() => setShowPopup(false), 3000);
      Swal.fire({
        title: "Error",
        text: "Please Provide an OTP",
        icon: "error",
      });
      return;
    }

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setIsProcessing(false);
        Swal.fire({
          title: "Error",
          text: "Internet Disconnected",
          icon: "error",
        });
        return;
      }

      const response = await verify(data);

      if (response.success === true) {
        setShowPopup(true);
        // handleShowPopup("Account Verified Succesfully ", "success");
        // setTimeout(() => setShowPopup(false), 5000);
        Swal.fire({
          title: "Success",
          text: "Account Verified Succesfully",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = "/login";
          }
        });
        setIsProcessing(false);
        // window.location.href = "/login";
        return;
      }
    } catch (error) {
      console.error("Error:", error.response);
      handleShowPopup(error.response.data.error, "error");
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setIsProcessing(false); // Set processing state back to false
    }
  };

  const handleChange = (event) => {
    setOtpCode(event.target.value);
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
      <div className="md:position-relative">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center mr-10 mb-4 position-absolute top-10 start-20 top-bk"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
          <span className="ml-4 top-bk">Back</span>
        </div>
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 v-head">Verify Email</h1>
            <h2 className="text-lg mb-6 v-sub">
              Enter the OTP sent to your email address for verification <br />
              If you don’t see it in your inbox, check your spam folder
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4">
                <input
                  type="text"
                  name="otp"
                  value={otpCode}
                  onChange={handleChange}
                  onKeyDown={(event) => {
                    if (event.key === "-" || event.key === "e") {
                      event.preventDefault();
                    }
                  }}
                  className="border-b border-gray-300 rounded-none px-4 py-2 focus:outline-none v-input"
                  placeholder="Enter OTP"
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 main-bg text-white hover:bg-blue-600 transition-colors duration-300"
              >
                Submit
              </button>
            </form>
            <p className="mt-4">
              Didn't get the OTP?
              <Link className="text-purple-500 ml-1">Resend</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

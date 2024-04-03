import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PopupModal from "../Modal/PopupModal";
import Loading from "../Modal/Loading";
import { forgotPassword } from "../../lib/fetch";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // New state variable
  const authCtx = useContext(AuthContext);
  let navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    const data = {
      email,
    };
    if (!email) {
      setIsProcessing(false);
      Swal.fire({
        title: "Error",
        text: "Fill in the required fill",
        icon: "error",
      });
      return;
    }
    try {
      const response = await forgotPassword(data);
      if (response.success === true) {
        setIsProcessing(false);
        Swal.fire({
          title: "Success",
          text: "OTP sent Successfully",
          icon: "success",
        });
        setTimeout(() => setShowPopup(false), 5000);
        window.location.href = "/reset";
        return;
      }

      console.log(response);
    } catch (error) {
      console.error("Error:", error.response.data.error);
      // handleShowPopup(error.response.data.error, "error");
      // setTimeout(() => setShowPopup(false), 3000);
      Swal.fire({
        title: "Error",
        text: "Email not found in database",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
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
        onClick={() => setShowPopup(false)}
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
          {/* <FontAwesomeIcon icon={faChevronLeft} className='mr-2' />
          <span className='ml-4 top-bk'>Back</span> */}
        </div>
        <div className="flex justify-center container items-center h-screen bg-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 v-head">Forgot Password</h1>
            <h2 className="text-xl mb-6 p-2">
              Enter a registered email address to receive a password reset link
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="border-b border-gray-300 rounded-none px-4 py-2 focus:outline-none v-input"
                  placeholder="Email Address"
                />
              </div>
              <button
                type="submit"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 main-bg text-white transition-colors duration-300"
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

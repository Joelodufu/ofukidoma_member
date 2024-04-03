import React, { useContext, useState } from "react";
import backGround from "../../bg.jpg";
import logo from "../Members/small-logo.png";
import { AuthContext } from "../../context/AuthContext";
import { adminLogin } from "../../lib/fetch";
import Loading from "../Modal/Loading";
import PopupModal from "../Modal/PopupModal";
import Swal from "sweetalert2";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // New state variable

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const authCtx = useContext(AuthContext);
  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true); // Set isProcessing to true when API call starts
    const requestBody = {
      email,
      password,
    };

    if (!email || !password) {
      setIsProcessing(false);
      handleShowPopup("Please Fill in the required fields", "error");
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    try {
      const response = await adminLogin(requestBody);

      if (response.success === true) {
        authCtx.authenticate(response.token);
        authCtx.setUser(response.data.user);
        authCtx.setId(response.data.user._id);

        setIsProcessing(false);
        Swal.fire({
          title: "Success",
          text: "Login Successfull",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = "/server";
          }
        });
      }
      console.log(response);
      // localStorage.setItem('token', token);
    } catch (error) {
      console.log(error.response);
      handleShowPopup(
        error.response?.data?.message || "Incorrect email or password",
        "error"
      );
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setIsProcessing(false);
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
      <div
        style={{ backgroundImage: `url(${backGround})` }}
        className="min-h-screen bg-cover bg-center flex items-center"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-start pl-9">
            <div className="bg-white shadow-md rounded-lg w-96 p-8">
              <div className="flex items-center flex-column text-center mb-5">
                <span className="text-xl font-bold mb-5">
                  <img src={logo} alt="Logo" />
                </span>
                <h2 className="text-4xl font-bold">Admin Login</h2>
                <p className="text-muted">Log in to your account</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  {/* <label
                    className='block mb-2 font-bold text-gray-700'
                    htmlFor='email'
                  >
                    Email
                  </label> */}
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-5">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  // type='submit'
                  className="w-full bg-red-500 text-white py-2 rounded duration-300 mb-3"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;

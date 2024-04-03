import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Members/topNavbar";
import MembersNav from "../Members/Members-nav";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../Modal/Loading";
import { checkInternetConnection } from "../../lib/network";
import PopupModal from "../Modal/PopupModal";
import { editUser } from "../../lib/fetch";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import constants from "../../lib/config";
// 0058264305
const apiUrl = constants.apiUrl

const SponsorProfile = () => {
  const handleDeleteToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    console.log("Token deleted from local storage");
    window.location.href = "/login";
  };

  const [ngoName, setNgoName] = useState("");
  const [email, setEmail] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [user, setUser] = useState("");

  const [image, setImage] = useState("");
  const [userImage, setUserImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const authCtx = useContext(AuthContext);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [fileName, setFileName] = useState("");

  const [hasChanges, setHasChanges] = useState(false);

  const editProfileToggle = () => {
    setIsEdit(!isEdit);
    console.log(isEdit);
  };

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  const handleUserImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    } else {
      setImage(null);
      setFileName(null);
    }
    console.log(file);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pingNetwork = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setIsLoading(false);
      handleShowPopup("INTERNET DISCONNECTED", "error");
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    pingNetwork();
  }, [pingNetwork]);

  const userName = authCtx.userInfo;

  useEffect(() => {
    setUser(userName.name);
  }, []);

  const getFirstAndLast = (fullName) => {
    const nameArray = fullName?.split(" ");
    const first = nameArray[0];
    const last = nameArray.length > 1 ? nameArray[nameArray.length - 1] : "";
    console.log(
      `${first} : first  ${nameArray} : nameArray  last ${last}`,
      nameArray.length
    );
    return { first, last };
  };

  const { first, last } = getFirstAndLast(user);

  useEffect(() => {
    setFirstName(first || "");
    setLastName(last || "");
    setEmail(userName.email || "");
    setPhoneNumber(userName.phone || "");
    setAddress(userName.address || "");
    setProfileDescription(userName.description || "");
  }, [
    first,
    last,
    userName.address,
    userName.description,
    userName.email,
    userName.phone,
  ]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      // Add more cases for other input fields if needed
      default:
        break;
    }
    // Set the hasChanges flag to true when the user starts typing
    setHasChanges(true);
  };
  const handleCancelEdit = () => {
    // Clear input fields
    setFirstName("");
    setLastName("");
    // Set the hasChanges flag to false
    setHasChanges(false);
  };

  console.log(first, last);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!firstName || !lastName) {
      setIsLoading(false);
      handleShowPopup("Please Fill in the required fields", "error");
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    // if (image.length === 0) {
    //   handleShowPopup('No image was selected', 'error')
    //   setTimeout(() => setShowPopup(false), 3000)
    //   setIsLoading(false)
    //   return
    // }

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    const response = await axios.post(
      process.env.REACT_APP_CLOUDINARY_URL,
      formData
    );

    const imageUrl = response.data.secure_url;

    const data = {
      firstname: firstName,
      image: imageUrl,
      phone: phoneNumber,
      description: profileDescription,
      address: address,
      email: email,
    };

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setIsLoading(false);
        handleShowPopup("INTERNET DISCONNECTED", "error");
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }

      const response = await editUser(authCtx.token, authCtx.id, data);
      authCtx.setUser(response.data);
      console.log(response);
      handleShowPopup(
        "Your Information has been Successfully Updated",
        "success"
      );
      setTimeout(() => setShowPopup(false), 3000);
      setIsEdit(true);
      // window.location.reload()
      // setUserImage(response.data.data?.image?.[0])
    } catch (error) {
      if (error) {
        handleShowPopup("Could not Edit Your Profile", "error");
        setIsLoading(false);
      }
      setIsLoading(false);
      setIsEdit(true);

      console.log(error);
    } finally {
      setTimeout(() => setShowPopup(false), 3000);
      setIsEdit(true);
    }
    setIsLoading(false);

    // Save the updated profile information here
  };

  if (isLoading) {
    return <Loading isLoggin={isLoading} color={"white"} />;
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
    <div>
      {isLoading && <Loading isLoggin={isLoading} color={"white"} />}
      <Navbar
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div
        style={{ height: "full" }}
        className="flex flex-col bg-gray-200 md:flex-row mt-5"
      >
        <MembersNav className="" />
        <div className="px-4 py-6 bg-gray-200 w-full">
          <div className="py-12 m-auto container w-full border rounded">
            <div className="d-flex items-center justify-between w-100">
              {/* <h1>Is it working???</h1>
            <h2>Account</h2> */}

              {isEdit && (
                <button
                  style={{
                    backgroundColor: "#9968D1",
                    borderRadius: "100px",
                    width: "150px",
                    height: "35px",
                  }}
                  className="px-1 py-1 text-white focus:outline-none"
                  onClick={editProfileToggle}
                >
                  Edit Account
                </button>
              )}
            </div>
            <div className="bg-white mt-2 rounded px-10 py-5">
              <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="w-40">
                    <img
                      src={
                        authCtx.userInfo?.image?.[0] ||
                        process.env.REACT_APP_USER_DEFAULT_IMAGE
                      }
                      alt="user-name"
                      className="border border-1 h-40 w-40 rounded-circle"
                    />
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="text-muted">Name</label>
                      {isEdit && (
                        <p className="text-4xl font-bold">
                          {authCtx.userInfo.name}
                        </p>
                      )}
                      {!isEdit && (
                        <input
                          disabled={isEdit}
                          type="text"
                          className="w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          placeholder="Full Name"
                          value={firstName}
                          onChange={handleInputChange}
                          name="firstName"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-muted">Email Address</label>
                      {isEdit && (
                        <p className="font-bold">{authCtx.userInfo.email}</p>
                      )}
                      {!isEdit && (
                        <input
                          disabled={isEdit}
                          type="email"
                          className="w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          name="email"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="text-muted"> Phone Number</label>
                      {isEdit && (
                        <p>
                          {" "}
                          {authCtx.userInfo?.phone
                            ? authCtx.userInfo?.phone
                            : "Please set your phone number"}
                        </p>
                      )}
                      {!isEdit && (
                        <PhoneInput
                          className="w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          international
                          defaultCountry="NG"
                          limitMaxLength={true}
                          name="phoneHolder"
                          id="phoneHolder"
                          countrySelectProps={{ unicodeFlags: false }}
                          value={phoneNumber}
                          onChange={setPhoneNumber}
                          autoComplete="new-password"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-muted">Address</label>
                      {isEdit && (
                        <p>
                          {authCtx.userInfo?.address
                            ? authCtx.userInfo?.address
                            : "Please set your address"}
                        </p>
                      )}
                      {!isEdit && (
                        <input
                          disabled={isEdit}
                          type="address"
                          className="w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          placeholder="Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          name="address"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-column mt-3">
                  <label>Description</label>
                  <textarea
                    disabled={isEdit}
                    rows={"8"}
                    cols={"10"}
                    className="border border-grey rounded-xl mt-2"
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                  ></textarea>
                </div>
                {!isEdit && (
                  <div className="py-2 w-full flex justify-between items-end mt-3 pl-3">
                    <div className="ml-5">
                      <input
                        accept="image/*"
                        id="userImage"
                        name="userImage"
                        type="file"
                        onChange={handleUserImage}
                        style={{ display: "none" }}
                      />
                      <label htmlFor="userImage" className="ml-5">
                        Upload
                      </label>
                      <span className="ml-2">
                        {fileName
                          ? fileName.length > 16
                            ? fileName.slice(0, 5) + "..."
                            : fileName
                          : ""}
                      </span>
                    </div>
                    {hasChanges && (
                      <button
                        className="btn btn-custom"
                        style={{ color: "red" }}
                        onClick={handleCancelEdit}
                        type="submit"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="btn btn-custom"
                      onClick={handleSaveProfile}
                      type="submit"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorProfile;

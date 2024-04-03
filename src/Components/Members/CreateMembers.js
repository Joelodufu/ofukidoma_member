import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import CreationNotification from "../Modal/CreationNotification";
import Loading from "../Modal/Loading";
import PopupModal from "../Modal/PopupModal";
import { checkInternetConnection } from "../../lib/network";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Navbar from "./topNavbar";
import MembersNav from "./Members-nav";
import { Country, State, City } from "country-state-city";
import constants from "../../lib/config";
// import NaijaStates from 'naija-state-local-government'
const apiUrl = constants.apiUrl

const CreateMember = () => {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [typeOfFundraising, setTypeOfFundraising] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [raise, setRaise] = useState("");
  const [medicalReport, setMedicalReport] = useState("");
  const [imageOrVideo, setImageOrVideo] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [sponsor, setSponsor] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");

  const [fileMType, setFileMType] = useState("");
  const [fileMName, setFileMName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const userId = localStorage.getItem("userId");
  // const token = localStorage.getItem('token')
  const authCtx = useContext(AuthContext);
  console.log(Country.getAllCountries());
  console.log(State.getStatesOfCountry("NG"));

  const allStates = State.getStatesOfCountry("NG").map((state) => ({
    value: state.name,
    displayValue: `${state.name}, ${state.countryCode}`,
  }));

  const handleDaft = () => {
    setSaveAsDraft((prevState) => !prevState);
  };

  const pingNetworkConnection = async () => {
    setIsLoading(true);
    try {
      const isConnected = await checkInternetConnection();
      if (isConnected) {
        setIsLoading(false);
        return;
      } else if (!isConnected) {
        setShowPopup(true);
        setErrorMessage("INTERNET DISCONNECTED");
        setStatus("error");
        setIsLoading(false);
        setTimeout(() => setShowPopup(true), 3000);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    pingNetworkConnection();
  }, []);

  const token = authCtx.token;
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleImageOrVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setImageOrVideo(file);
      setFileType(file.type.slice(0, 5));
      // Process the selected file here
    } else {
      setFileName(null);
      setImageOrVideo(null);
    }
  };

  const handleMedicalChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileMName(file.name);
      setMedicalReport(file);
      setFileMType(file.type.slice(0, 5));
    } else {
      setFileMName(null);
      setMedicalReport(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (imageOrVideo.length === 0 || medicalReport.length === 0) {
      alert("no image or video was selected");
      setIsLoading(false);
      return;
    }

    const handleCloudinaryUpload = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/deqfgp7hg/upload",
        formData
      );

      return response.data.secure_url;
    };

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setErrorMessage("INTERNET DISCONNECTED");
        setStatus("error");
        setIsLoading(false);
        return;
      }

      const imageURL = await handleCloudinaryUpload(imageOrVideo);
      const medicalReportURL = await handleCloudinaryUpload(medicalReport);

      // const { _user, state, typeOfFundraising, title, description, setDuration, endDate, raise, MedicalReport } =
      //   formData;

      if (
        !userId ||
        !state ||
        !typeOfFundraising ||
        !title ||
        !description ||
        !startDate ||
        !endDate ||
        !raise ||
        !sponsor
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill in all the required fields",
        });
        setIsLoading(false);
        return;
      }

      // const result = await cloudinary.uploader.upload(file, uploadOptions);
      // const imageURL = result.secure_url;

      const requestBody = {
        state,
        typeOfFundraising,
        title,
        startDate,
        _user: userId,
        description,
        endDate,
        MedicalReport: medicalReportURL,
        raise,
        imageOrVideo: imageURL,
        sponsor,
        saveAsDraft,
      };
      console.log(requestBody);

      const response = await axios.post(
        `${apiUrl}/api/v1/member/postmember`,
        // JSON.stringify(requestBody),
        requestBody,
        {
          headers: {
            'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setStatus(response.data.success);
      // setSuccessMessage(response.data.message)
      // setShowPopup(true)
      // // setTimeout(() => setShowPopup(false), 4000)
      // setIsLoading(false)

      // if (response.ok) {
      //   console.log(response.data)
      //   // const data = await response.json();
      //   // Swal.fire({
      //   //   icon: 'success',
      //   //   title: 'Success',
      //   //   text: JSON.stringify(data),
      //   // });
      // } else {
      //   throw new Error('Form submission failed');
      // }
    } catch (error) {
      console.log(error.response);
      setStatus(error.response?.data?.success || "error");
      setErrorMessage(error.response?.data?.error || "Form submission failed'");
      setShowPopup(true);
      // setTimeout(() => setShowPopup(false), 4000)
      // setIsLoading(false)

      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: error.message,
      // })
    }
    setIsLoading(false);
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (imageOrVideo.length === 0 || medicalReport.length === 0) {
      alert("no image or video was selected");
      setIsLoading(false);
      return;
    }

    const handleCloudinaryUpload = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/deqfgp7hg/upload",
        formData
      );

      return response.data.secure_url;
    };

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setErrorMessage("INTERNET DISCONNECTED");
        setStatus("error");
        setIsLoading(false);
        return;
      }

      const imageURL = await handleCloudinaryUpload(imageOrVideo);
      const medicalReportURL = await handleCloudinaryUpload(medicalReport);

      // const { _user, state, typeOfFundraising, title, description, setDuration, endDate, raise, MedicalReport } =
      //   formData;

      if (
        !userId ||
        !state ||
        !typeOfFundraising ||
        !title ||
        !description ||
        !startDate ||
        !endDate ||
        !raise ||
        !sponsor
      ) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please fill in all the required fields",
        });
        setIsLoading(false);
        return;
      }

      // const result = await cloudinary.uploader.upload(file, uploadOptions);
      // const imageURL = result.secure_url;

      const requestBody = {
        state,
        typeOfFundraising,
        title,
        startDate,
        _user: userId,
        description,
        endDate,
        MedicalReport: medicalReportURL,
        raise,
        imageOrVideo: imageURL,
        sponsor,
        saveAsDraft: true,
      };
      console.log(requestBody);

      const response = await axios.post(
        `${apiUrl}/api/v1/member/postmember`,
        // JSON.stringify(requestBody),
        requestBody,
        {
          headers: {
            'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setStatus(response.data.success);
      // setSuccessMessage(response.data.message)
      // setShowPopup(true)
      // // setTimeout(() => setShowPopup(false), 4000)
      // setIsLoading(false)

      // if (response.ok) {
      //   console.log(response.data)
      //   // const data = await response.json();
      //   // Swal.fire({
      //   //   icon: 'success',
      //   //   title: 'Success',
      //   //   text: JSON.stringify(data),
      //   // });
      // } else {
      //   throw new Error('Form submission failed');
      // }
    } catch (error) {
      console.log(error.response);
      setStatus(error.response?.data?.success || "error");
      setErrorMessage(error.response?.data?.error || "Form submission failed'");
      setShowPopup(true);
      // setTimeout(() => setShowPopup(false), 4000)
      // setIsLoading(false)

      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: error.message,
      // })
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div>
        <Navbar
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
        />
        {isLoading && <Loading isLoggin={isLoading} color={"white"} />}
        {showPopup && (
          <PopupModal
            status={status}
            title={!status === true ? "Failed" : "Error"}
            message={!status === true ? errorMessage : errorMessage}
            onClick={() => setShowPopup(false)}
          />
        )}
        <div className="flex flex-col bg-gray-200 md:flex-row mt-5">
          <MembersNav className="md:w-1/4 md:mr-0" />
          {status === true && <CreationNotification />}
          <div className="flex-1 pr-5 mx-auto px-2 py-4 ">
            <Link
              to="/members"
              className="flex items-center position-absolute top-20 start-22 mt-2 mb-5 "
            >
              {/* <FontAwesomeIcon
                icon={faChevronLeft}
                className='mr-2 ml-3 top-bk'
              /> */}
              {/* <span className='ml-4 top-bk'>Back</span> */}
            </Link>
            <div style={{ padding: 0 }} className="container mx-auto bg-white">
              <div className="main-bg cc-header flex flex-col justify-center border rounded pt-0 p-10 pb-0">
                <div>
                  <h1 className="text-white md:text-4xl text-4xl font-bold">
                    Setup Your Member
                  </h1>
                </div>
                <div>
                  <p className="text-white md:text-lg text-sm">
                    Fill in all the required fields and submit. Your member
                    will only go live after it has been verified by FundEzers'
                    team.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap -mx-4 p-4">
                <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
                  <h2 className="text-2xl font-bold mb-4 cc-head uppercase">
                    Let's start with the basis
                  </h2>
                  <div className="mb-4">
                    <label className="block cc-head text-muted">
                      Patient Name
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 w-full"
                      type="text"
                      name="_user"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                    // value={formData._user}
                    // onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block cc-head text-muted">
                      Which State do You Live?
                    </label>
                    <select
                      className="border rounded-lg px-3 py-2 w-full"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      name="state"
                      placeholder="Select State"
                      id=""
                    >
                      <option value="">Select State</option>

                      {allStates.map((option, index) => {
                        return (
                          <option key={index} value={option.value}>
                            {option.displayValue}
                          </option>
                        );
                      })}
                    </select>
                    {/* <input
                      className=''
                      type='text'
                      name='state'
                      // value={formData.state}
                      // onChange={handleInputChange}
                    /> */}
                  </div>
                  <div className="mb-4">
                    <label className="block cc-head text-muted">
                      What kind of medical fundraising would you want to create?
                    </label>
                    <select
                      className="border rounded-lg px-3 py-2 w-full"
                      name="typeOfFundraising"
                      value={typeOfFundraising}
                      onChange={(e) => setTypeOfFundraising(e.target.value)}
                      placeholder="Select Category"
                    // value={formData.typeOfFundraising}
                    // onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      <option value="Cancer">Cancer</option>
                      <option value="Diabetes">Diabetes</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Organ Transplant">Organ Transplant</option>
                      <option value="Injury">Injury</option>
                      <option value="Others">Others</option>
                      {/* <option value="Other">Other</option> */}
                    </select>
                    {/* {typeOfFundraising === "Other" && (
                      <input
                        type="text
                        className="border rounded-lg px-3 py-2 w-ful
                        l mt-2"
                        placeholder="Specify Other Category"
                        value={otherCategory}
                        onChange={(e) => setOtherCategory(e.target.value)}
                      />
                    )} */}
                  </div>
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
                  <h2 className="text-2xl font-bold mb-4 cc-head uppercase">
                    Tell Your Story
                  </h2>
                  <div className="mb-4">
                    <label className="block cc-head text-muted">
                      Member title
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 w-full"
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Name of your member"
                    // value={formData.title}
                    // onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block cc-head text-muted">
                      Description
                    </label>
                    <textarea
                      className="border rounded-lg px-3 py-2 w-full"
                      rows="2"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your member"
                    // value={formData.description}
                    // onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block cc-head text-muted">
                      Hospital / Institution sponsoring the member
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 w-full"
                      type="text"
                      name="sponsor"
                      value={sponsor}
                      onChange={(e) => setSponsor(e.target.value)}
                      placeholder="Who’s sponsoring this member?"
                    // value={formData.title}
                    // onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex w-100">
                    <div className="w-1/3 mr-4">
                      <div className="mb-4">
                        <label className="block mb-2 cc-head text-muted">
                          START
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 w-full"
                          type="date"
                          name="setDuration"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        // value={formData.setDuration}
                        // onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center ml-3">
                      <svg
                        className="text-gray-500 w-6 h-6 mx-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div className="w-1/3 mx-4">
                      <div className="mb-4">
                        <label className="block mb-2 cc-head text-muted">
                          END
                        </label>
                        <input
                          className="border rounded-lg px-3 py-2 w-full"
                          type="date"
                          name="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 lg:w-1/3 px-4">
                  <h2 className="text-2xl font-bold mb-4 cc-head uppercase">
                    Set Your Member Goals
                  </h2>
                  <div className="mb-4">
                    <label className="block mb-2 cc-head text-muted">
                      How much would you like to raise?
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 w-full"
                      type="text"
                      name="raise"
                      value={raise}
                      onChange={(e) => setRaise(e.target.value)}
                    // value={formData.raise}
                    // onChange={handleInputChange}
                    />
                  </div>
                  <h1 className="font-bold">UPLOAD IMAGE</h1>
                  <div className="mb-4">
                    <label className="block mb-2 cc-head text-muted">
                      Add a cover photo
                    </label>
                    <div className="py-2 w-full flex justify-between items-center">
                      {/* <div className='border-dotted border rounded-lg px-3 py-2 w-full flex justify-between items-center m-input'> */}
                      {/* <span className='mr-2'>
                          {fileName
                            ? fileName.length > 16
                              ? fileName.slice(0, 16) + '...'
                              : fileName
                            : 'Add a picture'}
                        </span> */}

                      <input
                        id="imageOrVideo"
                        className="border rounded-lg px-3 py-2 w-full d-none"
                        type="file"
                        name="imageOrVideo"
                        onChange={handleImageOrVideoChange}
                        accept="image/*,video/*"
                      />
                      {/* </div> */}
                      <label
                        htmlFor="imageOrVideo"
                        className="btn btn-custom mx-2 w-100 border-dotted border rounded-lg"
                      >
                        Upload
                      </label>
                    </div>
                  </div>

                  <h1 className="font-bold">UPLOAD MEDICAL REPORT</h1>
                  <div className="mb-4">
                    <label className="block mb-2 cc-head text-muted">
                      Upload a pdf or image file of your medical report
                    </label>
                    <div className="py-2 w-full flex justify-between items-center">
                      {/* <div className='border-dotted border rounded-lg px-3 py-2 w-full flex justify-between items-center m-input'>
                        <span className='mr-2'>
                          {fileMName
                            ? fileMName.length > 16
                              ? fileMName.slice(0, 16) + '...'
                              : fileMName
                            : 'Add a picture'}
                        </span> */}

                      <input
                        accept=".pdf,image/*"
                        id="MedicalReport"
                        className="border rounded-lg px-3 py-2 w-full d-none"
                        type="file"
                        mame="MedicalReport"
                        onChange={handleMedicalChange}
                      />
                      {/* </div> */}
                      <label
                        htmlFor="MedicalReport"
                        className="btn btn-custom mx-2 w-100 border-dotted border rounded-lg"
                      >
                        Upload
                      </label>
                    </div>
                  </div>

                  {/* <div className='mb-4'>
            <label className='block mb-2 cc-head'>
              Upload a pdf or image file of your medical report
            </label>
            <input
              className='border rounded-lg px-3 py-2 w-full'
              type='file'
              mame='MedicalReport'
            />
          </div> */}
                  <br />
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handleSaveAsDraft}
                      className="text-purple-400 text-sm border font-bold py-2 px-4 rounded"
                    >
                      DRAFT
                    </button>
                    <button
                      className="bg-red-500 text-sm hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSubmit}
                    >
                      SUBMIT CAMPAIGN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;

import React, { useContext, useEffect, useState } from "react";
import {
  getASingleCause,
  getAllDonations,
  makeADonationCause,
  recurringDonation,
} from "../../lib/fetch";
import { AuthContext } from "../../context/AuthContext";
import MembersNav from "../Members/Members-nav";
import Navbar from "../Members/topNavbar";
import Loading from "../Modal/Loading";
import { checkInternetConnection } from "../../lib/network";
import PopupModal from "../Modal/PopupModal";
import constants from "../../lib/config";
const apiUrl = constants.apiUrl

const BigSection = ({ projectId, projectsData }) => {
  const [donationCauseData, setDonationCauseData] = useState(null);
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' or 'committedProjects'

  const authCtx = useContext(AuthContext);
  const [isMobileView, setIsMobileView] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [commitedProjects, setCommitedProjects] = useState([]);
  const [projects, setProjects] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await getAllDonations(authCtx.token);
        const committees = response.committees;
        console.log(committees);

        // Filter the committees that belong to the same case and the same user
        const userCommittedProjects = committees.filter(
          (donation) =>
            donation?.user?.[0]?._id === authCtx.userInfo._id &&
            donation.case[0] === projectId &&
            donation.isVerified
        );

        console.log(userCommittedProjects);
        setCommitedProjects(userCommittedProjects);
      } catch (error) {
        console.error("Error fetching committees:", error);
      }
    };

    fetchAllDonations();
  }, [authCtx.token, authCtx.userInfo._id, projectId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (commitedProjects.length > 0) {
          const response = await getASingleCause(
            authCtx.token,
            commitedProjects[0].case[0] // Assuming that all commitedProjects have the same case ID
          );
          console.log(response);

          setProjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [authCtx.token, commitedProjects]);

  const handleToggle = () => {
    setIsRecurring(!isRecurring);
  };

  const handleFrequencyChange = (event) => {
    setSelectedFrequency(event.target.value);
  };

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
  };

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };
  const handleDonate = async (e) => {
    e.preventDefault();

    setIsProcessing(true);

    const donationDataC = {
      amount: selectedAmount,
      userId: authCtx.id,
      email: authCtx.userInfo.email,
    };
    const donationData = {
      amount: selectedAmount,
      userId: authCtx.id,
      email: authCtx.userInfo.email,
      subscriptionPlan: selectedFrequency,
    };

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setIsLoading(false);
        handleShowPopup("INTERNET DISCONNECTED", "error");
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }
      if (!selectedAmount) {
        handleShowPopup("Please Select An Amount", "error");
        return;
      }

      let response;
      if (isRecurring) {
        response = await makeADonationCause(
          authCtx.token,
          projectId,
          donationDataC
        );
        console.log(response, "Cause");
      } else {
        if (!selectedFrequency || !selectedAmount) {
          handleShowPopup("Please Select the required field", "error");
          setTimeout(() => setShowPopup(false), 3000);
          return;
        }
        response = await recurringDonation(
          authCtx.token,
          projectId,
          donationData
        );
        console.log(response, "Recurring");
      }

      // Redirect to the authorizationUrl

      const reference = response.data.reference;
      window.location.href = response.data.authorizationUrl;

      localStorage.setItem("paymentReference", reference);
    } catch (error) {
      handleShowPopup(error.response.data.message, "error");
      setTimeout(() => setShowPopup(false), 3000);
      console.error(error.response.data);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const verifyPayment = async (reference) => {
    try {
      const verificationData = {
        reference: reference,
      };

      const response = await fetch(
        `${apiUrl}/api/v1/donation/verify/case`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.token}`,
          },
          body: JSON.stringify(verificationData),
        }
      );

      const data = await response.json();
      // You can handle the verification response here
      console.log(data.message, data);
      if (data.success) {
        handleShowPopup(data.message, "success");
        setTimeout(() => setShowPopup(false), 3000);

        // Payment verified, perform necessary actions
      } else {
        // Payment verification failed, handle accordingly
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const formatDateTime = (timestamp) => {
    const dateObject = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long", // Use 'short' for abbreviated month names
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return dateObject.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    // Check if the paymentReference exists in localStorage
    const paymentReference = localStorage.getItem("paymentReference");

    if (paymentReference) {
      // Payment reference exists, verify the payment
      verifyPayment(paymentReference);

      // Remove the paymentReference from localStorage after verifying the payment
      localStorage.removeItem("paymentReference");
    }
  }, []);

  // Add the following code to handle the redirection and check the payment status

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search)
  //   const paymentStatus = urlParams.get('paymentStatus')

  //   if (paymentStatus === 'canceled') {
  //     // Handle canceled donation here
  //     console.log('Donation canceled by user')
  //   }

  //   // Clear the URL query parameters
  //   // window.history.replaceState({}, document.title, window.location.pathname)
  // }, [])

  if (isLoading) {
    return (
      <Loading
        style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
        color={"white"}
        isLoggin={isLoading}
      />
    );
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  console.log(selectedAmount, selectedFrequency);

  const renderProjects = () => {
    // if (isLoading) {
    //   return <p>Loading projects...</p>5
    // }

    return (
      <>
        <div className="flex flex-col md:flex-row">
          {/* Projects Section */}
          <div className="md:w-2/3 mt-6 md:mr-2">
            <div className="bg-white sm:grid-cols-2 md:grid-cols-2 gap-4 p-4">
              {/* Mapping through projects */}
              {/* {projects.map((projectsData) => ( */}
              <div key={projectsData._id} className="border p-4">
                <h3 className="text-xl text-center font-bold mb-2 p-2 bg-gray-100">
                  {projectsData.Name}
                </h3>
                <p className="text-gray-600 text-justify">
                  {projectsData.Description}
                </p>
              </div>
              {/* ))} */}
            </div>
          </div>

          {/* Donation Section */}
          <div className="md:w-1/3 bg-white rounded-lg mt-4 p-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              Make Donation
            </h2>
            <form onSubmit={handleDonate}>
              <label
                className="block mb-2 font-bold text-gray-700"
                htmlFor="amount"
              >
                Enter Amount
              </label>
              <input
                type="text"
                id="amount"
                placeholder="Enter Amount"
                className={`w-full px-3 py-2 border ${selectedAmount ? "bg-gray-200" : "border-gray-300"
                  } rounded focus:outline-none focus:ring focus:ring-blue-400`}
                name="amount"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
              />
            </form>

            {/* Buttons for selecting donation amount */}
            <div className="flex flex-wrap justify-center mt-4">
              <div className="flex justify-center">
                {[1000, 2000, 3000].map((amount) => (
                  <button
                    key={amount}
                    className={`${selectedAmount === amount
                      ? "main-bg text-white"
                      : "bg-gray-100"
                      } px-4 py-2 rounded-lg m-2`}
                    onClick={() => handleAmountSelection(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                {[4000, 5000, 6000].map((amount) => (
                  <button
                    key={amount}
                    className={`${selectedAmount === amount
                      ? "main-bg text-white"
                      : "bg-gray-100"
                      } px-4 py-2 rounded-lg m-2`}
                    onClick={() => handleAmountSelection(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring Donation */}
            <div className="text-justify mt-4">
              <h1 className="font-bold mb-3 text-center">Recurring Donation</h1>
              <p>
                Let's help you ease the process of coming back to make committees
                again by making your default amount reoccur at your set
                frequency.
              </p>
            </div>

            <div className="flex items-center mt-2">
              <span className="mr-2 font-bold">Make Recurring</span>
              <button
                className={`relative focus:outline-none w-10 h-4 transition-colors duration-300 ${isRecurring ? "bg-gray-200" : "bg-red-500"
                  } rounded-full`}
                onClick={handleToggle}
              >
                <span
                  className={`absolute inset-0 w-4 h-4 transition-transform duration-300 ${isRecurring ? "translate-x-0" : "translate-x-6"
                    } bg-white rounded-full shadow-md`}
                />
              </button>
            </div>

            {/* Frequency dropdown */}
            <div className="flex flex-col mt-2">
              <label
                className="block mb-2 font-bold text-gray-700"
                htmlFor="frequency"
              >
                Select Frequency
              </label>
              <select
                id="frequency"
                className="px-4 py-2 text-gray-700 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                value={selectedFrequency}
                onChange={handleFrequencyChange}
                disabled={isRecurring}
              >
                <option value="" disabled>
                  Select Frequency
                </option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            {/* Donate button */}
            <button
              className={`mt-4 px-6 w-full py-2 text-white main-bg rounded-md focus:outline-none focus:ring focus:ring-blue-400`}
              onClick={handleDonate}
            >
              Donate
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderCommittedProjects = () => {
    if (!projects) {
      return (
        <>
          <div
            style={{ width: "70vw" }}
            className="bg-white rounded-lg mt-10 p-3 flex"
          >
            {/* <div className='grid grid-cols-3 sm:grid-cols-2 md:grid-cols-2 gap-4'> */}
            <div
              style={{ width: "100%" }}
              className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-1 gap-4"
            >
              {/* {projects.map((project) => ( */}
              <div
                style={{ width: "100%" }}
                key={projects._id}
                className="bg-white border rounded-lg p-4 text-center "
              >
                <h3 className="text-xl font-bold mb-2 p-2 bg-gray-100">
                  {projects.Name}
                </h3>
                <p className="text-gray-600 text-center">No Community Projects</p>
                {/* <Link to={`/cview?id=${project._id}`}>
                  <div className='flex justify-center'>
                    <button className='main-bg hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 w-35 rounded-pill'>
                      View
                    </button>
                  </div>
                </Link> */}
              </div>
              {/* ))} */}
            </div>
          </div>
        </>
      );
    }
    // if (isLoading) {
    //   return <p>Loading committed projects...</p>
    // }

    // Fetch data for committed projects from the endpoint
    // '${apiUrl}/api/v1/project/getproject/6495d0bff043af9c27cae6c0'
    // and render the committed projects content
    // Replace the following placeholder content with the actual content
    return (
      <>
        <div className="bg-gray-100 w-full md:w-[900px] rounded-lg mt-10 p-3 flex items-start">
          {/* <div className='grid grid-cols-3 sm:grid-cols-2 md:grid-cols-2 gap-4'> */}
          <div
            style={{ width: "100%" }}
            className="grid sm:grid-cols-2 md:grid-cols-1 gap-4"
          >
            {isProcessing && (
              <Loading isLoggin={isProcessing} color={"white"} />
            )}
            {/* {projects.map((project) => ( */}
            <div
              key={projects._id}
              className="bg-white border rounded-lg p-4 text-center"
            >
              <h3 className="text-xl font-bold mb-2 p-2 bg-gray-100">
                {projects.Name}
              </h3>
              <p className="text-gray-600 text-justify">{projects.Description}</p>

              {/* <Link to={`/cview?id=${project._id}`}>
                  <div className='flex justify-center'>
                    <button className='main-bg hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 w-35 rounded-pill'>
                      View
                    </button>
                  </div>
                </Link> */}
            </div>
            <div
              style={{ overflowY: "scroll" }}
              className="bg-white border rounded-lg p-4"
            >
              {/* <h1>Hello</h1> */}
              <table style={{ overflowY: "scroll" }} className="w-full">
                <thead>
                  <th>No</th>
                  <th>Amount</th>
                  <th className="text-right">Date & Time</th>
                </thead>
                <tbody style={{ overflowY: "scroll" }}>
                  {commitedProjects.map((commit, index) => {
                    return (
                      <tr
                        style={{
                          borderTop: "1px solid lightgrey",
                          overflowY: "scroll",
                        }}
                      >
                        <td className="p-2">{index + 1}</td>
                        <td>{commit.amount}</td>
                        <td className="text-right">
                          {formatDateTime(commit.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* ))} */}
          </div>

          {/* Content for the second section */}

          {/* Add more content here */}
        </div>
      </>
    );
  };

  return (
    <div className="md:p-4">
      <div className="bg-gray-200 md:flex">
        <div className="flex-1 bg-gray-200">
          {/* <h2 className='text-xl font-bold mb-4'>Cases</h2> */}
          <div>
            <div className="flex justify-content-start sm:flex-row sm:justify-center ">
              <button
                className={`${activeTab === "projects"
                  ? "bg-purple-200 text-black"
                  : "bg-white text-black"
                  } font-bold py-2 px-4 my-2 mx-2 rounded-sm sm:mx-0 sm:mb-0 sm:mr-2 transition-all ${activeTab === "projects"
                    ? "hover:bg-purple-300"
                    : "hover:bg-gray-200"
                  }`}
                onClick={() => handleTabChange("projects")}
              >
                Projects
              </button>
              <button
                className={`${activeTab === "committedProjects"
                  ? "bg-purple-200 text-black"
                  : "bg-white text-black"
                  } font-bold py-2 px-4 my-2 mx-2 rounded-sm sm:mx-0 sm:mb-0 sm:ml-2 transition-all ${activeTab === "committedProjects"
                    ? "hover:bg-purple-300"
                    : "hover:bg-gray-200"
                  }`}
                onClick={() => handleTabChange("committedProjects")}
              >
                Community Projects
              </button>
            </div>

            {activeTab === "projects" ? renderProjects() : renderCommittedProjects()}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsView = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' or 'committedProjects'
  const authCtx = useContext(AuthContext);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getASingleCause(authCtx.token, projectId);
        console.log(response);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [authCtx.token, projectId]);

  // if (isLoading) {
  //   return <Loading color={'white'} isLoggin={isLoading} />
  // }

  //   return (
  // <>
  //   <Navbar
  //     style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
  //   />
  //   {/* Mobile view: MembersNav at the top */}
  //   <div className='block mt-10 bg-gray-200 d-md-none'>
  //     <MembersNav className='w-1/4' />
  //   </div>

  //   <div className='bg-gray-200 mt-20 flex'>
  //     {/* Desktop view: MembersNav and BigSection beside each other */}
  //     <div className='d-none d-md-block w-1/4'>
  //       <MembersNav />
  //     </div>
  //     <div className='flex items-center w-100'>
  //       <BigSection projectId={projectId} projectsData={projects} />
  //     </div>
  //   </div>
  // </>

  //   )

  return (
    <div>
      <Navbar
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div
        style={{ height: projects >= 3 ? "" : "" }}
        className="flex flex-col bg-gray-200 md:flex-row mt-5"
      >
        <MembersNav className="md:w-1/4 md:mr-0" />
        <div>
          <div className="flex items-center">
            <BigSection projectId={projectId} projectsData={projects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;

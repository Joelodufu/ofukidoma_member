import React, { useContext } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Modal/Loading";
import { AuthContext } from "../../context/AuthContext";
import PopupModal from "../Modal/PopupModal";
import { RWebShare } from "react-web-share";
import axios from "axios";
import "./members.css";
import SettingModal from "../Modal/SettingModal";
import DonateModal from "./DonateModal";
import Navbar from "./topNavbar";
import MembersNav from "./Members-nav";
import WithdrawModal from "./WithdrawModal";
import Swal from "sweetalert2";
import constants from "../../lib/config";
const apiUrl = constants.apiUrl

const MemberView = () => {

  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get("id");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  console.log(window.location.href);
  const authCtx = useContext(AuthContext);

  const [memberData, setMemberData] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState();
  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [LastDonor, setLastDonor] = useState([]);
  const [TotalDonation, setTotalDonation] = useState(0);
  const [LastDonation, setLastDonation] = useState([]);
  const [AllDonation, setAllDonation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  // const progress = (TotalDonation / memberData.data.raise) * 100;
  const [profileData, setProfileData] = useState([]);
  const [displayedComments, setDisplayedComments] = useState(4);
  const [displayedDonor, setDisplayedDonor] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAnonymousDonor, setIsAnonymousDonor] = useState(false);
  const [openDonateModal, setOpenDonateModal] = useState(false);

  const [email, setEmail] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);

  const handleSettingModal = () => {
    setOpenSettings(!openSettings);
  };

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };
  const handleLoadMore = () => {
    setDisplayedComments((prevValue) => prevValue + 4);
  };
  const handleLoadMoreDonor = () => {
    setDisplayedDonor((prevValue) => prevValue + 4);
  };
  useEffect(() => {
    if (!authCtx.userInfo) {
      Swal.fire({
        title: "Closed",
        text: "This is a closed member",
        icon: "success",
      });
    }
  }, []);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/user/getprofile/${authCtx.id}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch profile data");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };
    setIsLoading(false);

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/donation/getcommittees`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const committees = data.committees.filter(
            (donation) =>
              donation.member.includes(memberId) && donation.isVerified
          );
          const totalAmount = committees.reduce(
            (sum, donation) => sum + donation.amount,
            0
          );
          setTotalDonation(totalAmount);
        } else {
          console.error("Failed to fetch donation data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDonationData();
  }, [memberId, authCtx.token]);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/member/getmember/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMemberData(data);
        } else {
          console.error("Failed to fetch member data");
          Swal.fire({
            title: "Error",
            text: "Failed to fetch member data",
            icon: "error",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMemberData();
  }, [memberId, authCtx.token]);

  useEffect(() => {
    const fetchLastDonation = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/donation/last/${authCtx.id}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.lastDonation && data.lastDonation.amount) {
            setLastDonation((prevData) => [
              ...prevData,
              data.lastDonation.amount,
            ]);
          }
        } else {
          console.error("Failed to fetch member data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLastDonation();
  }, [authCtx.token, authCtx.id]);
  // useEffect(() => {
  //   const don = AllDonation.map((donor) => {
  //     return donor.user[0]?.userType?.includes('Donor')
  //     // console.log(donor.user[0]?.userType?.includes('Donor'))
  //   })
  //   console.log(don)
  // }, [])
  // get all
  useEffect(() => {
    const fetchAllDonation = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/donation/getcommittees`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const committees = data.committees.filter(
            (donation) => donation.member[0] === memberId
          );

          // Object to store unique donors and their total committees
          const uniqueDonors = {};

          committees.forEach((donation) => {
            const donorId = donation?.user?.[0]?._id;

            if (!donation?.user?.[0] && donation.isVerified) {
              const anonymousDonorId = donorId || uniqueDonors.length;
              uniqueDonors[anonymousDonorId] = {
                name: "Anonymous",
                amount: donation.amount,
                image: donation?.user?.[0]?.image[0],
                donorId: anonymousDonorId,
              };
            } else if (donorId && donation.isVerified) {
              if (uniqueDonors[donorId]) {
                uniqueDonors[donorId].amount += donation.amount;
              } else {
                uniqueDonors[donorId] = {
                  name: donation?.user?.[0]?.name || "Anonymous",
                  amount: donation.amount,
                  image: donation?.user?.[0]?.image[0],
                  donorId: donorId,
                };
              }
            }
          });

          // Convert the object to an array of donors
          const verifiedDonations = Object.values(uniqueDonors);

          setAllDonation(verifiedDonations);
          console.log(verifiedDonations);
        } else {
          console.error("Failed to fetch member data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllDonation();
  }, [authCtx.token, memberId]);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/member/getallcomments`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": apiUrl, // replace with your own domain
              Authorization: `Bearer ${authCtx.token}`,
            },
            mode: "cors",
            credentials: "include",
          }
        );
        console.log(response.data.data);
        const contentComment = response?.data?.data?.filter((comment) => {
          return comment?.member === memberId;
        });
        setComments(contentComment);
      } catch (error) {
        console.log(error.response);
      }
    };
    getAllComments();
  }, [authCtx.token, memberId]);
  const handleToggle = () => {
    setIsRecurring(!isRecurring);
  };

  const handleFrequencyChange = (time) => {
    setSelectedFrequency(time);
  };

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
  };
  const verifyPayment = async (reference) => {
    try {
      const verificationData = {
        reference: reference,
      };

      const response = await fetch(
        `${apiUrl}/api/v1/donation/verify`,
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
      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Your Payment was successfully",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.reload();
          }
        });
        //         setTimeout(() => setShowPopup(false), 2000)
        //  setTimeout(() => window.location.reload(), 2000)
        // Payment verified, perform necessary actions
      } else {
        // Payment verification failed, handle accordingly
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      Swal.fire({
        title: "Error",
        text: "Error verifying payment",
        icon: "error",
      });
    } finally {
      setTimeout(() => setShowPopup(false), 2000);
    }
  };
  const verifyVistorPayment = async (reference) => {
    try {
      const verificationData = {
        reference: reference,
      };
      const response = await fetch(
        `${apiUrl}/api/v1/donation/verify/visitor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        }
      );

      const data = await response.json();
      // You can handle the verification response here
      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Your payment was succesful as a vistor",
          icon: "success",
        });
        // Payment verified, perform necessary actions
      } else {
        // Payment verification failed, handle accordingly
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      Swal.fire({
        title: "Error",
        text: "Error verifying payment",
        icon: "error",
      });
    } finally {
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  const handleDonateModal = () => {
    setOpenDonateModal(true);
  };

  const handleDonate = async () => {
    try {
      let donationData;
      let response;
      if (authCtx.userInfo.name) {
        if (isAnonymousDonor) {
          // If donating as anonymous, replace user's name with 'Anonymous'
          donationData = {
            amount: selectedAmount,
            userId: "64c79e6ed3277b136a962a46",
            email: "anonymous@example.com",
          };
          response = await fetch(
            `${apiUrl}/api/v1/donation/postcommittees/${memberId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authCtx.token}`,
              },
              body: JSON.stringify(donationData),
            }
          );
          localStorage.setItem("isAnonymousDonor", isAnonymousDonor);
        } else {
          donationData = {
            amount: selectedAmount,
            userId: authCtx.id,
            email: authCtx.userInfo.email,
          };
          response = await fetch(
            `${apiUrl}/api/v1/donation/postcommittees/${memberId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authCtx.token}`,
              },
              body: JSON.stringify(donationData),
            }
          );
        }
      } else {
        donationData = {
          amount: selectedAmount,
          email: email,
        };
        response = await fetch(
          `${apiUrl}/api/v1/donation/visitordonation/${memberId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(donationData),
          }
        );
        localStorage.setItem("visitor", true);
      }

      const data = await response.json();

      if (data.success) {
        const reference = data.data.reference;

        // Redirect to the authorizationUrl
        window.location.href = data.data.authorizationUrl;

        // Save the reference to local storage or a state variable to access it after the user returns
        localStorage.setItem("paymentReference", reference);
        // localStorage.setItem('paymentUrl', data.data.authorizationUrl)
      } else {
        console.error("Error creating payment:", data.error);
      }
    } catch (error) {
      console.error("Error handling donation:", error);
    }
  };

  useEffect(() => {
    const closeMember = async () => {
      if (memberData?.data?.amountGotten >= memberData?.data?.raise) {
        // setMemberStatus('Closed')
        console.log(memberData);
        try {
          // Call the API endpoint to close the member
          await axios.patch(
            `${apiUrl}/api/v1/member/close/${memberData.data._id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${authCtx.token}`,
              },
            }
          );
          Swal.fire({
            title: "Success",
            text: "This Is a Closed member",
            icon: "success",
          });
        } catch (error) {
          console.error("Error closing member:", error);
          Swal.fire({
            title: "Error",
            text: "Error closing member",
            icon: "error",
          });
        }
      }
    };
    closeMember();
  }, [
    authCtx.token,
    memberData?.data?._id,
    memberData?.data?.amountGotten,
    memberData?.data?.raise,
  ]);

  useEffect(() => {
    // Check if the paymentReference exists in localStorage
    const paymentReference = localStorage.getItem("paymentReference");
    const isAnonymousDonor = localStorage.getItem("isAnonymousDonor");
    const visitor = localStorage.getItem("visitor");

    if (!visitor && paymentReference) {
      // Payment reference exists, verify the payment
      verifyPayment(paymentReference);
      // Remove the paymentReference from localStorage after verifying the payment
      localStorage.removeItem("paymentReference");
    } else if (visitor && paymentReference) {
      verifyVistorPayment(paymentReference);
      localStorage.removeItem("paymentReference");
      localStorage.removeItem("visitor");
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!memberData || !memberData.data) {
    return <Loading />;
  }

  const startDate = new Date(
    memberData?.data?.startDate
  ).toLocaleDateString();
  const endDate = new Date(memberData?.data?.endDate).toLocaleDateString();
  const progress = (TotalDonation / memberData?.data?.raise) * 100;
  const progressBarWidth = progress > 100 ? "w-full" : `w-${progress}`;
  // Sample data for the recent committees list
  // const recentDonations = [
  //   { name: 'John Doe', amount: 50, profileImage: 'john-doe.jpg', timestamp: '2023-06-08 10:30 AM' },
  //   { name: 'Jane Smith', amount: 100, profileImage: 'jane-smith.jpg', timestamp: '2023-06-07 4:45 PM' },
  //   { name: 'Michael Johnson', amount: 25, profileImage: 'michael-johnson.jpg', timestamp: '2023-06-06 9:15 AM' },
  // ];

  const postComment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const data = {
      memberId,
      userId: authCtx.id,
      content,
    };
    if (!content) {
      setIsProcessing(false);
      handleShowPopup("please say something", "error");
      setTimeout(() => setShowPopup(false), 5000);
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/member/postcomment`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": apiUrl, // replace with your own domain
            Authorization: `Bearer ${authCtx.token}`,
          },
          mode: "cors",
          credentials: "include",
        }
      );
      // handleShowPopup("Comment created successfully", "success");
      // setTimeout(() => window.location.reload(), 5000);
      Swal.fire({
        title: "Success",
        text: "Comment created successfully",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          window.location.reload();
        }
      });

      setTimeout(() => window.location.reload(), 5000);
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        message={message}
        title={type === "success" ? "Successful" : "Failed"}
      />
    );
  }
  // if (isLoading) {
  //   return <Loading />
  // }

  return (
    <div>
      <Navbar
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className="flex flex-col bg-gray-200 md:flex-row mt-5">
        <MembersNav className="md:w-1/4 md:mr-0" />
        <div className="md:mx-0 mx-auto pt-4">
          {isLoading && <Loading isLoggin={isLoading} color={"white"} />}

          <div className="flex flex-column items-center">
            {isProcessing && (
              <Loading isLoggin={isProcessing} color={"white"} />
            )}
            <div className="flex items-center justify-between mb-4 w-100">
              {openDonateModal && (
                <DonateModal
                  handleDonate={handleDonate}
                  isAnonymousDonor={isAnonymousDonor}
                  setIsAnonymousDonor={setIsAnonymousDonor}
                  isRecurring={isRecurring}
                  handleFrequencyChange={handleFrequencyChange}
                  selectedFrequency={selectedFrequency}
                  handleToggle={handleToggle}
                  handleAmountSelection={handleAmountSelection}
                  selectedAmount={selectedAmount}
                  setSelectedAmount={setSelectedAmount}
                  email={email}
                  setEmail={setEmail}
                  setOpenDonateModal={setOpenDonateModal}
                />
              )}
              {openWithdrawModal && (
                <WithdrawModal
                  memberId={memberData?.data?._id}
                  setOpenWithdrawModal={setOpenWithdrawModal}
                />
              )}

              {/* <Link to='/members'>Back</Link> */}
            </div>

            <div className="md:flex md:justify-between">
              <div className="bg-white ml-4 mr-4 rounded-xl shadow-md md:w-1/3 md:mr-4 mb-4 ">
                <div className="min-w-full md:min-w-4/12">
                  <h2 className="main-bg text-white text-center p-3 rounded-t-xl mb-4 w-full">
                    Recent Donors
                  </h2>
                  <ul className="donators-list px-4 md:max-h-64 md:overflow-y-auto overflow-y-scroll h-44">
                    {AllDonation?.length === 0 ? (
                      <li className="flex items-center justify-between py-2">
                        No donor yet
                      </li>
                    ) : (
                      AllDonation?.map((donor, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center">
                            <img
                              src={
                                donor?.image ||
                                process.env.REACT_APP_USER_DEFAULT_IMAGE
                              }
                              alt={donor?.name}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                            <span style={{ fontSize: 10 }}>{donor?.name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <ul
                              style={{ fontSize: "10px", fontWeight: "bold" }}
                            >
                              ₦{donor?.amount}
                            </ul>
                            <span className="text-gray-500 text-xs">
                              {/* {new Date(donor.createdAt).toLocaleDateString()} */}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                {/* {showPopup && <PopupModal

            />} */}
                {openSettings && (
                  <SettingModal onClose={() => setOpenSettings(false)} />
                )}

                {AllDonation?.length > displayedDonor && (
                  <button className="btn mb-2" onClick={handleLoadMoreDonor}>
                    Load Previous Donations
                  </button>
                )}
              </div>
              <div
                className={` p-4 rounded-xl shadow-md bg-white md:ml-1 mb-4 md:mr-2 mx-3 ${memberData?.data?._user._id !== authCtx.id &&
                  authCtx.userInfo.userType !== "Admin"
                  ? "md:w-2/3"
                  : "md:w-[40em]"
                  }`}
              >
                <h2 className="text-2xl font-bold v-header mb-1">
                  {memberData?.data?.title}
                </h2>
                <h3 className="v-sub">
                  <FontAwesomeIcon icon={faReceipt} /> &nbsp;
                  {memberData?.data?.typeOfFundraising}
                </h3>
                <br />
                <div className="flex flex-col md:flex-row mb-4">
                  <div
                    style={{ width: "100%", height: "100%" }}
                    className="md:mx-auto"
                  >
                    <img
                      style={{ width: "100%", height: "400px" }}
                      src={memberData?.data?.imageOrVideo}
                      alt="Member"
                      className="w-full md:w-full rounded-xl"
                    />
                  </div>

                  {/* <div className="flex flex-col">

    <div>
      <p>Created by: John Doe</p>
      <p>Created at: June 8, 2023, 10:00 AM</p>
    </div>
  </div> */}
                </div>
                <div className="flex justify-between">
                  <div className="w-full md:w-1/2 md:pr-2">
                    <p className="mb-0 v-cb">
                      Created by: {memberData?.data?._user?.name}
                    </p>
                    <p className="mb-0 v-cb">
                      Sponsored by:{" "}
                      {memberData?.data?._user?.sponsor
                        ? memberData?.data?._user?.sponsor
                        : memberData?.data?._user?.name}
                    </p>
                    <p className="mt-1 v-date">Date created - {startDate}</p>
                  </div>

                  <div>
                    <h3 className="v-status">
                      Member Status &nbsp; <br />
                      <br />
                      <span
                        className={`p-1 m-1 sm:pt-10 border rounded-xl ${memberData?.data?.status === "Pending"
                          ? "bg-warning text-white font-bold"
                          : memberData?.data?.status === "Approved"
                            ? "bg-green-400 sm:mt-10 text-white font-bold"
                            : memberData?.data?.status === "Declined"
                              ? "bg-red-600 text-white font-bold"
                              : memberData?.data?.status === "Closed"
                                ? "bg-muted-200"
                                : ""
                          } mt-1 md:mt-0`} // Add margin for mobile view
                      >
                        {memberData?.data?.status}
                      </span>
                    </h3>
                  </div>
                </div>
                <hr className="my-4" />
                <p className="v-desc">{memberData?.data?.description}</p>
                {/* Add more member details as needed */}
                <div className="mt-4">
                  <p>Progress:</p>
                  <div
                    className="bg-gray-200 rounded-lg h-2 mb-4 progress"
                    role="progressbar"
                    aria-label="Basic example"
                    // eslint-disable-next-line jsx-a11y/aria-proptypes
                    // aria-valuenow={`${
                    //   (memberData.amountRaised / memberData.raise) * 100
                    // }`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar bg-purple-400 rounded-lg"
                      style={{
                        width: `${(memberData?.data?.amountGotten /
                          memberData?.data?.raise) *
                          100
                          }%`,
                        // width: `50%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-2 v-progress">
                    <span className="text-black">
                      ₦{memberData?.data?.amountGotten}&nbsp;RAISED
                    </span>
                    <span>Target: ₦{memberData?.data?.raise}</span>
                  </div>
                </div>
              </div>

              {memberData?.data?._user._id !== authCtx.id &&
                authCtx.userInfo.userType !== "Admin" && (
                  <div className="bg-white p-3 rounded-xl shadow-md md:w-1/4 md:mr-4 mb-4 h-full mx-3">
                    <h2 className="text-xl font-bold mb-2">Make Donation</h2>
                    {/* <div className='text-justify'>
              <p>
                Funding a health-related member is an opportunity to make a
                direct impact on improving the well-being of individuals and
                communities.
              </p>
            </div> */}
                    {/* <form onSubmit={handleDonate}>
            <label
              className='block mb-2 font-bold text-gray-700'
              htmlFor='amount'
            >
              Enter Amount
            </label>
            <input
              type='text'
              id='amount'
              className={`w-full px-3 py-2 border ${
                handleAmountSelection ? 'bg-gray-200' : 'border-gray-300'
              } rounded focus:outline-none focus:ring focus:ring-blue-400`}
              name='amount'
              placeholder='₦0'
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
            />
          </form>
          <div className='flex flex-col'>
            <div className='flex flex-wrap mx-auto text-justify'>
              <div className='flex flex-row'>
                <button
                  className={`${
                    selectedAmount === 1000
                      ? 'main-bg text-white'
                      : 'bg-gray-100'
                  } px-2 py-1 rounded m-2 w-[200] sm:w-auto`}
                  onClick={() => handleAmountSelection(1000)}
                >
                  1000
                </button>
                <button
                  className={`${
                    selectedAmount === 2000
                      ? 'main-bg text-white'
                      : 'bg-gray-100'
                  } px-2 py-1 rounded m-2 w-full sm:w-auto`}
                  onClick={() => handleAmountSelection(2000)}
                >

                  2000
                </button>
                <button
                  className={`${
                    selectedAmount === 3000
                      ? 'main-bg text-white'
                      : 'bg-gray-100'
                  } px-2 py-1 rounded m-2 w-full sm:w-auto`}
                  onClick={() => handleAmountSelection(3000)}
                >
                  3000
                </button>
              </div>
            </div>
            <div className='flex flex-wrap mx-auto text-center'>
              <div className='flex flex-row'>
                <button
                  className={`${
                    selectedAmount === 4000
                      ? 'main-bg text-white'
                      : 'bg-gray-100'
                  } px-2 py-1 rounded m-2 w-full sm:w-auto`}
                  onClick={() => handleAmountSelection(4000)}
                >
                  4000
                </button>
                <button
                  className={`${
                    selectedAmount === 5000
                      ? 'main-bg text-white'
                      : 'bg-gray-100'
                  } px-2 py-1 rounded m-2 w-full sm:w-auto`}
                  onClick={() => handleAmountSelection(5000)}
                >
                  5000
                </button>
                <button
                  className={`${
                    selectedAmount === 6000
                      ? 'main-bg text-white'
                      : 'bg-gray-100'
                  } px-2 py-1 rounded m-2 w-full sm:w-auto`}
                  onClick={() => handleAmountSelection(6000)}
                >
                  6000
                </button>
              </div>
            </div>
          </div> */}
                    <div className="mt-2">
                      {/* <h2 className='font-bold text-center'>Re-occurring donation</h2> */}
                      <p className="text-justify p-2">
                        Your generosity fuels our mission, enabling us to make a
                        tangible impact. Whether it's supporting local
                        initiatives, aiding those in need, or driving societal
                        change, your donation is a catalyst for progress.
                      </p>
                      {/* <div className='flex items-center mt-2'>
                  <span className='mr-2 font-bold'>Make Recurring</span>
                  <button
                    className={`relative focus:outline-none w-10 h-4 transition-colors duration-300 ${
                      isRecurring ? 'bg-gray-200' : 'bg-red-500'
                    } rounded-full`}
                    onClick={handleToggle}
                  >
                    <span
                      className={`absolute inset-0 w-4 h-4 transition-transform duration-300 ${
                        isRecurring ? 'translate-x-0' : 'translate-x-6'
                      } bg-white rounded-full shadow-md`}
                    />
                  </button>
                </div> */}
                    </div>

                    <div className="w-full">
                      <button
                        type="button"
                        className={`mt-4 px-6 w-full py-2 text-white main-bg rounded-md focus:outline-none focus:ring focus:ring-blue-400`}
                        onClick={handleDonateModal}
                      >
                        Donate
                      </button>
                      <RWebShare
                        data={{
                          text: memberData?.data?.description,
                          url: window.location.href,
                          title: memberData?.data?.title,
                        }}
                        onClick={() => console.log("shared successfully!")}
                      >
                        <button
                          className={`mt-4 px-6 w-full py-2 btn btn-custom rounded-md focus:outline-none focus:ring focus:ring-blue-400`}
                        >
                          Share
                        </button>
                      </RWebShare>

                      <p className="text-center text-sm mt-1">
                        {AllDonation?.length} people have made committees to this
                        member
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div>
            {memberData?.data?._user._id === authCtx.id && (
              <button
                className="ml-auto text-white main-bg rounded-md focus:outline-none focus:ring focus:ring-blue-400 mt-4 mr-4 mb-4 px-6 w-auto py-2 md:block hidden"
                onClick={() => setOpenWithdrawModal(true)}
              >
                Withdraw
              </button>
            )}
            {memberData?.data?._user._id === authCtx.id && (
              <button
                className="mx-auto text-white main-bg rounded-md focus:outline-none focus:ring focus:ring-blue-400 mb-4 px-6 w-56 py-2 md:hidden block"
                onClick={() => setOpenWithdrawModal(true)}
              >
                Withdraw
              </button>
            )}
          </div>

          <div className="bg-white p-16 md:p-4 rounded-xl shadow-md md:w-1/2 md:ml-4 mb-4 mx-3">
            <div className="mt-3">
              <p className="text-muted">Comments</p>
              <div className="flex flex-column">
                <div className="mb-5 w-100">
                  {comments?.length === 0 && <p className="">No comment</p>}
                  {comments?.slice(0, displayedComments)?.map((comment) => (
                    <div className="border-top my-3 w-100" key={comment.id}>
                      <div className="flex items-center mt-3">
                        <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
                          <img
                            className="w-full h-full object-cover rounded-full md:mt-0"
                            src={
                              comment?.user?.image?.[0] ||
                              process.env.REACT_APP_USER_DEFAULT_IMAGE
                            }
                            alt="user"
                          />
                        </div>
                        <div>
                          <span className="main-text font-bold">
                            {comment?.user?.name}
                          </span>
                          <p>{comment?.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {comments.length > displayedComments && (
                  <button
                    className="bg-gray-200 py-1 px-1"
                    onClick={handleLoadMore}
                  >
                    Load More
                  </button>
                )}

                {!authCtx.token ? (
                  <p className="text-left mt-3">
                    You need to be logged in to comment and view comments.
                  </p>
                ) : !showCommentBox ? (
                  <button
                    className="bg-red-500 font-bold py-2 px-2 text-white w-full mt-3"
                    onClick={() => setShowCommentBox(true)}
                  >
                    Make a comment
                  </button>
                ) : (
                  <form className="" onSubmit={postComment}>
                    <div className="bg-gray-100 rounded-xl mt-2 mb-5 px-2 py-2">
                      <input
                        type="text"
                        onChange={(e) => setContent(e.target.value)}
                        className="w-[95%] bg-gray-100 border-0 outline-none"
                        placeholder="Write a comment..."
                      />
                      <button className="font-bold text-purple-500">
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MemberView;

import React, { useState, useEffect, useContext } from "react";
// import Chart from 'react-apexcharts'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../Members/topNavbar";
import Sidebar from "../Members/Members-nav";
import Loading from "../Modal/Loading";
import PopupModal from "../Modal/PopupModal";
import { AuthContext } from "../../context/AuthContext";
import { checkInternetConnection } from "../../lib/network";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  getAllMembers,
  getAllProjects,
  getAllDonations,
  getSingleUser,
  totalDonationByUser,
} from "../../lib/fetch";
import Skeleton from "react-loading-skeleton";
import constants from "../../lib/config";
const apiUrl = constants.apiUrl

const Dashboard = () => {

  const [profileData, setProfileData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [committeesLen, setDonationsLen] = useState(0);
  const [committees, setDonations] = useState([]);
  const [totalDonation, setTotalDonation] = useState(0);
  const [numMembersDonated, setNumMembersDonated] = useState(0);
  const [pendingMembers, setPendingMembers] = useState(0);
  const [closedMembers, setClosedMembers] = useState(0);
  const [approvedMembers, setApprovedMembers] = useState(0);
  const [userMembers, setUserMembers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth > 1145);

  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [numberMembers, setNumberMembers] = useState(0);

  const [numberOfProjects, setNumberOfProjects] = useState(0);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [activities, setActivities] = useState([]);

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };
  const authCtx = useContext(AuthContext);

  const totalMembers = 253;
  // const ongoingMembers = 25;
  // const pendingMembers = 10;
  // const closedMembers = 15;

  const graphdata = [
    { name: "Jan", sales: 200 },
    { name: "Feb", sales: 400 },
    { name: "Mar", sales: 600 },
    { name: "Apr", sales: 800 },
    { name: "May", sales: 1000 },
    { name: "Jun", sales: 1200 },
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pingNetwork = async () => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setIsLoading(false);
      handleShowPopup("INTERNET DISCONNECTED", "error");
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }
  };

  useEffect(() => {
    pingNetwork();
  }, []);

  const handleCreate = async () => {
    window.location.href = "/create";
  };

  useEffect(() => {
    // ...existing code...

    // Event listener to handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA installation accepted");
        } else {
          console.log("PWA installation dismissed");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getSingleUser(authCtx.token, authCtx.id);
        if (response.success === true) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfileData();
  }, [authCtx.id, authCtx.token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/user/activities`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        const data = await response.json();

        // Filter the activities into separate arrays for members and committees
        const memberActivities = data.data.filter((activity) => {
          return activity?.member && activity.isVerified;
        });
        const donationActivities = data.data.filter(
          (activity) => activity?.donation
        );

        const filteredMembers = memberActivities.filter(
          (camp) => camp !== undefined
        );

        const memberIds = filteredMembers.filter((member) => {
          return member.member[0];
        });

        // Now you have memberActivities and donationActivities arrays, you can use them as needed

        // For example, you can log the titles of all members and the donation amounts

        setActivities(data.data);
        // const activity = data.data.map(act => {
        //   console.log(act, 'activities')
        // })
      } catch (error) {
        console.error("Error fetching Activities data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
          setIsLoading(false);
          handleShowPopup("INTERNET DISCONNECTED", "error");
          setTimeout(() => setShowPopup(false), 3000);
          return;
        }
        const response = await getAllMembers(authCtx.token);

        const data = await response.data;
        const currentUser = data.filter((user) => {
          console.log(user);
          return user?._user?._id === authCtx.id;
        });
        console.log(currentUser);

        const total = currentUser.reduce(
          // (sum, donation) => console.log(sum, donation.amountRaised),
          (sum, donation) => sum + donation.amountGotten,
          0
        );

        setChartData(data);
        setTotalAmount(total);
        console.log(data);

        // setTimeout(() => setIsLoading(false), 3000)
        setIsLoading(false);

        const usersMembers = data.filter((member) => {
          // console.log(member)
          return member._user_id === authCtx.id;
        });
        setUserMembers(currentUser);
        setDonationsLen(currentUser.length.toString());
        // const usersMembers = data.data.filter(member => member._user[0] === userId);

        const pendingMembers = currentUser.filter(
          (member) => member.status === "Pending"
        ).length;
        const closedMembers = currentUser.filter(
          (member) => member.status === "Closed"
        ).length;
        const approvedMembers = currentUser.filter(
          (member) => member.status === "Approved"
        ).length;

        // console.log('Number of pending members:', pendingMembers)
        // console.log('Number of closed members:', closedMembers)
        // console.log('Number of approved members:', approvedMembers)

        // Update the state variables with the counts
        setPendingMembers(pendingMembers);
        setClosedMembers(closedMembers);
        setApprovedMembers(approvedMembers);
      } catch (error) {
        setErrorMessage("Error fetching member data:");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        console.error("Error fetching member data:", error);
        setIsLoading(false);
      }
      setTimeout(() => setIsLoading(false), 3000);
    };

    fetchData();
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  useEffect(() => {
    fetch("${apiUrl}/api/v1/donation/getcommittees", {
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const committees = data.committees;
        const userMemberId = localStorage.getItem("userId");

        // Filter committees by the current user
        const userDonations = committees.filter(
          (donation) => donation?.user?.[0]?._id === authCtx.id
        );

        // Create sets to track unique cases and members
        const uniqueCases = new Set();
        const uniqueMembers = new Set();

        // Iterate over the user committees to count unique cases and members
        userDonations.forEach((donation) => {
          if (donation?.case?.length > 0) {
            donation.case.forEach((caseItem) => {
              uniqueCases.add(caseItem);
            });
          }
          if (donation?.member?.length > 0) {
            donation.member.forEach((memberItem) => {
              uniqueMembers.add(memberItem);
            });
          }
        });

        // Update the state with the count of unique cases and members
        setNumberOfProjects(uniqueCases.size);
        setNumberMembers(uniqueMembers.size);

        // Calculate the total donation amount
        const total = userDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0
        );

        // Set the state with the total donation amount
        // setTotalDonation(total)
      })
      .catch((error) => {
        console.error("Error retrieving committees:", error.response);
      });
  }, [authCtx.id, authCtx.token]);

  useEffect(() => {
    const fetchTotalDonation = async () => {
      try {
        const response = await totalDonationByUser(authCtx.token, authCtx.id);
        if (response.success === true) {
          const data = await response;
          setTotalDonation(data);
        }
      } catch (error) {
        console.error("Error:", error.response);
      }
    };

    fetchTotalDonation();
  }, [authCtx.id, authCtx.token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllDonations(authCtx.token);

        const data = await response;

        const userDonations = data.committees.filter(
          (donation) => donation.user === authCtx.id
        );
        const uniqueMembers = new Set(
          userDonations.map((donation) => donation.member)
        );
        const numMembersDonated = uniqueMembers.size;

        // console.log('Number of members donated:', numMembersDonated)
        setNumMembersDonated(numMembersDonated);
      } catch (error) {
        console.error("Error fetching donation data:", error);
      }
    };

    fetchData();
  }, [authCtx.id, authCtx.token]);

  useEffect(() => {
    const fetchCauseData = async () => {
      // setIsLoading(true)
      try {
        const response = await getAllProjects(authCtx.token);
        // setNumberOfProjects(response.len)
        // console.log(response, 'casess')
      } catch (error) {
        console.log(error.response);
        handleShowPopup("Error Getting Data Please Try again", "error");
        setTimeout(() => setShowPopup(false), 5000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCauseData();
  }, [authCtx.token]);

  if (isLoading) {
    return (
      <div className="">
        <Navbar
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
        />
        <div
          style={{ height: "100vh" }}
          className="flex flex-col whole-bg md:flex-row mt-5"
        >
          <Sidebar className="" />
          <div className="flex-grow ml-10 md:ml-0 mt-5 md:mt-1 pr-10">
            <div className="flex justify-between items-center">
              {/* <h2 className="font-bold">Dashboard</h2> */}

              {authCtx.userInfo.userType === "Sponsor" && (
                <button
                  className={` px-6 w-45 py-2 text-white main-bg rounded-full focus:outline-none focus:ring focus:ring-blue-400 mr-4`}
                  onClick={handleCreate}
                >
                  Start a Member +
                </button>
              )}
            </div>
            <br />
            {/* <div className='relative'>
              <FontAwesomeIcon
                icon={faChartLine}
                className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
              />
            </div> */}
            {/* <br /> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white card rounded-lg">
                <div className="camp-header p-4 pb-0">
                  <Skeleton duration={1} height={18} width={150} />
                </div>
                <div className="camp font-bold align-left camp pl-6">
                  <Skeleton duration={1} height={20} width={80} />
                </div>
                <div className="flex justify-between mt-15 p-4">
                  <div className="">
                    <div className="camp-header">
                      <Skeleton duration={1} height={18} width={80} />
                    </div>
                    <Skeleton duration={1} height={20} width={40} />
                  </div>
                  <div>
                    <div className="camp-header">
                      {" "}
                      <Skeleton duration={1} height={18} width={80} />
                    </div>
                    <div className="font-bold">
                      <Skeleton duration={1} height={20} width={40} />
                    </div>
                  </div>
                  <div>
                    <div className="camp-header">
                      {" "}
                      <Skeleton duration={1} height={18} width={80} />
                    </div>
                    <div className="font-bold">
                      <Skeleton duration={1} height={20} width={40} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white card rounded-lg">
                <div className="camp-header p-4 pb-0">
                  <Skeleton duration={1} height={18} width={150} />
                </div>
                <div className="camp font-bold align-left camp pl-6">
                  <Skeleton duration={1} height={20} width={80} />
                </div>
                {authCtx.userInfo.userType === "Sponsor" && (
                  <div className="flex justify-between mt-15 p-4">
                    <div className="">
                      <div className="camp-header">
                        <Skeleton duration={1} height={18} width={80} />
                      </div>
                      <Skeleton duration={1} height={20} width={40} />
                    </div>
                    <div>
                      <div className="camp-header">
                        {" "}
                        <Skeleton duration={1} height={18} width={80} />
                      </div>
                      <div className="font-bold">
                        <Skeleton duration={1} height={20} width={40} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {authCtx.userInfo.userType === "Individual" && (
                  <div className="bg-white card rounded-lg">
                    <div className="p-2">
                      <p className="font-bold">
                        <Skeleton duration={1} height={24} width={150} />
                      </p>
                      <p className="text-red-500 font-bold">
                        <Skeleton duration={1} height={40} width={80} />
                      </p>
                    </div>
                    <div className="cards flex justify-center">
                      <BarChart width={280} height={140} data={graphdata}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#9968D1" />
                      </BarChart>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg mt-4">
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Member</th>
                        <th className="px-4 py-2">Portfolio</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-4 py-2">
                          {" "}
                          <Skeleton height={30} count={5} />
                        </td>
                        <td className="border px-4 py-2">
                          <Skeleton height={30} count={5} />
                        </td>
                        <td className="border px-4 py-2">
                          <Skeleton height={30} count={5} />
                        </td>
                        <td className="border px-4 py-2">
                          <Skeleton height={30} count={5} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* {showInstallButton && (
        <div className="install-button">
          <button onClick={handleInstallClick}>Install App</button>
        </div>
      )} */}
      <div>
        <Navbar
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
        />
        <div className="flex whole-bg flex-col md:flex-row mt-5">
          <Sidebar className="md:w-1/4 md:mr-0" />
          <div className="flex-grow ml-10 md:ml-0 mt-5 md:mt-1 pr-10">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="font-bold">Dashboard</h2> */}

              {authCtx.userInfo.userType === "Sponsor" && (
                <button
                  className={` px-6 w-45 py-2 text-white main-bg rounded-full focus:outline-none focus:ring focus:ring-blue-400 mr-4`}
                  onClick={handleCreate}
                >
                  Create a Member +
                </button>
              )}
            </div>
            <br />
            {/* <div className='relative'>
              <select className='pl-8 text-gray-500 pr-4 py-2 bg-white rounded-md focus:outline-none'>
                <option>This month</option>
                <option>January</option>
                <option>February</option>
              </select>
              <FontAwesomeIcon
                icon={faChartLine}
                className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
              />
            </div>
            <br /> */}


            <div className="bg-white rounded-lg mt-4">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <p>Recent Events</p>
                  <button className="text-purple-500">Members</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Event</th>
                        <th className="px-4 py-2">Attendance</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!userMembers && <div>No recent activities </div>}
                      {userMembers.map((member) => (
                        <tr key={member._id}>
                          <td className="border px-4 py-2">
                            {"Approved Member"}
                          </td>
                          <td className="border px-4 py-2">{member.title}</td>
                          <td className="border px-4 py-2">
                            {member.status}
                          </td>
                          <td className="border px-4 py-2">
                            {member.amountGotten}
                          </td>
                          <td className="border px-4 py-2">{member.raise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

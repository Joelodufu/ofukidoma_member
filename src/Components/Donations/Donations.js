import React, { useContext, useRef, useState, useEffect } from "react";
import { range } from "lodash";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton from "react-loading-skeleton";
import Navbar from "../Members/topNavbar";
import MembersNav from "../Members/Members-nav";
import Loading from "../Modal/Loading";
import { AuthContext } from "../../context/AuthContext";
import { getAllDonations, getSingleMember } from "../../lib/fetch";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import constants from "../../lib/config";
const apiUrl = constants.apiUrl

export default function Donations() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/member/getmembers`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMembers(data.data);
          const memberIds = data.data.map((member) => member._id);
          setMemberId(memberIds);
        } else {
          console.error("Failed to fetch donation amount");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAllMembers();
  }, [authCtx.token]);

  const [TotalDonation, setTotalDonation] = useState("");
  const [DonationAmount, setDonationAmount] = useState("");
  const [committees, setDonations] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [memberId, setMemberId] = useState("");
  // const memberCacheRef = useRef({})
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Initially set to 5
  const [selectedInterval, setSelectedInterval] = useState("all");

  useEffect(() => {
    const fetchTotalDonation = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(
          `${apiUrl}/api/v1/donation/total/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTotalDonation(data);
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTotalDonation();
  }, [authCtx.token]);

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await getAllDonations(authCtx.token);
        if (response.success === true) {
          const committees = response.committees;
          const userDonations = committees.filter(
            (donation) =>
              console.log(donation?.member[0]?.includes(memberId))
            // donation?.user?.[0]?._id !== authCtx.userInfo._id && donation.amount && donation.isVerified
          );
          const newUser = await Promise.all(
            committees.map(async (donation) => {
              const associatedMember = donation.member.find(
                (member) =>
                  memberId.includes(member) && donation.isVerified
              );

              if (associatedMember) {
                // Fetch the member data for each donation's associated member
                const memberData = await getSingleMember(
                  authCtx.token,
                  associatedMember
                );
                // Check if the user ID in memberData matches the current user ID
                if (memberData?.data?._user?._id === authCtx.userInfo._id) {
                  return { donation, memberData };
                }
              }
              return null;
            })
          );

          const filteredNewUser = newUser.filter((item) => item !== null);

          const totalDonationGiven = filteredNewUser.reduce(
            (sum, { donation }) => sum + donation.amount,
            0
          );
          // setTotalAmount(total)
          const filteredDonations = committees.filter((donation) =>
            donation.member.some(
              (member) =>
                // console.log(donation?.user[0])
                // donation?.user[0]?._id === authCtx.userInfo._id &&
                memberId.includes(member) && donation.isVerified
            )
          );
          setDonations(filteredDonations);
          setTotalAmount(totalDonationGiven);
        }
      } catch (error) {
        console.error("Failed to fetch Members", error);
      }
    };
    fetchAllDonations();
  }, [authCtx.token, authCtx.userInfo._id, memberId]);

  useEffect(() => {
    const fetchAllDonationsWithInterval = async (interval) => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/donation/committees?interval=${interval}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDonations(data.committees); // Update the committees state with the fetched data
          setIsLoading(false);
          console.log(data);
        } else {
          console.error("Failed to fetch donation data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // fetchAllDonationsWithInterval(selectedInterval)
  }, [authCtx.token, authCtx.userInfo._id, memberId, selectedInterval]);

  const [isPaginating, setIsPaginating] = useState(false);

  // Function to handle paginating to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setIsPaginating(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Function to handle paginating to the previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setIsPaginating(true);
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    const generateHistoryEntries = async () => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const entries = [];

      try {
        if (Array.isArray(committees)) {
          for (const donate of committees
            .slice()
            .reverse()
            .slice(startIndex, endIndex)) {
            const donationId = donate?.member?.[0] || null;

            if (donationId === null || donationId === undefined) {
              continue;
            }

            let memberData = memberCacheRef.current[donationId];

            if (!memberData) {
              const response = await getSingleMember(
                authCtx.token,
                donationId
              );
              memberData = response.data;
              memberCacheRef.current[donationId] = memberData;
            }

            entries.push({
              id: donate._id,
              memberName: memberData.title,
              donors: donate.user[0]?.name,
              date: new Date().toLocaleDateString(),
              raised: memberData.amountGotten,
              goal: memberData.raise,
              amount: donate.amount,
            });
          }
        }

        return entries;
      } catch (error) {
        console.error("Error generating history entries:", error);
        setIsPaginating(false);
        throw error;
      } finally {
        setIsPaginating(false);
      }
    };
    const fetchHistoryEntries = async () => {
      try {
        const entries = await generateHistoryEntries();
        setHistoryEntries(entries);
      } catch (error) {
        console.error("Error fetching history entries:", error);
      } finally {
        setIsLoading(false);
        setIsPaginating(false);
      }
    };

    fetchHistoryEntries();
  }, [currentPage, committees, pageSize, authCtx.token]);

  // useEffect(() => {
  //   // Fetch committees with the selected interval initially
  //   fetchAllDonationsWithInterval(selectedInterval)
  // }, [authCtx.token, selectedInterval])

  // Handle interval change
  const handleIntervalChange = (event) => {
    const interval = event.target.value;
    setSelectedInterval(interval);
  };

  const [historyEntries, setHistoryEntries] = useState([]);
  const [filterEntries, setFilterEntries] = useState([]);
  const memberCacheRef = useRef({});
  const totalPages = Math.ceil(committees.length / pageSize);

  //CODE FOR THE FILTER IN DONATIONS PAGE
  useEffect(() => {
    let filteredDonations = historyEntries;
    let month = new Date().getMonth();
    let days = new Date().getDate();
    // let week = new Date().get()

    if (selectedInterval === "all") {
      setFilterEntries(historyEntries);
    } else if (selectedInterval === "daily") {
      filteredDonations = filteredDonations?.filter((item) => {
        const date = item.date;
        const dateParts = date.split("/");
        return dateParts.includes(`${days}`);
      });

      setFilterEntries(filteredDonations);
    } else if (selectedInterval === "weekly") {
      // Put days into an array. If it is greater than seven, loop through it to create the previous days of the week.
      const daysArray = [days];
      const generateWeekdays = () => {
        if (days > 7) {
          for (let i = 1; i < 7; i++) {
            // Subtract 1 from the last number in the array and push it to the array
            const lastNumber = daysArray[daysArray.length - 1];
            daysArray.push(lastNumber - 1);
          }
          return daysArray;
        } else {
          //create an array with month days numbers
          //Check month number
          //add one and fetch the number with the month index [month]
          //create the for loop and subtract one
          //Put an if statement that if it gets to zero, push the number of month and subtract until loop is completed

          const nubOfDaysInMonth = [
            31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
          ];
          const realMonthNumb = month + 1;
          const monthdaysNumber = nubOfDaysInMonth[realMonthNumb];
          for (let i = 1; i < 7; i++) {
            const lastNumber = daysArray[daysArray.length - 1];
            daysArray.push(lastNumber - 1);
            if (lastNumber === 0) {
              daysArray.push(monthdaysNumber);
            }
          }
        }
      };
      generateWeekdays();

      // Turn all the numbers in the array into strings
      const newStringArray = [];
      const convertNumbToString = () => {
        for (let index = 0; index < daysArray.length; index++) {
          const numbToString = daysArray[index].toString();
          newStringArray.push(numbToString);
        }
        return newStringArray;
      };
      convertNumbToString();

      //Check if the date contains any previous day of the week and return.
      const checkForWeekday = () => {
        const newFilteredDonations = [];

        filteredDonations.forEach((donation) => {
          const date = donation.date;
          const dateParts = date.split("/");
          const firstPart = dateParts[0];

          if (newStringArray.includes(firstPart)) {
            newFilteredDonations.push(donation);
          }
        });
        setFilterEntries(newFilteredDonations);
        return newFilteredDonations;
      };
      checkForWeekday();
    } else if (selectedInterval === "monthly") {
      filteredDonations = filteredDonations?.filter((item) => {
        const date = item.date;
        const dateParts = date.split("/");
        const monthPart = dateParts[1];
        const realMonthNumber = month + 1;
        if (realMonthNumber < 10) {
          const monthToString = `0${realMonthNumber}`;
          return monthPart.includes(`${monthToString}`);
        } else {
          const monthToString = realMonthNumber.toString();
          console.log(monthPart, monthToString);
          return monthPart.includes(`${monthToString}`);
        }
      });
    }
  }, [selectedInterval]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className="flex flex-col bg-gray-200 md:flex-row mt-5">
        <MembersNav className="md:w-1/4 md:mr-0" />
        <div className="flex-grow">
          <div className="md:pt-5 pr-5 pl-5 md:mb-5">
            <div className="flex justify-between items-center">
              {/* <h1 className='text-2xl font-bold'>Donations</h1> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {/* <div className='bg-white rounded p-4'>
                <h2 className='d-amount'>
                  {' '}
                  N{totalAmount ? totalAmount.toLocaleString() : 0}
                </h2>
                <p className='d-head text-purple-500'>Current Balance</p>
              </div> */}
              {/* 
              {authCtx.userInfo.userType === "Sponsor" && (
                <div className="bg-white rounded p-4">
                  <h2 className="d-amount">
                    N{totalAmount ? totalAmount.toLocaleString() : 0}
                  </h2>
                  <p className="d-head text-green-500">
                    Total Donation Received
                  </p>
                </div>
              )} */}

              {/* <div className="bg-white rounded p-4">
                <h2 className="d-amount">
                  N
                  {TotalDonation
                    ? TotalDonation.totalDonations?.toLocaleString()
                    : 0}
                </h2>
                <p className="d-head text-red-500">Total Donation Given</p>
              </div> */}
            </div>

            {/* <div className="mt-4">
              <div className="relative">
                <div className="pl-8 text-gray-500 w-20 pr-4 py-2 border bg-white rounded-md focus:outline-none">
                  <p>Data</p>
                </div>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div> */}

            <div className="bg-white p-4 mt-4">
              <div className="text-xl font-bold mb-4">Our Committee</div>

              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4">Committee</th>
                      <th className="py-2 px-4">Members</th>
                      <th className="py-2 px-4">Chairman</th>
                      <th className="py-2 px-4">Secretary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyEntries
                      ?.filter((donor) => donor.donors == authCtx.userInfo.name)
                      .map((entry) => {
                        // Check if donors is an array and not empty
                        if (entry?.donors?.length > 0) {
                          return (
                            <tr key={entry.id} className="border-b">
                              <td className="py-2 px-4">{entry.donors}</td>
                              <td className="py-2 px-4">
                                {entry.memberName}
                              </td>
                              <td className="py-2 px-4">{entry.amount}</td>
                              <td className="py-2 px-4">{entry.date}</td>
                              <td className="py-2 px-4">{entry.raised}</td>
                            </tr>
                          );
                        } else {
                          // Donors is an empty array or null, so skip rendering this row
                          return null;
                        }
                      })}
                    {!filterEntries ||
                      (filterEntries?.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-2">
                            No Data available
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center mt-4">
                <div className="text-gray-600 text-sm mb-2">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`${currentPage === 1 ? "bg-gray-300" : "main-bg"
                      } w-10 h-10 flex items-center justify-center rounded focus:outline-none mb-2`}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  {range(1, Math.min(totalPages, 4)).map((page) => (
                    <button
                      key={page}
                      className={`${currentPage === page
                        ? "main-bg text-white"
                        : "bg-gray-200 text-gray-700"
                        } w-10 h-10 flex items-center justify-center rounded focus:outline-none mb-2`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {totalPages > 4 && (
                    <button
                      className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded focus:outline-none cursor-default mb-2"
                      disabled
                    >
                      ...
                    </button>
                  )}

                  <button
                    className={`${currentPage === totalPages ? "bg-gray-300" : "main-bg"
                      } w-10 h-10 flex items-center justify-center rounded focus:outline-none mb-2`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

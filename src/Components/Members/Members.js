import React, { useState, useEffect, useContext } from "react";
import MembersNav from "./Members-nav";
import "./members.css";
import Navbar from "./topNavbar";
import MemberTop from "./membersTop";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Modal/Loading";
import { checkInternetConnection } from "../../lib/network";
import { AuthContext } from "../../context/AuthContext";
import PopupModal from "../Modal/PopupModal";
import { getMembers, getMemberByStatus } from "../../lib/fetch";
import Skeleton from "react-loading-skeleton";
const MemberPage = () => {
  const currentPageName = "Members";
  const [TotalMembers, setTotalMembers] = useState(0);
  const [memberId, setMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");
  const [dataName, setDataName] = useState("All Members");
  const [condition, setCondition] = useState("");

  const authCtx = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(9);
  const [remainingDays, setRemainingDays] = useState(0);
  const [remainingDaysList, setRemainingDaysList] = useState([]);
  const [memberData, setMemberData] = useState([]);

  function truncateText(text, maxLength) {
    const words = text.split(" ");
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(" ") + "...";
    } else {
      return text;
    }
  }



  const handleConditionInput = (data) => {
    setIsLoading(true);
    setCondition(data);
  };

  let navigate = useNavigate();

  const handleCreate = async () => {
    navigate("/create");
  };
  const handleFilterChange = (filteredData) => {
    setFilteredMembers(filteredData);
  };
  const [filteredMembers, setFilteredMembers] = useState(memberData);


  const handleType = (option) => {
    setDataName(option);
    console.log(option);
  };


  if (showPopup) {
    return (
      <PopupModal
        status={type}
        title={type === "success" ? "Success" : "Error"}
        message={type === "error" ? message : message}
        onClick={() => setShowPopup(false)}
      />
    );
  }
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );





  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div>
        <Navbar
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
        />
        <div
          style={{ height: filteredMembers.length >= 1 ? "" : "100vh" }}
          className="flex flex-col bg-gray-200 md:flex-row mt-5"
        >
          <MembersNav className="md:w-1/4 md:mr-0" />
          <div className="flex-1 pr-5 mx-auto px-2 py-4">
            <div className="flex justify-between items-center md:mb-4">
              {/* <h2 className='font-bold'>Members</h2> */}
              {authCtx.userInfo.userType === "Sponsor" && (
                <button
                  className={` px-6 w-45 py-2 text-white main-bg rounded-full focus:outline-none focus:ring focus:ring-blue-400 mr-4`}
                  onClick={handleCreate}
                >
                  Start a Member +
                </button>
              )}
            </div>
            {/* <MemberTop
              members={memberData}
              onFilterChange={handleFilterChange}
              onHandle={handleType}
              condition={condition}
              onHandleCondition={handleConditionInput}
              className="fixed top-0 w-full z-10"
            /> */}
            <br />
            <div className="bg-white p-4 md:mr-1">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Role</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMembers.length > 0 ? (
                    currentMembers.map((member) => (
                      <tr key={member._id}>
                        <td>{member.title}</td>
                        <td>{member.sponsor}</td>
                        <td>{member.phone}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No members available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredMembers.length > membersPerPage && (
              <div className="flex bg-gray-200 justify-end mt-4 mr-5 items-center">
                {/* Previous Button */}
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  Prev
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-2">
                  {Array.from({
                    length: Math.ceil(
                      filteredMembers.length / membersPerPage
                    ),
                  }).map((_, index) => (
                    <button
                      key={index}
                      className={`page-link ${index + 1 === currentPage
                        ? "main-bg text-white"
                        : "bg-gray-200 text-gray-700"
                        } w-10 h-10 focus:outline-none`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  className="pagination-btn ml-2"
                  disabled={
                    currentPage ===
                    Math.ceil(filteredMembers.length / membersPerPage)
                  }
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default MemberPage;

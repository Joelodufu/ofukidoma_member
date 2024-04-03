import React, { useCallback, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList12 } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";

const MemberTop = ({
  members,
  onFilterChange,
  condition,
  onHandleCondition,
}) => {
  const [selectedOption, setSelectedOption] = useState("All Members");
  const authCtx = useContext(AuthContext);
  const [isMobileView, setIsMobileView] = useState(false);

  const allConditions = [
    "Cancer",
    "Diabetes",
    "Surgery",
    "Organ Transplant",
    "Injury",
    'Others'
  ];
  const options = [
    "All Members",
    "My Members",
    "Submissions",
    "Closed",
    "Ongoing",
    "Draft",
  ];

  // Check if userType is 'individual' and filter out 'My Members' if true
  const filteredOptions =
    authCtx.userInfo.userType === "Individual"
      ? options.filter((option) => option !== "My Members")
      : options;

  const navbarWidthClass =
    authCtx.userInfo.userType === "Individual" ? "w-[575px]" : "w-[730px]";
  // console.log(filteredOptions)
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    filterAndChange(option, condition);
  };

  const handleConditionChange = (newCondition) => {
    onHandleCondition(newCondition);
    filterAndChange(selectedOption, newCondition);
  };

  const filterAndChange = useCallback(
    (option, newCondition) => {
      let filteredMembers = members;

      switch (option) {
        case "All Members":
          filteredMembers = members.filter(
            (member) => member.status === "Approved"
          );
          break;
        case "My Members":
          filteredMembers = members.filter(
            (member) => member._user?._id === authCtx.id
          );
          break;
        case "Submissions":
          filteredMembers = members.filter(
            (member) =>
              member._user?._id === authCtx.id &&
              member.status === "Pending"
          );
          break;
        case "Closed":
          filteredMembers = members.filter(
            (member) =>
              member._user?._id === authCtx.id && member.status === "Closed"
          );
          break;
        case "Ongoing":
          filteredMembers = members.filter(
            (member) =>
              member._user?._id === authCtx.id &&
              member.status === "Approved"
          );
          break;
        case "Draft":
          filteredMembers = members.filter(
            (member) =>
              member._user?._id === authCtx.id && member.status === "Draft"
          );
          break;
        default:
          break;
      }

      if (newCondition) {
        filteredMembers = filteredMembers.filter(
          (member) => member.typeOfFundraising === newCondition
        );
      }

      onFilterChange(filteredMembers);
    },
    [authCtx.id, members, onFilterChange]
  );

  useEffect(() => {
    filterAndChange(selectedOption);
  }, [filterAndChange, selectedOption]);

  const handleResize = () => {
    setIsMobileView(window.innerWidth < 768); // Change the threshold as needed
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex hidden md:flex flex-wrap">
        {/* Main navigation */}
        <nav className={`bg-white h-full rounded-lg md:${navbarWidthClass}`}>
          <div className="mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-12">
              <div className="flex flex-wrap items-center">
                {isMobileView ? (
                  <select
                    value={selectedOption}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    className="w-full hover:bg-purple-400 px-3 py-2 text-sm font-medium"
                  >
                    {filteredOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  filteredOptions.map((option, index) => (
                    <button
                      key={option}
                      className={`tab-button ${selectedOption === option ? "top-bk" : ""
                        } p-1 border-r ${index === 0 ? "rounded-l-md" : ""} ${index === filteredOptions.length - 1
                          ? "rounded-r-md"
                          : ""
                        }`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <FontAwesomeIcon icon={faList12} /> &nbsp; {option}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Condition dropdown */}
        <div className="ml-auto p-2">
          <select
            onChange={(e) => handleConditionChange(e.target.value)}
            value={condition}
            className="w-full hover:bg-purple-400 rounded-lg px-4 py-2 text-sm font-medium"
          >
            <option value="">All Conditions</option>
            {allConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* mobile view */}

      <div className="flex bg-white md:hidden items-center justify-between">
        {/* Main navigation */}
        <nav className={`h-full rounded-lg md:${navbarWidthClass}`}>
          <div className="mx-auto px-4 sm:px-6">
            <div className="flex items-center">
              {isMobileView ? (
                <select
                  value={selectedOption}
                  onChange={(e) => handleOptionSelect(e.target.value)}
                  className="w-full hover:bg-purple-400 px-3 py-2 text-sm font-medium"
                >
                  {filteredOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option}
                    className={`tab-button ${selectedOption === option ? "top-bk" : ""
                      } p-1 border-r ${index === 0 ? "rounded-l-md" : ""} ${index === filteredOptions.length - 1 ? "rounded-r-md" : ""
                      }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <FontAwesomeIcon icon={faList12} /> &nbsp; {option}
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>

        {/* Condition dropdown */}
        <div className="ml-auto p-2">
          <select
            onChange={(e) => handleConditionChange(e.target.value)}
            value={condition}
            className="w-full hover:bg-purple-400 rounded-lg px-4 py-2 text-sm font-medium"
          >
            <option value="">All Conditions</option>
            {allConditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default MemberTop;

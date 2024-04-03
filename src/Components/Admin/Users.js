import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrashCan,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../Members/topNavbar";
import Sidebar from "../Members/Members-nav";
import SideNav from "./Sidenav";
import { AuthContext } from "../../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import { getAllUser } from "../../lib/fetch";
import { sponsorSignup, signup } from "../../lib/fetch";
import Loading from "../Modal/Loading";
import { checkInternetConnection } from "../../lib/network";
import PopupModal from "../Modal/PopupModal";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Type, setType] = useState("sponsors");
  const [showModal, setShowModal] = useState(false);
  const authCtx = useContext(AuthContext);
  const [createSponsorModalOpen, setCreateSponsorModalOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser(authCtx.token);
        if (response.success === true) {
          setUsers(response.data); // Assuming the user data is in the 'data' property
          console.log(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [authCtx.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSponsorForm({
      ...sponsorForm,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!sponsorForm.name || !sponsorForm.email || !sponsorForm.password) {
      setIsProcessing(false);
      handleShowPopup("Please fill in all the required fields", "error");
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setIsProcessing(false);
        handleShowPopup("INTERNET DISCONNECTED", "error");
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }

      const response = await sponsorSignup(sponsorForm);
      console.log(response);

      if (response.success === true) {
        setIsProcessing(false);
        authCtx.authenticate(response.token);
        handleShowPopup("Account Created Successfully", "success");
        setTimeout(() => setShowPopup(false), 5000);
        setTimeout(() => {
          setIsFormSubmitted(true); // Trigger the form submission status update
          window.location.href = "/users"; // Redirect if needed (optional)
        }, 5000);
        return;
      }
    } catch (error) {
      console.error("Error:", error.response);
      handleShowPopup(error.response.data.message, "error");
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // If the form is successfully submitted, close the modal and reset the form
    if (isFormSubmitted) {
      setCreateSponsorModalOpen(false);
      setSponsorForm({
        name: "",
        email: "",
        password: "",
      });
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted]);

  // Calculate pagination indexes
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle modal and user selection
  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  // Handle user actions
  const handleDeleteUser = async (user) => {
    // Perform deactivate user action
    try {
      const response = await fetch(
        `https://fundezer-api.onrender.com/api/v1/user/deleteprofile/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "Account deleted successfully",
          icon: "info",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.reload();
          }
        });
        console.log(`User deleted: ${user.name}`);
        // Perform any additional actions if needed
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }

    closeModal();
  };

  // Handle opening the modal for creating a sponsor account
  const handleOpenCreateSponsorModal = () => {
    setCreateSponsorModalOpen(true);
  };

  if (isProcessing) {
    return <Loading isLoggin={isProcessing} color={"white"} />;
  }

  return (
    <div>
      <Navbar
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className="flex flex-col whole-bg md:flex-row mt-5">
        <SideNav className="" />
        <div className="bg-white rounded-lg mt-5 md:mr-5 mb-5">
          <div className="p-4">
            <div className="">
              <div className="bg-white">
                <div className="text-xl font-bold mb-4 flex items-center">
                  Users
                  <div
                    className="flex ml-auto text-sm md:ml-4 main-bg text-white px-4 py-2 rounded cursor-pointer justify-end"
                    onClick={handleOpenCreateSponsorModal}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Sponsors
                  </div>
                </div>
                <div className="overflow-x-auto mr-10">
                  <div className="table-wrapper">
                    <table className="min-w-full border">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4">User Id</th>
                          <th className="py-2 px-4">Username</th>
                          <th className="py-2 px-4">Email</th>
                          <th className="py-2 px-4">Role</th>
                          <th className="py-2 px-4">Date</th>
                          <th className="py-2 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          // Display skeleton loading
                          Array.from({ length: usersPerPage }).map(
                            (_, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-4">
                                  <Skeleton width={100} />
                                </td>
                                <td className="py-2 px-4">
                                  <Skeleton width={100} />
                                </td>
                                <td className="py-2 px-4">
                                  <Skeleton width={200} />
                                </td>
                                <td className="py-2 px-4">
                                  <Skeleton width={100} />
                                </td>
                                <td className="py-2 px-4">
                                  <Skeleton width={100} />
                                </td>
                                <td className="py-2 px-4">
                                  <Skeleton width={20} />
                                </td>
                              </tr>
                            )
                          )
                        ) : currentUsers.length > 0 ? (
                          currentUsers.map((user) => (
                            <tr key={user._id} className="border-b">
                              <td className="py-2 px-4">{user._id}</td>
                              <td className="py-2 px-4">{user.name}</td>
                              <td className="py-2 px-4">{user.email}</td>
                              <td className="py-2 px-4">{user.userType}</td>
                              <td className="py-2 px-4">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-[-10px]">
                                <div className="dropdown-container">
                                  <div
                                    className="menu-icon"
                                    onClick={() => openModal(user)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faEllipsisVertical}
                                      className=""
                                    />
                                  </div>
                                  {showModal &&
                                    selectedUser?._id === user._id && (
                                      <div className="dropdown-content">
                                        <button
                                          onClick={() => handleDeleteUser(user)}
                                          className="hover:bg-gray-600 w-[100px]"
                                        >
                                          {" "}
                                          <FontAwesomeIcon
                                            icon={faTrashCan}
                                            className=""
                                          />{" "}
                                          &nbsp; Delete
                                        </button>
                                        <button>Deactivate</button>
                                      </div>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">Couldn't get users...</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex bg-gray-200 justify-end mt-4">
                  <Pagination
                    currentPage={currentPage}
                    usersPerPage={usersPerPage}
                    totalUsers={users.length}
                    paginate={paginate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {createSponsorModalOpen && (
        <CreateSponsorModal
          closeModal={() => setCreateSponsorModalOpen(false)}
          sponsorForm={sponsorForm}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
        />
      )}
      {/* PopupModal component code if needed */}
    </div>
  );
}

// Pagination component
const Pagination = ({ currentPage, usersPerPage, totalUsers, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              href="#!"
              onClick={() => paginate(number)}
              className={`page-link ${currentPage === number
                ? "main-bg text-white"
                : "bg-gray-200 text-gray-700"
                } w-8 h-8 mx-1 focus:outline-none`}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// CreateSponsorModal component
const CreateSponsorModal = ({
  closeModal,
  sponsorForm,
  handleInputChange,
  handleFormSubmit,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl main-bg p-4 text-white bt-2 rounded-t-lg font-bold mb-4">
          Create Sponsor Account
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="name">Sponsor Name</label>
            <input
              type="text"
              id="name"
              name="name" // Add the 'name' attribute
              placeholder="Enter Sponsor Name"
              className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
              value={sponsorForm.name}
              onChange={handleInputChange} // Bind the handleInputChange function
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email">Sponsor Email</label>
            <input
              type="email"
              id="email"
              name="email" // Add the 'name' attribute
              placeholder="Enter Sponsor Email"
              className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
              value={sponsorForm.email}
              onChange={handleInputChange} // Bind the handleInputChange function
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              name="password" // Add the 'name' attribute
              placeholder="Enter Password"
              className="w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none"
              value={sponsorForm.password}
              onChange={handleInputChange} // Bind the handleInputChange function
              required
            />
          </div>
          <button
            type="submit"
            className="mr-2 main-bg rounded p-2 font-bold text-white"
          >
            Create Sponsor
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

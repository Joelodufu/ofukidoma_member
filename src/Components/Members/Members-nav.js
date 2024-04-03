import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Loading from "../Modal/Loading";
import { AuthContext } from "../../context/AuthContext";
import { ReactComponent as Notification } from "../Assets/notification-status.svg";
import { ReactComponent as Health } from "../Assets/health.svg";
import { ReactComponent as Security } from "../Assets/security-user.svg";
import { ReactComponent as Wallet } from "../Assets/empty-wallet-add.svg";
import { ReactComponent as Row } from "../Assets/row-vertical.svg";
import { ReactComponent as User } from "../Assets/people.svg";

import LogoutModal from "../Modal/LogoutModal";
import { userLogOut } from "../../lib/fetch";
import "./members.css";

const MembersNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const authCtx = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutModal = () => {
    setLogoutModal(!logoutModal);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await userLogOut();
      if (response.success) {
        await authCtx.logout();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) {
    return <Loading color={"white"} />;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`md:w-64 bg-white text-gray-100 ${isSidebarOpen ? "w-64" : "w-0"
          } md:block fixed z-20 top-0 left-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out md:static md:h-auto`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          {/* Toggle Button */}
          <button
            className="focus:outline-none md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className="w-6 h-6"
            />
          </button>
        </div>
        <div className="flex flex-column justify-between h-full">
          <nav className="py-4">
            <ul>
              {/* Sidebar links */}
              <li className="px-6 py-3">
                <NavLink
                  exact
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "block p-3 rounded text-black font-bold flex nav-active"
                      : "block p-3 nav-bg rounded text-black font-bold flex"
                  }
                >
                  <Row className="navIcon" />
                  <span className="ml-1">Dashboard</span>
                </NavLink>
              </li>
              <li className="px-6 py-3">
                <NavLink
                  exact
                  to="/members"
                  className={({ isActive }) =>
                    isActive
                      ? "block p-3 rounded text-black font-bold flex nav-active"
                      : "block p-3 nav-bg rounded text-black font-bold flex"
                  }
                >
                  <Notification className="navIcon" />
                  <span className="ml-1">Memebers</span>
                </NavLink>
              </li>
              <li className="px-6 py-3">
                <NavLink
                  exact
                  to="/committees"
                  className={({ isActive }) =>
                    isActive
                      ? "block p-3 rounded text-black font-bold flex nav-active"
                      : "block p-3 nav-bg rounded text-black font-bold flex"
                  }
                >
                  <Wallet className="navIcon" />
                  <span className="ml-1">Committee</span>
                </NavLink>
              </li>
              {authCtx.userInfo.userType === "Individual" && (
                <li className="px-6 py-3">
                  <NavLink
                    exact
                    to="/projects"
                    className={({ isActive }) =>
                      isActive
                        ? "block p-3 rounded text-black font-bold flex nav-active"
                        : "block p-3 nav-bg rounded text-black font-bold flex"
                    }
                  >
                    <Health className="navIcon" />
                    <span className="ml-1">Projects</span>
                  </NavLink>
                </li>
              )}
              {authCtx.userInfo.userType === "Sponsor" && (
                <li className="px-6 py-3">
                  <NavLink
                    exact
                    to="/sponsor-profile"
                    className={({ isActive }) =>
                      isActive
                        ? "block p-3 rounded text-black font-bold flex nav-active"
                        : "block p-3 nav-bg rounded text-black font-bold flex"
                    }
                  >
                    <Security className="navIcon" />
                    <span className="ml-1">Meettings</span>
                  </NavLink>
                </li>
              )}
              {authCtx.userInfo.userType === "Individual" && (
                <li className="px-6 py-3">
                  <NavLink
                    exact
                    to="/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "block p-3 rounded text-black font-bold flex nav-active"
                        : "block p-3 nav-bg rounded text-black font-bold flex"
                    }
                  >
                    <Security className="navIcon" />
                    <span className="ml-1">Account</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className="px-6 py-3">
            <button
              onClick={handleLogout}
              className="block p-3 nav-bg rounded account-link text-black font-bold flex"
            >
              <Row />
              <span className="ml-1">Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : ""}`}>
        {/* Top Navbar */}
        <div className="h-16 flex items-center justify-between px-4">
          {logoutModal && (
            <LogoutModal
              handleLogout={handleLogout}
              onClose={handleLogoutModal}
            />
          )}

          {/* Menu Button */}
          <button
            className="focus:outline-none md:hidden p-2 mt-5 rounded text-black font-bold"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className="w-6 h-6"
            />
          </button>
          {/* ... (Existing code) */}
        </div>

        {/* Main Content */}
        <div className="">{/* Content goes here */}</div>
      </div>
    </div>
  );
};

export default MembersNav;

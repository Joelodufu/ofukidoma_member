import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import MembersNav from "../Members/Members-nav";
import Navbar from "../Members/topNavbar";
import { AuthContext } from "../../context/AuthContext";
import { getAllProjects, getAllDonations } from "../../lib/fetch";
import PopupModal from "../Modal/PopupModal";
import Loading from "../Modal/Loading";
import { checkInternetConnection } from "../../lib/network";
import Skeleton from "react-loading-skeleton";

const Projects = ({ projectId }) => {
  const [projects, setProjects] = useState([]);
  const [commitedProjects, setCommitedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("projects"); // 'projects' or 'committedProjects'
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const userId = authCtx.id;

  const handleShowPopup = (message, type) => {
    setMessage(message);
    setType(type);
    setShowPopup(true);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
          setIsLoading(false);
          handleShowPopup("INTERNET DISCONNECTED", "error");
          setTimeout(() => setShowPopup(false), 3000);
          return;
        }
        const response = await getAllProjects(token);
        const data = await response.data;
        setProjects(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        handleShowPopup("Error fetching projects", "error");
        setIsLoading(false);
      } finally {
        setTimeout(() => setShowPopup(false), 3000);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await getAllDonations(authCtx.token);
        const committees = response.committees;
        console.log(committees);
        const commitProjects = committees.filter((donation) => {
          return donation?.user?.[0]?._id === authCtx.userInfo._id;
        });

        // Get the projects that the user has committed to
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
  }, [authCtx.token, authCtx.userInfo._id, projects]);

  // if (isLoading) {
  //   return <Loading isLoggin={isLoading} color={'white'} />
  // }

  if (!projects) {
    return (
      <PopupModal
        status={"error"}
        message={"No projects found"}
        title={"Failed"}
      />
    );
  }

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        message={message}
        title={type === "success" ? "Successful" : "Failed"}
      />
    );
  }

  const renderProjects = () => {
    if (isLoading) {
      return (
        <div classname="container">
          <div className="bg-white md:w-[900px] rounded-lg mt-10 p-4 md:ml-0 md:mr-0 ml-4 mr-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex flex-column justify-between"
                >
                  <div>
                    <Skeleton height={40} />
                    <Skeleton count={4} />
                  </div>
                  <div className="flex justify-center">
                    <Skeleton width={180} height={40} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (projects.length === 0) {
      return <p>No projects found</p>;
    }

    return (
      <div classname="container">
        <div className="bg-white md:w-[900px] rounded-lg mt-10 p-4 md:ml-0 md:mr-0 ml-4 mr-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border rounded-lg p-4 flex flex-column justify-between"
              >
                <div>
                  <h3 className="text-xl text-center font-bold mb-2 p-2 bg-gray-100">
                    {project.Name}
                  </h3>
                  <p className="text-gray-600 text-justify">
                    {project.Description}
                  </p>
                </div>
                <Link to={`/cview?id=${project._id}`}>
                  <div className="flex justify-center">
                    {" "}
                    <button className="main-bg rounded-full text-white font-bold py-2 px-4 mt-4">
                      create
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCommittedProjects = () => {
    if (isLoading) {
      return <p>Loading Projects...</p>;
    }

    if (projects.length === 0) {
      return (
        <>
          <div
            style={{ width: "70vw" }}
            className="bg-black rounded-lg mt-10 p-3 flex"
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
              </div>
              {/* ))} */}
            </div>
          </div>
        </>
      );
    }

    return (
      <div classname="container">
        <div className="bg-white md:w-[900px] rounded-lg mt-10 p-4 md:ml-0 md:mr-0 ml-4 mr-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border rounded-lg p-4 flex flex-column justify-between"
              >
                <div>
                  <h3 className="text-xl text-center font-bold mb-2 p-2 bg-gray-100">
                    {project.Name}
                  </h3>
                  <p className="text-gray-600 text-justify">
                    {project.Description}
                  </p>
                </div>
                {/* <Link to={`/cview?id=${project._id}`}>
                  <div className='flex justify-center'>
                    {' '}
                    <button className='main-bg rounded-full text-white font-bold py-2 px-4 mt-4'>
                      Donate
                    </button>
                  </div>
                </Link> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div
        style={{ height: projects >= 3 }}
        className="flex flex-col bg-gray-200 h-[100%] md:flex-row mt-5"
      >
        <MembersNav className="md:w-1/4 md:mr-0" />
        <div>
          <div className="flex md:m-0 m-4 sm:mt-0">
            <button
              className={`bg-purple-200 text-black font-bold py-2 px-4 mt-10 mr-2 rounded ${activeTab === "projects" ? "bg-purple-200 text-black" : "bg-white"
                }`}
              onClick={() => handleTabChange("projects")}
            >
              Projects
            </button>
            <button
              className={`bg-purple-200 text-purple-500 font-bold py-2 px-4 mt-10 rounded ${activeTab === "committedProjects"
                ? "bg-purple-200 text-black"
                : "bg-white text-black"
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
  );
};

export default Projects;

import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const DonateModal = ({
  handleDonate,
  isAnonymousDonor,
  setIsAnonymousDonor,
  isRecurring,
  handleFrequencyChange,
  selectedFrequency,
  handleToggle,
  handleAmountSelection,
  selectedAmount,
  setSelectedAmount,
  email,
  setEmail,
  closeModal,
  setOpenDonateModal,
}) => {
  const authCtx = useContext(AuthContext);

  const [modalOpen, setModalOpen] = useState(true);

  // Handler for closing the modal
  const handleCloseModal = () => {
    setOpenDonateModal(false);
    // closeModal(); // Call the provided closeModal function
  };

  // If modalOpen is false, don't render the modal content
  if (!modalOpen) {
    return null;
  }

  return (
    <div
      className="pop-up-container flex md:p-0 px-3 justify-center items-center min-h-screen"
      onClick={handleCloseModal}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div className="bg-white p-4 md:m-0 rounded-xl w-full h-full">
          {authCtx.token ? null : (
            <div className="mb-3 text-center">
              <label
                className="block mb-2 font-bold text-gray-700 text-left"
                htmlFor="amount"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              />
            </div>
          )}

          <form onSubmit={handleDonate}>
            <FontAwesomeIcon
              icon={faTimes}
              className="w-6 h-6 ml-auto mb-2"
              onClick={handleCloseModal}
            />
            <label
              className="block mb-2 font-bold text-gray-700"
              htmlFor="amount"
            >
              Enter Amount
            </label>
            <input
              type="text"
              id="amount"
              className={`w-full px-3 py-2 border ${
                handleAmountSelection ? "bg-gray-200" : "border-gray-300"
              } rounded focus:outline-none focus:ring focus:ring-blue-400`}
              name="amount"
              placeholder="₦0"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(e.target.value)}
            />
          </form>
          <br />
          <div className="flex flex-wrap justify-center mt-2">
            <div className="flex justify-center">
              {[1000, 2000, 3000].map((amount) => (
                <button
                  key={amount}
                  className={`${
                    selectedAmount === amount
                      ? "main-bg text-white"
                      : "bg-gray-100"
                  } px-4 py-2 rounded-lg m-2`}
                  onClick={() => handleAmountSelection(amount)}
                >
                  {amount}
                </button>
              ))}
            </div>
            <div className="flex justify-center">
              {[4000, 5000, 6000].map((amount) => (
                <button
                  key={amount}
                  className={`${
                    selectedAmount === amount
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

          <div className="flex flex-col items-center mt-4">
            <div className="relative inline-block w-full text-left">
              <input
                type="checkbox"
                id="donateAsAnonymous"
                name="donationType"
                value="anonymous"
                checked={isAnonymousDonor}
                onChange={() => setIsAnonymousDonor(!isAnonymousDonor)}
              />
              <label htmlFor="donateAsAnonymous" className="ml-2">
                Donate as Anonymous
              </label>
            </div>
            <div className="w-full">
              <button
                type="button"
                className={`mt-4 px-6 w-full py-2 text-white main-bg rounded-md focus:outline-none focus:ring focus:ring-blue-400`}
                onClick={handleDonate}
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;

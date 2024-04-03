import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";

const CreationNotification = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const handleNav = () => {
    setShowModal(false);
    navigate("/members");
  };

  return (
    <>
      <SweetAlert
        show={showModal}
        title="Awaiting Verification"
        onConfirm={handleNav}
        confirmBtnText="OKAY"
        confirmBtnBsStyle="primary"
        customClass="modal-not"
      >
        Your member will be live on the platform once we have verified the
        authenticity of all the information provided. This is our way of
        promoting credibility and transparency on our platform. Thank you.
      </SweetAlert>
    </>
  );
};

export default CreationNotification;

import React from 'react'

const LogoutModal = ({ handleLogout, onClose }) => {
  return (
    <>
      <div
        style={{ zIndex: 999 }}
        className='flex items-center justify-center position-fixed top-0 start-0 ful-screen w-100 h-100'
      >
        <div className='bg-white h-50 w-50 flex items-center justify-between flex-column rounded-4 modal-not'>
          <div className='bg-body-secondary w-100 h-25 d-flex items-center justify-center rounded-top-4 '>
            <h3 className='display-6 font-bold'>CONFIRM LOGOUT</h3>
          </div>
          <p className='text-center fs-4 w-75'>
            Are you sure sure you want to Logout
          </p>
          <div className='flex justify-evenly w-100'>
            <button
              type='button'
              className='w-25 bg-red-500 text-white py-3 rounded-full duration-300 my-4 fs-4'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='button'
              className='w-25 bg-red-500 text-white py-3 rounded-full log-btn duration-300 my-4 fs-4'
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default LogoutModal

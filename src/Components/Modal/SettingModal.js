import React from 'react'

const SettingModal = ({ handleLogout, onClose }) => {
  return (
    <>
      <div
        style={{ zIndex: 999 }}
        className='flex items-center justify-center position-fixed top-0 start-0 ful-screen w-100 h-100'
      >
        <div className='bg-white h-50 w-50 flex justify-between flex-column rounded-4 modal-not'>
          <div className='bg-body-secondary w-100 h-25 d-flex items-center justify-center rounded-top-4 '>
            <h3 className='display-6 font-bold'>Member Settings</h3>
          </div>
          <div className='w-50 pl-4'>
            <p className='text-left fs-4 w-75'>Member Status</p>
            <div className='flex justify-between mt-2'>
              <button className='border p-3 w-35 text-black-500 bg-green-400 rounded-full font-bold'>
                Active
              </button>
              <button className={`border p-3 w-35 text-black-500 bg-green-400 rounded-full font-bold`}>
                Suspend
              </button>
              <button className='border p-3 w-35 text-black-500 bg-green-400 rounded-full font-bold'>
                Delete
              </button>
            </div>
          </div>
          <div className='flex justify-end w-100 pr-4'>
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
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingModal

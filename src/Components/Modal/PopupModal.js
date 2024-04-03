import React from 'react'
import success from './success.png'
import failed from './failed.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const PopupModal = ({ status, message, title, onClick }) => {
  return (
    <div className='pop-up-container flex justify-center items-center min-h-screen'>
      <div className='pop-up-div bg-white rounded-lg m-10 md:m-0 shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 relative'>
        <button style={{position:'absolute', right:15, top:10}} onClick={onClick}>
          <FontAwesomeIcon style={{fontSize:'30px'}} icon={faClose} />
        </button>
        <div className='pop-up-img-container'>
          <img src={status === 'success' ? success : failed} alt='Popup' />
        </div>
        <div className='pop-up-text-holder'>
          <h2
            className={
              status === 'success'
                ? 'success-title text-green-500'
                : 'error-title text-red-500'
            }
          >
            {title}
          </h2>
          <p
            className={
              status === 'success'
                ? 'success-message text-green-700'
                : 'error-message text-red-700'
            }
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PopupModal

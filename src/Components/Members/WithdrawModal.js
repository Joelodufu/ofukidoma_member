import { useState, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import PopupModal from '../Modal/PopupModal'
import Swal from 'sweetalert2'
import constants from '../../lib/config'
const apiUrl = constants.apiUrl


const WithdrawModal = ({ setOpenWithdrawModal, memberId }) => {

  const [amount, setAmount] = useState()
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [buttonState, setButtonState] = useState('Withdraw')

  const authCtx = useContext(AuthContext)

  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }

  const handleCloseModal = () => {
    setOpenWithdrawModal(false);
    // closeModal(); // Call the provided closeModal function
  };

  const handleWithdraw = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    const data = {
      amount,
      bankName,
      accountName,
      accountNumber
    }

    try {
      setButtonState('Please wait...')
      const response = await axios.post(
        `${apiUrl}/api/v1/member/request/${memberId}`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
            Authorization: `Bearer ${authCtx.token}`,
          },
          mode: 'cors',
          credentials: 'include',
        }
      )
      Swal.fire({
        title: "Successful",
        text: "Your withdrawal is successful",
        icon: "success"
      })
      setTimeout(() => window.location.reload(), 5000)
    } catch (error) {
      console.log(error.response)
    } finally {
      setIsProcessing(false)
      handleCloseModal()
    }
  }

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        message={message}
        title={type === 'success' ? 'Successful' : 'Failed'}
      />
    )
  }


  return (
    <div className='pop-up-container flex justify-center items-center min-h-screen' onClick={handleCloseModal}>
      <div className='pop-up-div bg-white h-auto rounded-lg m-10 md:m-0 shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mt-5' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleWithdraw}>
          <FontAwesomeIcon
            icon={faTimes}
            className='w-6 h-6 ml-auto mb-2'
            onClick={handleCloseModal}
          />
          <label
            className='block mb-2 font-bold text-gray-700'
            htmlFor='amount'
          >
            Enter Amount
          </label>
          <input
            type='number'
            id='amount'
            className={`w-full px-3 py-2 border  rounded focus:outline-none focus:ring focus:ring-blue-400`}
            name='amount'
            placeholder='NGN 0'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <label
            className='block mb-2 font-bold text-gray-700'
            htmlFor='bankName'
          >
            Bank Name
          </label>
          <input
            type='text'
            id='bankName'
            className={`w-full px-3 py-2 border  rounded focus:outline-none focus:ring focus:ring-blue-400`}
            name='amount'
            placeholder='Example Bank'
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <label
            className='block mb-2 font-bold text-gray-700'
            htmlFor='accName'
          >
            Account Name
          </label>
          <input
            type='text'
            id='accName'
            className={`w-full px-3 py-2 border  rounded focus:outline-none focus:ring focus:ring-blue-400`}
            name='amount'
            placeholder='John Doe'
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
          <label
            className='block mb-2 font-bold text-gray-700'
            htmlFor='accNum'
          >
            Account Number
          </label>
          <input
            type='number'
            id='accNum'
            className={`w-full px-3 py-2 border  rounded focus:outline-none focus:ring focus:ring-blue-400`}
            name='amount'
            placeholder='1234567890'
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          <button
            className={`mt-4 px-6 w-full py-2 text-white main-bg rounded-md focus:outline-none focus:ring focus:ring-blue-400`}
          >
            {buttonState}
          </button>
        </form>
      </div>
    </div>
  )
}

export default WithdrawModal
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { resetPassword } from '../../lib/fetch'
import { useNavigate } from 'react-router-dom'
import Loading from '../Modal/Loading'
import PopupModal from '../Modal/PopupModal'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false) // New state variable
  // const authCtx = useContext(AuthContext)

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  let navigate = useNavigate()
  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    const data = {
      password,
      passwordConfirm,
      otpCode,
    }
    if (!password || !passwordConfirm || !otpCode) {
      setIsProcessing(false)
      handleShowPopup('Please Fill in the required field', 'error')
      setTimeout(() => setShowPopup(false), 3000)
      return
    }
    try {
      const response = await resetPassword(data)

      if (response.success === true) {
        setIsProcessing(false)
        handleShowPopup(response.message, 'success')
        setTimeout(() => setShowPopup(false), 5000)
        window.location.href = '/login'
        return
      }
    } catch (error) {
       console.error('Error:', error.response.data.error)
       handleShowPopup(error.response.data.error, 'error')
       setTimeout(() => setShowPopup(false), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'otpCode') {
      setOtpCode(value)
    } else if (name === 'password') {
      setPassword(value)
    } else if (name === 'passwordConfirm') {
      setPasswordConfirm(value)
    }
  }


  if (isProcessing) {
    return <Loading isLoggin={isProcessing} color={'white'} />
  }

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        message={message}
        title={type === 'success' ? 'Successful' : 'Failed'}
        onClick={() => setShowPopup(false)}
      />
    )
  }
  return (
    <>
      <div className='md:position-relative'>
        <div onClick={()=>navigate(-1)} className='flex items-center mr-10 mb-4 position-absolute top-10 start-20 top-bk'>
          <FontAwesomeIcon icon={faChevronLeft} className='mr-2' />
          <span className='ml-4 top-bk'>Back</span>
        </div>
        <div className='flex justify-center items-center h-screen bg-white'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-2 v-head'>Reset Password</h1>
            <h2 className='text-lg mb-6'>Enter a new password</h2>
            <form onSubmit={handleSubmit}>
              <div className='flex justify-center mb-4'>
                <input
                  type='number'
                  name='otpCode'
                  value={otpCode}
                  onChange={handleChange}
                  className='border-b text-left border-gray-300 rounded-none px-4 py-2 focus:outline-none v-input'
                  placeholder='OTP'
                />
              </div>
              <div className='flex justify-center mb-4'>
                <input
                  type='password'
                  name='password'
                  value={password}
                  onChange={handleChange}
                  className='border-b text-left border-gray-300 rounded-none px-4 py-2 focus:outline-none v-input'
                  placeholder='Password'
                />
              </div>
              <div className='flex justify-center mb-4'>
                <input
                  type='password'
                  name='passwordConfirm'
                  value={passwordConfirm}
                  onChange={handleChange}
                  className='border-b border-gray-300 rounded-none px-4 py-2 focus:outline-none v-input'
                  placeholder='Confirm Password'
                />
              </div>
              <button
                type='submit'
                className='w-full border border-gray-300 rounded-lg px-4 py-2 main-bg text-white hover:bg-blue-600 transition-colors duration-300'
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

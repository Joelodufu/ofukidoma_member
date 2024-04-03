import React, { useContext, useState } from 'react'
import backgroundImage from '../Assets/login-image.jpeg'
import '../../App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { ngoLogin } from '../../lib/fetch'
import { AuthContext } from '../../context/AuthContext'
import Loading from '../Modal/Loading'
import PopupModal from '../Modal/PopupModal'

const LoginPage = () => {
  const [isChecked, setIsChecked] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false) // New state variable

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const authCtx = useContext(AuthContext)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }

  const handleSubmit = async () => {
    setIsProcessing(true) // Set isProcessing to true when API call starts

    // Construct the request body
    const requestBody = {
      email,
      password,
      rememberMe: isChecked,
    }

    try {
      // Send a POST request to the dummy endpoint

      const response = await ngoLogin(requestBody)

      // const response = await fetch(
      //   'https://funder.onrender.com/api/v1/auth/noglogin',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(requestBody),
      //   }
      // )

      if (response.success === true) {
        // Handle the successful response
        authCtx.authenticate(response.token)
        authCtx.setId(response.data.user._id)
        authCtx.setUser(response.data.user)

        setIsProcessing(false)
        handleShowPopup('Log in Successfully', 'success')
        setTimeout(() => setShowPopup(false), 5000)
        //
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Error:', error.response)
      handleShowPopup(error.response.data.message, 'error')
      setTimeout(() => setShowPopup(false), 3000)
    } finally {
      setIsProcessing(false) // Set isProcessing to false when API call completes
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
      />
    )
  }

  return (
    <div className='flex flex-col md:flex-row items-center'>
      <div className='md:w-1/2 pl-6 md:pl-40 pr-6 md:pr-40'>
        <div className='flex items-center mb-4'>
          <FontAwesomeIcon icon={faChevronLeft} className='mr-2 top-bk' />
          <span className='top-bk'>Back</span>
        </div>
        <div className='mt-16'>
          <h2 className='text-3xl font-semibold user-h2 mb-6'>Welcome Back</h2>
          <p className='user-p'>Login</p>
          <div className='mb-8'>
            <input
              type='email'
              id='email'
              placeholder='Email Address'
              className='w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <input
              type='password'
              id='password'
              placeholder='Password'
              className='w-full py-2 border-b border-gray-300 focus:border-blue-500 outline-none'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='rememberMe'
                className='form-checkbox h-4 w-4 text-red-500 transition duration-150 ease-in-out'
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor='rememberMe' className='ml-2 rem'>
                Remember me
              </label>
            </div>
            <a href='#' className='text-blue-500 fp hover:text-blue-700'>
              Forgot password
            </a>
          </div>
          <br />
          <button
            type='button'
            className='w-full bg-red-500 text-white py-2 rounded duration-300'
            onClick={handleSubmit}
            disabled={isProcessing} // Disable the button when processing
          >
            {isProcessing ? 'Process...' : 'Login'}{' '}
            {/* Display 'Process...' or 'Login' based on the isProcessing state */}
          </button>
        </div>
        <br />
        <p className='text-center'>
          Don't have an account? <span className='fp'>Sign Up</span>
        </p>
      </div>
      <div className='md:w-1/2'>
        <div className='h-screen'>
          <img
            src={backgroundImage}
            alt='Background'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage

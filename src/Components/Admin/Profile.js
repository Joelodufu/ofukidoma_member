import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Members/topNavbar'
import MembersNav from '../Members/Members-nav'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import Loading from '../Modal/Loading'
import { checkInternetConnection } from '../../lib/network'
import PopupModal from '../Modal/PopupModal'
import { editUser } from '../../lib/fetch'
import SideNav from './Sidenav'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import constants from '../../lib/config'
const apiUrl = constants.apiUrl

const AdminProfile = () => {
  const handleDeleteToken = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    console.log('Token deleted from local storage')
    window.location.href = '/login'
  }

  const [ngoName, setNgoName] = useState('')
  const [email, setEmail] = useState('')
  const [officePhone, setOfficePhone] = useState('')
  const [address, setAddress] = useState('')
  const [profileDescription, setProfileDescription] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isEdit, setIsEdit] = useState(true)
  const [user, setUser] = useState('')

  const [image, setImage] = useState('')
  const [userImage, setUserImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState('')
  const authCtx = useContext(AuthContext)

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const [fileName, setFileName] = useState('')

  const [hasChanges, setHasChanges] = useState(false)

  const editProfileToggle = () => {
    setIsEdit(!isEdit)
    console.log(isEdit)
  }

  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }

  const handleUserImage = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
      setFileName(file.name)
    } else {
      setImage(null)
      setFileName(null)
    }
    console.log(file)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pingNetwork = async () => {
    const isConnected = await checkInternetConnection()
    if (!isConnected) {
      setIsLoading(false)
      handleShowPopup('INTERNET DISCONNECTED', 'error')
      setTimeout(() => setShowPopup(false), 3000)
      return
    }
    setIsLoading(false)
  }

  useEffect(() => {
    pingNetwork()
  }, [pingNetwork])

  const userName = authCtx.userInfo

  useEffect(() => {
    setUser(userName.name)
  }, [])

  const getFirstAndLast = (fullName) => {
    const nameArray = fullName?.split(' ')
    const first = nameArray[0]
    const last = nameArray.length > 1 ? nameArray[nameArray.length - 1] : ''
    console.log(
      `${first} : first  ${nameArray} : nameArray  last ${last}`,
      nameArray.length
    )
    return { first, last }
  }

  const { first, last } = getFirstAndLast(user)

  useEffect(() => {
    setFirstName(first || '')
    setLastName(last || '')
    setEmail(userName.email || '')
    setPhoneNumber(userName.phone || '')
  }, [first, last, userName.email, userName.phone])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    switch (name) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      // Add more cases for other input fields if needed
      default:
        break
    }
    // Set the hasChanges flag to true when the user starts typing
    setHasChanges(true)
  }
  const handleCancelEdit = () => {
    // Clear input fields
    setFirstName('')
    setLastName('')
    // Set the hasChanges flag to false
    setHasChanges(false)
  }

  console.log(first, last)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!firstName || !lastName) {
      setIsLoading(false)
      handleShowPopup('Please Fill in the required fields', 'error')
      setTimeout(() => setShowPopup(false), 3000)
      return
    }

    if (image.length === 0) {
      handleShowPopup('No image was selected', 'error')
      setTimeout(() => setShowPopup(false), 3000)
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', image)
    formData.append(
      'upload_preset',
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    )

    const response = await axios.post(
      process.env.REACT_APP_CLOUDINARY_URL,
      formData
    )

    const imageUrl = response.data.secure_url

    const data = {
      firstname: firstName,
      lastname: lastName,
      image: imageUrl,
      phone: phoneNumber
    }

    try {
      const isConnected = await checkInternetConnection()
      if (!isConnected) {
        setIsLoading(false)
        handleShowPopup('INTERNET DISCONNECTED', 'error')
        setTimeout(() => setShowPopup(false), 3000)
        return
      }

      const response = await editUser(authCtx.token, authCtx.id, data)
      authCtx.setUser(response.data)
      console.log(response)
      handleShowPopup(
        'Your Information has been Successfully Updated',
        'success'
      )
      setTimeout(() => setShowPopup(false), 3000)
      setIsEdit(true)
      // window.location.reload()
      // setUserImage(response.data.data?.image?.[0])
    } catch (error) {
      if (error) {
        handleShowPopup('Could not Edit Your Profile', 'error')
        setIsLoading(false)
      }
      setIsLoading(false)
      setIsEdit(true)

      console.log(error)
    } finally {
      setTimeout(() => setShowPopup(false), 3000)
      setIsEdit(true)
    }
    setIsLoading(false)

    // Save the updated profile information here
  }

  if (isLoading) {
    return <Loading isLoggin={isLoading} color={'white'} />
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
    <div>
      <Navbar
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div
        style={{ height: '100vh' }}
        className='flex flex-col bg-gray-200 md:flex-row mt-5'
      >
        <SideNav className='' />
        <div className='px-4 py-6 bg-gray-200'>
          <div className='d-flex items-center justify-between w-100'>
            <h2>Account</h2>
            {isLoading && <Loading isLoggin={isLoading} color={'white'} />}

            {isEdit && (
              <button
                style={{
                  backgroundColor: '#9968D1',
                  borderRadius: '100px',
                  width: '150px',
                  height: '35px',
                }}
                className='px-1 py-1 text-white focus:outline-none'
                onClick={editProfileToggle}
              >
                Edit Account
              </button>
            )}
          </div>
          <div className='py-12 m-auto container w-full border rounded'>
            <div className='mt-5 bg-white rounded px-10 py-5'>
              <form onSubmit={handleSaveProfile}>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='md:col-span-1'>
                    <img
                      src={
                        authCtx.userInfo?.image?.[0] ||
                        process.env.REACT_APP_USER_DEFAULT_IMAGE
                      }
                      alt='user-name'
                      className='border border-1 h-40 w-40 rounded-circle'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block mb-2'>First name</label>
                    <input
                      disabled={isEdit}
                      type='text'
                      className='w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                      placeholder='First Name'
                      value={firstName}
                      onChange={handleInputChange}
                      name='firstName'
                    />
                    <label className='block mb-2'>Email Address</label>
                    <input
                      disabled={true}
                      type='email'
                      className='w-full px-4 py-2 bg-gray-200 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                      placeholder='Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className='block mb-2'>Last name</label>
                    <input
                      type='text'
                      disabled={isEdit}
                      className='w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                      placeholder='Last Name'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <label className='block mb-2'>Password</label>
                    <PhoneInput
                      className='w-full px-4 py-2 bg-gray-200 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                      international
                      defaultCountry='NG'
                      limitMaxLength={true}
                      name='phoneHolder'
                      id='phoneHolder'
                      countrySelectProps={{ unicodeFlags: false }}
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      autoComplete='new-password'
                      disabled={isEdit}
                    />
                  </div>
                </div>
                {!isEdit && (
                  <div className='py-2 w-full flex justify-between items-end mt-3 pl-3'>
                    <div className='ml-5'>
                      <input
                        accept='image/*'
                        id='userImage'
                        name='userImage'
                        type='file'
                        onChange={handleUserImage}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor='userImage' className='ml-5'>
                        Upload
                      </label>
                      <span className='ml-2'>
                        {fileName
                          ? fileName.length > 16
                            ? fileName.slice(0, 5) + '...'
                            : fileName
                          : ''}
                      </span>
                    </div>
                    {hasChanges && (
                      <button
                        className='btn btn-custom'
                        style={{ color: 'red' }}
                        onClick={handleCancelEdit}
                        type='submit'
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className='btn btn-custom'
                      onClick={handleSaveProfile}
                      type='submit'
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile

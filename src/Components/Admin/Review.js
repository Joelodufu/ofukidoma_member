import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { approveMember, getSingleMember } from '../../lib/fetch'
import Loading from '../Modal/Loading'
import PopupModal from '../Modal/PopupModal'
import { checkInternetConnection } from '../../lib/network'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Skeleton from 'react-loading-skeleton'
import UserModal from '../Modal/UserModal'

const Review = () => {
  const [memberData, setMemberData] = useState(null)
  const authCtx = useContext(AuthContext)
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const [showUserModal, setShowUserModal] = useState(false)
  const [userData, setUserData] = useState([])
  const urlParams = new URLSearchParams(window.location.search)
  const memberId = urlParams.get('id')
  const navigate = useNavigate()

  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const isConnected = await checkInternetConnection()
        if (!isConnected) {
          setIsLoading(false)
          handleShowPopup('INTERNET DISCONNECTED', 'error')
          setTimeout(() => setShowPopup(false), 3000)
          return
        }

        const response = await getSingleMember(authCtx.token, memberId)
        if (response.success === true) {
          const data = response.data
          setMemberData(data)
          console.log(data?._user)
          setUserData(data?._user)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemberData()
  }, [authCtx.token, memberId])

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const response = await approveMember(authCtx.token, memberId, {
        status: 'approve',
      })
      // Handle success response
      console.log(response.message)
      handleShowPopup(response.message, 'success')
    } catch (error) {
      // Handle error
      console.error('Error approving:', error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleDecline = async () => {
    setIsLoading(true)
    try {
      const response = await approveMember(authCtx.token, memberId, {
        status: 'decline',
      })
      // Handle success response
      handleShowPopup(response.message, 'success')

      console.log(response.message)
      handleShowPopup(response.message, 'success')
    } catch (error) {
      // Handle error
      console.error('Error approving:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const trimText = (text, maxlength) => {
    return text.length > maxlength
      ? `${text.slice(0, maxlength - 1)}.....`
      : `${text}`
  }

  if (isLoading) {
    return (
      <div>
        <div className='flex items-center position-absolute top-0 start-2 mt-5 md:mt-0'>
          <FontAwesomeIcon icon={faChevronLeft} className='mr-2 ml-3 top-bk' />
          <span className='ml-4 top-bk'>Back</span>
        </div>
        <div className='flex flex-col md:flex-row md:items-start mt-12 md:space-x-4 p-4 md:pt-8 md:pb-0'>
          {/* Left Section */}
          <div className='w-full md:w-1/2 p-3 border border-gray-300 rounded-lg mb-4 md:mb-0'>
            <Skeleton height={30} width={300} />
            <Skeleton height={30} width={300} />
            {/* ... (existing content) */}
          </div>
        </div>
        <div className='p-4'>
          {/* Left Section */}
          <div className='w-full md:w-1/2 p-3 border border-gray-300 mt-12 rounded-lg mb-4 md:mb-0'>
            <Skeleton height={30} width={300} />
            <Skeleton height={20} width={150} />
            <Skeleton height={200} style={{ marginBottom: '10px' }} />
            <div className='flex flex-col md:flex-row'>
              <div className='w-full md:w-1/2 md:pr-2'>
                <Skeleton height={15} width={100} />
                <Skeleton height={15} width={100} />
              </div>

              <div className='w-full md:w-1/2 md:pl-14'>
                <h3 className='v-status'>
                  Member Status &nbsp;
                  <span className='p-2 m-1 rounded-xl'>
                    <Skeleton height={20} width={80} />
                  </span>
                </h3>
              </div>
            </div>
            <hr />
            <p className='p-2 mt-3 text-sm'>
              <Skeleton count={3} />
            </p>
          </div>

          {/* Space between sections */}
          <div className='w-20'></div>

          {/* Right Section */}
          <div className='w-full md:w-1/2 p-3 border border-gray-300 rounded-lg'>
            <div className='mb-4'>
              <h3 className='text-lg font-semibold'>Target Funds</h3>
              <Skeleton height={20} width={100} />
            </div>
            <div>
              <div>
                <h2 className='font-bold h2'>Supporting Projects</h2>
                <Skeleton height={30} width={200} />
              </div>
              <div
                className='border border-1 w-100 my-3'
                style={{ height: 340 }}
              >
                <Skeleton height={340} />
              </div>
              <Skeleton height={20} width={200} />
            </div>
            {/* Add file viewer component for .doc or .pdf files here */}
          </div>
        </div>
        <div className='p-4'>
          <h3 className='font-bold mb-3'>Admin Decision</h3>
          <hr />
          <br />
          <div className='flex flex-col mb-3'>
            <label>Note to memberer (Optional)</label>
            <textarea
              className='w-full p-2 h-32 resize-none rounded-lg border border-gray-300'
            // placeholder='Enter text...'
            />
          </div>
          <div className='flex flex-col md:flex-row mt-4'>
            <Skeleton
              height={40}
              width={100}
              className='w-full md:w-auto md:mr-2 mb-2 md:mb-0'
              style={{ marginRight: '8px' }}
            />
            <Skeleton
              height={40}
              width={100}
              className='w-full md:w-auto md:mr-2 mb-2 md:mb-0'
              style={{ marginRight: '8px' }}
            />
            <Skeleton height={40} width={150} className='w-full md:w-auto' />
          </div>
        </div>
        <br />
        <br />
      </div>
    )
  }

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        title={type === 'success' ? 'Success' : 'Error'}
        message={type === 'error' ? message : message}
        onClick={() => setShowPopup(false)}
      />
    )
  }
  const handleContact = () => {
    setShowUserModal(true)
  }

  return (
    <div className=''>
      <div
        onClick={() => navigate(-1)}
        className='flex items-center position-absolute top-0 start-2 mt-5 md:mt-0'
      >
        <FontAwesomeIcon icon={faChevronLeft} className='mr-2 ml-3 top-bk' />
        <span className='ml-4 top-bk'>Back</span>
      </div>


      <div className='flex flex-col md:flex-row md:items-start mt-14 md:space-x-4 p-4 md:pt-8 md:pb-0'>
        {/* Left Section */}
        <div className='w-full md:w-1/2 p-1 border border-gray-300 rounded-lg mb-4 md:mb-0'>
          <h2 className='text-2xl pl-1 font-bold'>{memberData.title}</h2>
          <h3 className='text-lg pl-1 rounded font-semibold'>
            {memberData.typeOfFundraising}
          </h3>
          {/* ... (existing content) */}
          <div className='w-full p-2 rounded-lg mb-4 md:mb-0'>
            {/* <Skeleton height={200} style={{ marginBottom: '10px' }} /> */}
            <div className='w-full' style={{ height: '267px' }}>
              <img
                className='rounded-lg h-100 w-full'
                style={{ objectFit: 'fill' }}
                src={memberData.imageOrVideo?.[0]}
                alt=''
              />
            </div>
            <div className='flex flex-col md:flex-row mt-3 justify-between mb-3'>
              <div className='w-full md:w-1/2 md:pr-2'>
                <p>Created by: {memberData._user?.name} </p>
                <p>
                  Date created -{' '}
                  {new Date(memberData?.startDate).toLocaleDateString()}{' '}
                </p>
              </div>

              <div className=''>
                <h3 className='v-status'>
                  Member Status: &nbsp;
                  <span
                    className={`p-2 m-1 rounded-xl ${memberData.status === 'Pending'
                      ? 'bg-warning text-white font-bold'
                      : memberData.status === 'Approved'
                        ? 'bg-success text-white font-bold'
                        : memberData.status === 'Declined'
                          ? 'bg-red-600 text-white font-bold'
                          : ''
                      }`}
                  >
                    {memberData.status}
                  </span>
                </h3>
              </div>
            </div>
            <hr />
            <p className='p-2 mt-3 text-sm'>
              {trimText(memberData.description, 60)}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className='w-full md:w-1/2 p-3 border border-gray-300 rounded-lg'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>Target Funds</h3>
            <p className='bg-gray-300 font-bold p-1 w-50'>
              N{memberData.raise.toLocaleString()}
            </p>
          </div>
          <div>
            <div>
              <h2 className='font-bold h2'>Supporting Projects</h2>
              <p className='text-xl'>Medical Report</p>
            </div>
            <div className='border border-1 w-100 my-3' style={{ height: 340 }}>
              <img
                src={memberData.MedicalReport}
                alt='Member'
                className='w-full h-full '
              />
            </div>
            <p className='text-xl'>medicalsupportdoc.jpeg</p>
          </div>
          {/* Add file viewer component for .doc or .pdf files here */}
        </div>
      </div>
      <div className='p-4'>
        <h3 className='font-bold mb-3'>Admin Decision</h3>
        <hr />
        <br />
        <div className='flex flex-col mb-3'>
          <label>Note to memberer (Optional)</label>
          <textarea
            className='w-full md:w-1/2 p-2 h-32 resize-none rounded-lg border border-gray-300'
          // placeholder='Enter text...'
          />
        </div>
        <div className='flex flex-col md:flex-row mt-4'>
          <button
            className='w-full md:w-auto md:mr-2 px-4 py-2 main-bg text-white rounded mb-2 md:mb-0'
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className='w-full md:w-auto md:mr-2 px-4 py-2 bg-red-600 text-white rounded mb-2 md:mb-0'
            onClick={handleDecline}
          >
            Decline
          </button>
          <button
            onClick={handleContact}
            className='w-full md:w-auto md:mr-2 px-4 py-2 bg-blue-600 text-white rounded mb-2 md:mb-0'
          >
            Contact Memberer
          </button>
        </div>
      </div>
      <br />
      <br />
      {showUserModal && (
        <UserModal
          userInfo={userData}
          onClick={() => setShowUserModal(false)}
        />
      )}
    </div>
  )
}

export default Review

import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Members/topNavbar'
import SideNav from './Sidenav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLineChart,
  faList12,
  faEdit,
  faClose,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../../context/AuthContext'
import Loading from '../Modal/Loading'
import PopupModal from '../Modal/PopupModal'
import { checkInternetConnection } from '../../lib/network'
import { getAllMembers, getSubmittions } from '../../lib/fetch'
import Skeleton from 'react-loading-skeleton'

const AdminMembers = () => {
  const [members, setMembers] = useState([])
  const [currentTab, setCurrentTab] = useState('All')
  const authCtx = useContext(AuthContext)
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedCondition, setSelectedCondition] = useState('')

  const membersPerPage = 9

  const allConditions = [
    'Cancer',
    'Diabetes',
    'Surgery',
    'Organ Transplant',
    'Injury',
    'Others'
  ]
  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }

  const fetchMemberData = async (status, page) => {
    try {
      setIsLoading(true)
      const isConnected = await checkInternetConnection()
      if (!isConnected) {
        setIsLoading(false)
        handleShowPopup('INTERNET DISCONNECTED', 'error')
        setTimeout(() => setShowPopup(false), 3000)
        return
      }

      let response
      if (status === 'All') {
        response = await getSubmittions(authCtx.token, 'Approved')
      } else {
        response = await getSubmittions(authCtx.token, status)
      }

      console.log(response.data)

      if (response.success === true) {
        const membersData = response.data
        // Add an auto-incrementing index to each member
        membersData.forEach((member, index) => {
          member.index = index
        })

        // Filter "All" members and sort based on the auto-incrementing index in reverse order (latest to oldest)
        membersData.sort((a, b) => b.index - a.index)

        setMembers(membersData)

        setTotalPages(Math.ceil(membersData.length / membersPerPage))
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error:', error.response)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMembersByCondition = async (condition) => {
    try {
      setIsLoading(true)
      const isConnected = await checkInternetConnection()
      if (!isConnected) {
        setIsLoading(false)
        handleShowPopup('INTERNET DISCONNECTED', 'error')
        setTimeout(() => setShowPopup(false), 3000)
        return
      }

      const response = await fetch(
        `https://fundezer-api.onrender.com/api/v1/member/member?typeOfFundraising=${condition}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      )
      const data = await response.json()

      if (response.ok) {
        setMembers(data.data)
        setTotalPages(Math.ceil(data.data.length / membersPerPage))
        setCurrentPage(1)
      } else {
        console.error('Failed to fetch members:', data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabClick = (tab) => {
    setCurrentTab(tab)
    if (tab === 'All') {
      fetchMemberData('Approved', 1)
      members.sort((a, b) => b.index - a.index)
    } else {
      fetchMemberData(tab, 1)
    }

    if (selectedCondition) {
      fetchMembersByCondition(selectedCondition)
    }
  }

  useEffect(() => {
    fetchMemberData('All', 1)
    members.sort((a, b) => b.index - a.index)
  }, [])

  const handlePageChange = (page) => {
    fetchMemberData(currentTab, page)
  }

  if (isLoading) {
    return (
      <div>
        <Navbar
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
        />
        <div className='flex flex-col whole-bg md:flex-row mt-5'>
          <SideNav className='' />
          <div className='flex-1 pr-5 mx-auto px-2'>
            <br />
            <nav className='bg-white'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                  <div className='flex'>
                    {window.innerWidth <= 768 ? (
                      <select
                        onChange={(e) => handleTabClick(e.target.value)}
                        value={currentTab}
                        className='px-3 py-2 text-sm font-medium'
                      >
                        <option value='All'>All Members</option>
                        <option value='Pending'>Pending</option>
                        <option value='Closed'>Closed</option>
                        <option value='Approved'>Ongoing</option>
                      </select>
                    ) : (
                      <>
                        <button
                          className={`px-3 py-2 text-sm font-medium border-r-2 border-gray-300 ${currentTab === 'All' ? 'bg-gray-200 camapigns-a' : ''
                            }`}
                          onClick={() => handleTabClick('All')}
                        >
                          <FontAwesomeIcon icon={faList12} /> &nbsp; All Members
                          <span className='inline-block h-4 bg-gray-300' />
                        </button>
                        <button
                          className={`px-3 py-2 text-sm font-medium border-r-2 border-gray-300 ${currentTab === 'Pending' ? 'bg-gray-200 camapigns-a' : ''
                            }`}
                          onClick={() => handleTabClick('Pending')}
                        >
                          <FontAwesomeIcon icon={faChartLine} /> &nbsp; Pending
                        </button>
                        <button
                          className={`px-3 py-2 text-sm font-medium border-r-2 border-gray-300 ${currentTab === 'Closed' ? 'bg-gray-200 camapigns-a' : ''
                            }`}
                          onClick={() => handleTabClick('Closed')}
                        >
                          <FontAwesomeIcon icon={faLineChart} /> &nbsp; Closed
                          <span className='inline-block h-4 bg-gray-300' />
                        </button>
                        <button
                          className={`px-3 py-2 text-sm font-medium  border-gray-300 ${currentTab === 'Approved' ? 'bg-gray-200 camapigns-a' : ''
                            }`}
                          onClick={() => handleTabClick('Approved')}
                        >
                          <FontAwesomeIcon icon={faLineChart} /> &nbsp; Ongoing
                        </button>
                      </>
                    )}
                  </div>
                  <div className='flex md:mt-0'>
                    <select
                      onChange={(e) => {
                        setSelectedCondition(e.target.value);
                        fetchMembersByCondition(e.target.value);
                      }}
                      value={selectedCondition}
                      className='w-full hover:bg-purple-400 px-3 py-2 text-sm font-medium'
                    >
                      <option value=''>All Conditions</option>
                      {allConditions.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </nav>

            <div className='bg-white p-4 md:mr-5'>
              <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className='bg-white c-card rounded-lg shadow-md p-4'
                  >
                    <Skeleton height={200} />
                    <h2 className='text-xl font-bold text-mid my-2'>
                      <Skeleton />
                    </h2>
                    <p className='text-gray-700 text-sm mb-4'>
                      <Skeleton count={2} />
                    </p>
                    <p className='text-gray-600 text-xs mb-2'>
                      <Skeleton width={80} />
                    </p>
                    <div className='bg-gray-200 rounded-lg h-2 mb-4 progress'>
                      <Skeleton height={8} />
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-left'>
                        <span className='cap-amt text-mid amm'>
                          <Skeleton width={60} />
                        </span>
                        <br />
                        <span className='text-red-500 font-bold'>Raised</span>
                      </div>
                      <div className='text-right'>
                        <span className='cap-amt text-right amm'>
                          <Skeleton width={60} />
                        </span>
                        <br />
                        <span className='text-green-600 font-bold text-right'>
                          Goal
                        </span>
                      </div>
                    </div>
                    <div className='cap-btn text-sm font-bold py-2 px-4 rounded-full mt-4 w-full'>
                      <Skeleton />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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

  const indexOfLastMember = currentPage * membersPerPage
  const indexOfFirstMember = indexOfLastMember - membersPerPage
  const currentMembers = members.slice(
    indexOfFirstMember,
    indexOfLastMember
  )
  const trimText = (text, maxlength) => {
    return text.length > maxlength
      ? `${text.slice(0, maxlength - 1)}.....`
      : `${text}`
  }
  return (
    <div>
      <Navbar
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className='flex flex-col whole-bg md:flex-row mt-5'>
        <SideNav className='' />
        <div className='flex-1 pr-5 mx-auto px-2 md:py-4'>
          <br />
          <nav className='bg-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex items-center justify-between h-16'>
                <div className='flex'>
                  {window.innerWidth <= 768 ? (
                    <select
                      onChange={(e) => handleTabClick(e.target.value)}
                      value={currentTab}
                      className='px-3 py-2 text-sm font-medium'
                    >
                      <option value='All'>All Members</option>
                      <option value='Pending'>Pending</option>
                      <option value='Closed'>Closed</option>
                      <option value='Approved'>Ongoing</option>
                    </select>
                  ) : (
                    <>
                      <button
                        className={`px-3 py-2 text-sm font-medium border-r-2 border-gray-300 ${currentTab === 'All' ? 'bg-gray-200 camapigns-a' : ''
                          }`}
                        onClick={() => handleTabClick('All')}
                      >
                        <FontAwesomeIcon icon={faList12} /> &nbsp; All Membersss
                        <span className='inline-block h-4 bg-gray-300' />
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium border-r-2 border-gray-300 ${currentTab === 'Pending' ? 'bg-gray-200 camapigns-a' : ''
                          }`}
                        onClick={() => handleTabClick('Pending')}
                      >
                        <FontAwesomeIcon icon={faChartLine} /> &nbsp; Pending
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium border-r-2 border-gray-300 ${currentTab === 'Closed' ? 'bg-gray-200 camapigns-a' : ''
                          }`}
                        onClick={() => handleTabClick('Closed')}
                      >
                        <FontAwesomeIcon icon={faLineChart} /> &nbsp; Closed
                        <span className='inline-block h-4 bg-gray-300' />
                      </button>
                      <button
                        className={`px-3 py-2 text-sm font-medium  border-gray-300 ${currentTab === 'Approved' ? 'bg-gray-200 camapigns-a' : ''
                          }`}
                        onClick={() => handleTabClick('Approved')}
                      >
                        <FontAwesomeIcon icon={faLineChart} /> &nbsp; Ongoing
                      </button>
                    </>
                  )}
                </div>
                <div className='flex md:mt-0'>
                  <select
                    onChange={(e) => {
                      setSelectedCondition(e.target.value);
                      fetchMembersByCondition(e.target.value);
                    }}
                    value={selectedCondition}
                    className='w-full hover:bg-purple-400 px-3 py-2 text-sm font-medium'
                  >
                    <option value=''>All Conditions</option>
                    {allConditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </nav>
          <div className='bg-white p-4 md:mr-1'>
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
              {currentMembers.length > 0 ? (
                currentMembers.map((member) => (
                  <div
                    style={{ height: '490px' }}
                    key={member._id}
                    className='bg-white c-card rounded-lg shadow-md p-4 flex flex-column justify-between'
                  >
                    <div className='position-relative'>
                      <img
                        src={member.imageOrVideo}
                        alt='Member'
                        className='w-full c-image object-cover rounded-lg h-40 sm:h-60 md:h-72'
                      />
                    </div>
                    <div className='flex flex-column justify-between h-100'>
                      <h2 className='text-xl font-bold text-mid mt-2'>
                        {member.title}
                      </h2>
                      <p
                        style={{ height: 0 }}
                        className='text-gray-700 text-sm mb-2'
                      >
                        {trimText(member.description, 60)}
                      </p>
                      <div className='mt-3'>
                        <p className='text-gray-600 text-xs mb-2'>
                          {member.lastDonationTime}
                        </p>
                        <p style={{ fontSize: '13px' }}>
                          {' '}
                          {member.sponsor
                            ? member.sponsor
                            : member?._user.name}
                        </p>
                      </div>
                      <div className='mt-1'>
                        <div className='bg-gray-200 rounded-lg h-2 mb-2 progress'>
                          <div
                            className='bg-purple-400 progress-bar rounded-lg'
                            style={{
                              width: `${(member.amountGotten / member.raise) * 100
                                }%`,
                            }}
                          ></div>
                        </div>
                        <div className='flex justify-between'>
                          <div className='text-left'>
                            <span className='cap-amt text-mid amm'>
                              N{member.amountGotten.toLocaleString()}
                            </span>
                            <br />
                            <span className='text-red-500 font-bold'>
                              Raised
                            </span>
                          </div>
                          <div className='text-right'>
                            <span className='cap-amt text-right amm'>
                              N{member.raise.toLocaleString()}
                            </span>
                            <br />
                            <span className='text-green-600 font-bold text-right'>
                              Goal
                            </span>
                          </div>
                        </div>
                      </div>
                      {member.status === 'Pending' && (
                        <Link to={`/review?id=${member._id}`}>
                          <button className='cap-btn text-sm font-bold py-2 px-4 rounded-full mt-2 w-full'>
                            View
                          </button>
                        </Link>
                      )}
                      {member.status === 'Approved' && (
                        <Link to={`/view?id=${member._id}`}>
                          <button className='cap-btn text-sm font-bold py-2 px-4 rounded-full mt-2 w-full'>
                            View
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{ textAlign: 'center' }}
                  className='text-center w-100'
                >
                  No Members Available
                </div>
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className='flex bg-gray-200 justify-end mt-4 mr-5'>
              <button
                className='pagination-btn'
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`page-link ${index + 1 === currentPage
                    ? 'main-bg '
                    : 'bg-gray-200 text-gray-700'
                    }w-8 h-8 mx-2 focus:outline-none text-black`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className='pagination-btn mr-2'
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMembers

import React, { useState, useEffect, useRef } from 'react'
import header from './Components/Assets/login-image.jpeg'
import logo from './Components/Members/fundezer-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilter,
  faAngleLeft,
  faAngleRight,
  faBars,
  faMagnifyingGlass,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import PopupModal from './Components/Modal/PopupModal'
import Skeleton from 'react-loading-skeleton'
import { checkInternetConnection } from './lib/network'
import { AuthContext } from './context/AuthContext'
import { getMemberByStatus, getAllMembers } from './lib/fetch'
import { useContext } from 'react'
import landing from './Components/Assets/landing-image.jpeg'
import { sponsorSignup, signup } from './lib/fetch'
// import Loading from '../../Modal/Loading'
import Loading from './Components/Modal/Loading'


const Layout = () => {
  const [memberData, setMemberData] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [TotalDonation, setTotalDonation] = useState(0)
  const [memberId, setMemberId] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [dataName, setDataName] = useState('All Members')
  const [condition, setCondition] = useState('')

  const [isLoading, setIsLoading] = useState([]);

  const authCtx = useContext(AuthContext)
  const [status, setStatus] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const [remainingDays, setRemainingDays] = useState(0)
  const [remainingDaysList, setRemainingDaysList] = useState([])

  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }

  const handleConditionInput = (data) => {
    setIsLoading(true)
    setCondition(data)
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

        let response = await getAllMembers(authCtx.token)

        if (condition) {
          setIsLoading(true)
          response = await getMemberByStatus(condition, authCtx.token)
        }
        if (condition === '') {
          response = await getAllMembers(authCtx.token)
        }

        if (response.success === true) {
          const data = await response.data
          setMemberData(data)
          setTotalDonation(data.amountDonated)
          setTimeout(() => setIsLoading(false), 3000)
          handleFilterChange(data)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          console.error('Failed to fetch member data')
          alert('Failed to fetch member data')
        }
      } catch (error) {
        console.error('Error:', error)
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMemberData()
  }, [authCtx.token, condition])

  let navigate = useNavigate()

  const handleCreate = async () => {
    navigate('/create')
  }

  const handleFilterChange = (filteredData) => {
    setFilteredMembers(filteredData)
  }

  const ref = useRef(null)

  const membersPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredMembers, setFilteredMembers] = useState([])

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    const calculateRemainingDays = () => {
      const currentDate = new Date()

      const updatedMemberData = memberData.map((member) => {
        const endDate = new Date(member.endDate)
        const timeDifference = endDate - currentDate
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        )
        return {
          ...member,
          remainingDays: daysDifference,
        }
      })

      setRemainingDaysList(updatedMemberData)
    }

    if (memberData.length > 0) {
      calculateRemainingDays()
    }
  }, [memberData])

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    console.log(isMenuOpen)
  }

  const handleCloseMenu = () => {
    if (!ref.current) {
      setIsMenuOpen(false)
    }
  }





  return (
    <div className='body' ref={ref}>
      {/* Navbar */}
      <nav className='relative flex items-center justify-between main-bg p-2'>
        <div className='flex items-center'>
          <img src={logo} alt='Logo' />
        </div>

        <div className='hidden md:flex items-center'>
          <a href='fundezer.org/about' className='text-white font-bold px-4'>
            About Us
          </a>
          <a href='fundezer.org/faq' className='text-white font-bold px-4'>
            FAQ
          </a>
          <a href='/members' className='text-white font-bold px-4'>
            Donate
          </a>
          <button
            onClick={() => navigate('/login')}
            className='bg-white text-black font-bold px-4 py-2 rounded-full'
          >
            Login
          </button>
        </div>

        <div className='flex items-center md:hidden'>
          <FontAwesomeIcon
            icon={faBars}
            className='text-white text-2xl cursor-pointer'
            onClick={handleToggleMenu}
          />
        </div>

        {isMenuOpen && (
          <div
            style={{ height: 360, zIndex: 4 }}
            className='fixed top-0 left-0 z-40 main-bg md:hidden w-full'
          >
            <div className='w-4 ml-auto pt-3 mr-4'>
              <FontAwesomeIcon
                icon={faTimes}
                className='text-white text-3xl cursor-pointer'
                onClick={handleToggleMenu}
              />
            </div>

            <div className='flex flex-col justify-center items-center h-full'>
              <a
                href='https://www.fundezer.org/about'
                className='text-white font-bold py-4'
              >
                About Us
              </a>
              <a
                href='https://www.fundezer.org/faq'
                className='text-white font-bold py-4'
              >
                FAQ
              </a>
              <a href='/member' className='text-white font-bold py-4'>
                Donate
              </a>
              <NavLink to='/login'>
                <button className='bg-white text-black font-bold px-4 py-2 rounded-full my-4'>
                  Login
                </button>
              </NavLink>

            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className='hero-section relative h-80' onClick={handleCloseMenu}>
        {/* Add the overlay that covers the whole hero section */}
        <div
          style={{ zIndex: -2 }}
          className='absolute inset-0 bg-black bg-opacity-25'
        >
          <img
            src={header}
            alt='Hero Background'
            className='hero-image object-cover rounded bg-black bg-opacity-25'
          />
          <div className='image-overlay'></div>
          <br />
          <div className='flex justify-center items-center p-6'>
            <div>
              <h1
                style={{ textAlign: 'center', fontSize: '48px' }}
                className='lp-header'
              >
                Donate <span className='lp-header-span'>to FundEzer</span>
              </h1>
              <p className='text-center'>
                With every single donation you make, you're saving and changing
                lives.
                <br />
                All committees will be used in settling open members
              </p>
            </div>
          </div>

          <br />
          <div>
            <div className='bg-white rounded-md p-8'>
              <div className='bg-white rounded-md p-4'>
                <div className='flex items-center mb-4 md:mb-0'>
                  <FontAwesomeIcon
                    icon={faFilter}
                    className='text-black text-2xl'
                  />{' '}
                  <p className='hidden md:block'>Filter</p>
                </div>
                <div className='flex flex-col md:flex-row md:items-center mb-4 md:mb-0'>
                  {/* Left Section */}
                  <div className='w-full md:w-3/4 md:pr-4 flex flex-col md:flex-row md:items-center'>
                    <div className='w-full md:w-1/3 mb-2 md:mr-2'>
                      <select
                        id='category'
                        className='block select-lp px-4 py-2 rounded-full focus:outline-none focus:border-blue-500 md:align-middle'
                      >
                        <option>Cancer</option>
                        <option>Diabetes</option>
                        <option>Blood Transfusion</option>
                        <option>Others</option>
                      </select>
                    </div>

                    <div className='w-full md:w-1/3 mb-2 md:mr-2'>
                      <select
                        id='conditions'
                        className='block select-lp px-4 py-2 rounded-full focus:outline-none focus:border-blue-500 md:align-middle'
                      >
                        <option>Cancer</option>
                        <option>Diabetes</option>
                        <option>Blood Transfusion</option>
                        <option>Others</option>
                      </select>
                    </div>

                    <div className='w-full mb-2 md:w-1/3'>
                      <select
                        id='date'
                        className='block select-lp px-4 py-2 rounded-full focus:outline-none focus:border-blue-500 md:align-middle'
                      >
                        <option>Days</option>
                        <option>3 days</option>
                        <option>1 day</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className='w-full md:w-1/2'>
                    <div className='relative mb-2'>
                      <input
                        type='text'
                        placeholder='Search...'
                        className='pl-8 pr-16 py-2 rounded-full border border-black focus:outline-none focus:border-blue-500 w-full'
                      />
                      <span className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          className='text-lg mr-2'
                        />
                      </span>
                      <button className='absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 main-bg text-white rounded-full'>
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* Pagination Controls */}

              {/* Display member data or loading skeleton */}
              <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {isLoading
                  ? Array.from({ length: membersPerPage }).map((_, index) => (
                    <div
                      key={index}
                      className='bg-white c-card rounded-lg shadow-md p-4'
                    >
                      <Skeleton height={200} />
                      <Skeleton height={20} width={150} className='my-2' />
                      <Skeleton height={60} />
                      <Skeleton height={10} width={100} className='mb-4' />
                      <Skeleton height={10} width={100} className='mb-2' />
                      <Skeleton height={10} width={100} className='mb-4' />
                      <div className='bg-gray-200 rounded-lg h-2 mb-4 progress'>
                        <div
                          className='bg-green-500 rounded-lg'
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                      <div className='flex justify-between'>
                        <div className='text-sm'>
                          <Skeleton height={20} width={60} className='amm' />
                          <br />
                          <Skeleton
                            height={10}
                            width={100}
                            className='text-red-500'
                          />
                        </div>
                        <div className='text-right'>
                          <Skeleton height={20} width={60} className='amm' />
                          <br />
                          <Skeleton
                            height={10}
                            width={100}
                            className='text-green-600 font-bold'
                          />
                        </div>
                      </div>
                      <div className='cap-btn text-sm font-bold py-2 px-4 rounded-full mt-4 w-full'>
                        <Skeleton height={30} width={100} />
                      </div>
                    </div>
                  ))
                  : filteredMembers
                    .slice(
                      (currentPage - 1) * membersPerPage,
                      currentPage * membersPerPage
                    )
                    .map((member, index) => (
                      <div
                        style={{ height: '460px' }}
                        key={member._id}
                        className='bg-white c-card rounded-lg shadow-md p-4 flex flex-column m-4 justify-between'
                      >
                        <div className='position-relative'>
                          <img
                            src={member.imageOrVideo}
                            alt='Member'
                            className='w-full c-image object-cover rounded-lg h-40 sm:h-60 md:h-72'
                          />
                          {/* <p
                          style={{ backgroundColor: 'grey' }}
                          className='position-absolute top-10 end-0 text-white py-2 px-4 rounded-full'
                        >
                          {remainingDays} Days Left
                        </p> */}
                        </div>
                        <div className='flex flex-column justify-between h-100'>
                          <h2 className='text-xl font-bold text-mid mt-2'>
                            {member.title}
                          </h2>
                          <p
                            style={{ height: 20 }}
                            className='text-gray-700 text-sm mb-2'
                          >
                            {member.description}
                          </p>
                          <div className='mt-3'>
                            <p className='text-gray-600 text-xs mb-2'>
                              {member.lastDonationTime}
                            </p>
                            <p style={{ fontSize: '13px' }}>
                              {' '}
                              {member?.sponsor
                                ? member?.sponsor
                                : member?._user?.name}
                            </p>
                          </div>
                          <div className='mt-1'>
                            <div
                              className='bg-gray-200 rounded-lg h-2 mb-2 progress'
                              role='progressbar'
                              aria-label='Basic example'
                              aria-valuenow={`${(member.amountGotten / member.raise) * 100
                                }`}
                              aria-valuemin='0'
                              aria-valuemax='100'
                            >
                              <div
                                className='bg-purple-400 progress-bar rounded-lg'
                                style={{
                                  width: `${(member.amountGotten / member.raise) *
                                    100
                                    }%`,
                                }}
                              ></div>
                            </div>
                            <div className='flex justify-between'>
                              <div className='text-sm'>
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
                          <Link to={`/view?id=${member._id}`}>
                            <button className='cap-btn text-sm font-bold py-2 px-4 rounded-full w-full'>
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div className='flex justify-center mt-4'>
            <button
              className='pagination-btn'
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div className='pagination-list'>
              {Array.from({
                length: Math.ceil(filteredMembers.length / membersPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  className={`pagination-number ${currentPage === index + 1 ? 'active' : ''
                    }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              className='pagination-btn'
              onClick={() => paginate(currentPage + 1)}
              disabled={
                filteredMembers.slice(
                  currentPage * membersPerPage,
                  (currentPage + 1) * membersPerPage
                ).length < membersPerPage
              }
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          <br />
          <div className='flex flex-col md:flex-row'>
            {/* Left Section */}
            <div className='flex-shrink-0'>
              <img
                src={landing}
                alt='Image'
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>

            {/* Right Section */}
            <div className='flex-grow p-4 rounded-lg mt-4 md:mt-0 md:ml-4'>
              <h2 className='text-2xl font-bold mb-2'>
                Create Your own Member
              </h2>
              <p className='text-gray-700 mb-4'>
                Are you an an individual, sponsor or Charity, you can create an
                account with us and start members for your fundraising goals.
              </p>
              <button
                onClick={() => navigate('/signup')}
                className='main-bg text-white py-2 px-4 rounded-full'
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* "Fundezer" text inside the overlay */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <h1 className='text-white text-6xl text-center font-bold'>
            Welcome to Fundezer
          </h1>
          <p className='text-white text-center text-xl'>
            Funding Treatments Through your support
          </p>
        </div>
      </div>

      {/* Rounded background texts */}
      <div
        style={{ zIndex: -2 }}
        className='absolute inset-0 flex items-center justify-center'
      >
        <div>
          <div className='flex flex-wrap justify-center md:mt-30 mt-80'>
            <div className='text-black p-2 rounded-full bg-white m-2 mt-24'>
              Create Members
            </div>
            <div className='text-black p-2 rounded-full bg-white m-2'>
              Donate to cases
            </div>
            <div className='text-black p-2 rounded-full bg-white m-2'>
              Anonymous Donation
            </div>
            <div className='text-black p-2 rounded-full bg-white m-2'>
              Withdraw Funds
            </div>
          </div>
          <div className='flex flex-wrap justify-center'>
            <div className='text-black p-2 rounded-full bg-white m-2'>
              Re-occurring Donation
            </div>
            <div className='text-black p-2 rounded-full bg-white m-2'>
              Low platform Fee
            </div>
            <div className='text-black p-2 rounded-full bg-white m-2'>
              Track Members
            </div>
            <div className='text-black p-2 rounded-full bg-white m-2 mb-24'>
              Appreciate donors
            </div>
          </div>
          <br />
          <br />
          <div className='flex justify-center'>
            <button
              onClick={() => navigate('/signup')}
              className='main-bg rounded-full w-64 p-3 font-bold text-white'
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;

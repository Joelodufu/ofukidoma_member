import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import logo from './smaller-logo.png'
import Skeleton from 'react-loading-skeleton'
import { getSingleUser } from '../../lib/fetch'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import constants from '../../lib/config'
const Navbar = ({ style }) => {
  const [profileData, setProfileData] = useState(null)
  const authCtx = useContext(AuthContext)
  const name = authCtx.userInfo.name
  const nameParts = name.split(' ')
  const firstName = nameParts.length > 0 ? nameParts[0] : ''
  const isSmallScreen = window.innerWidth <= 768
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const route = window.location.pathname
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const apiUrl = constants.apiUrl

  const fetchMembersByCondition = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(
        `${apiUrl}/api/v1/member/member`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      )
      const data = await response.json()

      if (response.ok) {
        setIsLoading(false)
        setMembers(data.data)
      } else {
        console.error('Failed to fetch members:', data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const displayCurrentPage = () => {

    const splitRoute = route.split('/')

    const currentRoute = splitRoute[splitRoute.length - 1]

    if (currentRoute == 'dashboard') {
      setCurrentPage('DashBoard')
    }
    else if (currentRoute == 'members') {
      setCurrentPage('Member')
    }
    else if (currentRoute == 'committees') {
      setCurrentPage('Donations')
    }
    else if (currentRoute == 'projects') {
      setCurrentPage('Cases')
    }
    else if (currentRoute == 'profile') {
      setCurrentPage('Profile')
    }
  }

  useEffect(() => {
    displayCurrentPage()
  }, [route])


  const closeSearch = () => {
    setShowSearch(false)
    setSearchQuery('')
  }


  return (
    <nav
      style={style}
      className='bg-white h-16 flex flex-wrap md:flex-nowrap items-center justify-between px-4'
    >
      {/* Logo */}
      <div className='flex items-center'>
        {/* Add your logo component or image here */}
        <Link to={'/dashboard'} className='text-xl font-bold'>
          <img src={logo} alt='Logo' />
        </Link>
      </div>

      {authCtx.userInfo.userType == 'Admin' &&
        <div className='ml-20 h-16 relative pt-3 md:block hidden'>
          <input placeholder='Search by id' className='border rounded-md border-[#57535d] p-2 focus:border-[#9968d1] focus:outline-none focus:ring'
            value={searchQuery}
            onFocus={() => setShowSearch(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className={`absolute bottom-[-210px] rounded-lg text-center h-56 w-72 text-black bg-white border-2 border-[#9968d1] z-40 ${showSearch ? 'block' : 'hidden'}`}>
            <div className='ml-auto w-full flex justify-end pr-3 pt-3'>
              <FontAwesomeIcon icon={faXmarkCircle} onClick={() => closeSearch()} /> &nbsp;
            </div>
            {searchQuery.length < 5 ? <h1 className='mt-10'>Paste member id to search</h1> :
              members.length !== 0 && members.filter((member) => {
                return searchQuery == member.id
              }).map((member, i) => (
                <Link to={`/view?id=${member._id}`} key={i}>
                  <div onClick={() => setShowSearch(false)} className='mt-10 mx-4 bg-[#9968d1] text-white py-2 px-3'>
                    <h1>{member.title} member</h1>
                  </div>
                </Link>
              ))
            }
            {
              members.length !== 0 && searchQuery.length > 5 && members.filter((member) => {
                return searchQuery == member.id
              }) == false &&
              <h1>Sorry, no matching member</h1>
            }
            {
              isLoading && searchQuery.length > 5 && <h1 className='mt-10'>Loading...</h1>
            }
            {searchQuery.length > 10 && <div className='flex justify-center mt-4'>
              <button className='bg-[#9968d1] text-white py-1 px-2 rounded-md disabled:bg-white/40'
                onClick={() => fetchMembersByCondition()}
              >
                Search
              </button>
            </div>}
          </div>
        </div>
      }

      {/* Search Bar */}
      {!isSmallScreen && (
        <div className='flex items-center justify-center flex-grow w-full md:w-auto'>
          <div className='relative flex items-center'>
            <h1>{currentPage}</h1>
          </div>
        </div>
      )}

      {/* Profile Photo */}
      <div className='flex items-center font-bold'>
        {firstName ? (
          <div className='flex items-center'>
            <div className='flex flex-col items-end'>
              <span
                className='overflow-hidden whitespace-nowrap max-w-full'
                style={{ fontSize: '1rem' }} // You can adjust the font size as needed
              >
                {firstName?.charAt(0).toUpperCase() +
                  firstName?.slice(1).toLowerCase()}
              </span>
              <span className='text-[9px] text-grey' >{authCtx.userInfo.userType}</span>
            </div>
            {/* Add your profile photo or avatar component here */}
            &nbsp;
            <Link to='/profile'>
              <div className='w-10 h-10 bg-gray-300 rounded-full ml-4'>
                <img
                  src={
                    authCtx?.userInfo?.image?.[0] ||
                    process.env.REACT_APP_USER_DEFAULT_IMAGE
                  }
                  alt={firstName}
                  className='w-100 h-100 rounded-full'
                />
              </div>
            </Link>
          </div>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar

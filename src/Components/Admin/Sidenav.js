import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faXmarkCircle
} from '@fortawesome/free-solid-svg-icons';
import { NavLink, Link } from 'react-router-dom';
import Loading from '../Modal/Loading';
import { AuthContext } from '../../context/AuthContext';
import { userLogOut } from '../../lib/fetch';
import { ReactComponent as Notification } from '../Assets/notification-status.svg'
import { ReactComponent as Health } from '../Assets/health.svg'
import { ReactComponent as User } from '../Assets/security-user.svg'
import { ReactComponent as Wallet } from '../Assets/empty-wallet-add.svg'
import { ReactComponent as People } from '../Assets/people.svg'
// import row from '../Assets/row-vertical.svg'

import { ReactComponent as Row } from '../Assets/row-vertical.svg'


import LogoutModal from '../Modal/LogoutModal';

const MembersNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false)

  const authCtx = useContext(AuthContext);

  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMembersByCondition = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(
        `https://fundezer-api.onrender.com/api/v1/member/member`,
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

  const closeSearch = () => {
    setShowSearch(false)
    setSearchQuery('')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogoutModal = () => {
    setLogoutModal(!logoutModal)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await userLogOut();
      if (response.success) {
        await authCtx.logout()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // if (isLoggingOut) {
  //   return <Loading isLoggin={isLoggingOut} color={'white'} />;
  // }

  function handleActiveStatus({ isActive }) {
    return {
      backgroundColor: isActive ? '#9968D1' : '',
      color: isActive ? 'white' : '',
    };
  }


  return (
    <div className='flex flex-col md:flex-row'>
      {/* Sidebar */}
      {isLoggingOut && <Loading isLoggin={isLoggingOut} color={'white'} />}
      <div
        className={`md:w-64 bg-white text-gray-100 ${isSidebarOpen ? 'w-64' : 'w-0'
          } md:block fixed z-20 top-0 left-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out md:static md:h-auto`}
      >
        <div className='flex items-center justify-between'>
          {/* Logo */}
          {/* Toggle Button */}
          <button
            className='focus:outline-none md:hidden'
            onClick={toggleSidebar}
            aria-label='Toggle Sidebar'
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className='w-6 h-6'
            />
          </button>
        </div>
        <div className='flex flex-column justify-between h-auto'>

          <nav className='py-4'>
            {authCtx.userInfo.userType == 'Admin' &&
              <div className='h-16 relative pt-3 pl-6'>
                <input placeholder='Search by id' className='border rounded-md border-[#57535d] p-2 focus:border-[#9968d1] text-black focus:outline-none focus:ring'
                  value={searchQuery}
                  onFocus={() => setShowSearch(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className={`fixed z-50 top-30 rounded-lg text-center h-56 w-72 text-black bg-white border-2 border-[#9968d1] z-40 ${showSearch ? 'block' : 'hidden'}`}>
                  <div className='ml-auto w-full flex justify-end pr-3 pt-3'>
                    <FontAwesomeIcon icon={faXmarkCircle} className='text-xl' onClick={() => closeSearch()} /> &nbsp;
                  </div>
                  {searchQuery.length < 5 ? <h1 className='mt-10'>Paste member id to search</h1> :
                    members.length !== 0 && members.filter((member) => {
                      return searchQuery == member.id
                    }).map((member, i) => (
                      <Link to={`/review?id=${member._id}`} key={i}>
                        <div onClick={() => setShowSearch(false)} className='mt-10 mx-4 bg-[#9968d1] text-white py-2 px-3'>
                          <h1>{member.title} compaign</h1>
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
              </div>}


            <ul>

              {/* Sidebar links */}
              <li className='px-6 py-3'>
                <NavLink
                  exact
                  to='/server'
                  className='block p-3 nav-bg rounded text-black font-bold flex'
                  activeClassName='nav-active'
                >
                  <Row />
                  <span className='ml-1'>Dashboard</span>
                </NavLink>
              </li>
              <li className='px-6 py-3'>
                <NavLink
                  exact
                  to='/users'
                  className='block p-3 nav-bg rounded text-black font-bold flex'
                  activeClassName='nav-active'
                >
                  <People />
                  <span className='ml-1'>Users</span>
                </NavLink>
              </li>
              <li className='px-6 py-3'>
                <NavLink
                  exact
                  to='/server-camp'
                  className='block p-3 nav-bg rounded text-black font-bold flex'
                  activeClassName='nav-active'
                >
                  <Notification />

                  <span className='ml-1'>Members</span>
                </NavLink>
              </li>
              <li className='px-6 py-3'>
                <NavLink
                  exact
                  to='/admin-don'
                  className='block p-3 nav-bg rounded text-black font-bold flex'
                  activeClassName='nav-active'
                >
                  <Wallet />
                  <span className='ml-1'>Donations</span>
                </NavLink>
              </li>
              <li className='px-6 py-3'>
                <NavLink
                  exact
                  to='/server-projects'
                  className='block p-3 nav-bg rounded account-link text-black font-bold flex'
                  activeClassName='nav-active'
                >
                  <Health />
                  <span className='ml-1'>Cases</span>
                </NavLink>
              </li>

              <li className='px-6 py-3'>
                <NavLink
                  exact
                  to='/admin-profile'
                  className='block p-3 nav-bg rounded account-link text-black font-bold flex'
                  activeClassName='nav-active'
                >
                  <User />
                  <span className='ml-1'>Account</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className='px-6 py-3'>
            <button
              onClick={handleLogout}
              className='block p-3 nav-bg rounded account-link text-black font-bold flex'
            >
              <Row />
              <span className='ml-1'>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''}`}>
        {/* Top Navbar */}
        <div className='h-16 flex items-center justify-between px-4'>
          {logoutModal && (
            <LogoutModal
              handleLogout={handleLogout}
              onClose={handleLogoutModal}
            />
          )}
          {/* Menu Button */}
          <button
            className='focus:outline-none md:hidden p-2 mt-5 rounded text-black font-bold'
            onClick={toggleSidebar}
            aria-label='Toggle Sidebar'
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? faTimes : faBars}
              className='w-6 h-6'
            />
          </button>

          {/* ... (Existing code) */}
        </div>

        {/* Main Content */}
        <div className=''>{/* Content goes here */}</div>
      </div>
    </div>
  )
};

export default MembersNav;

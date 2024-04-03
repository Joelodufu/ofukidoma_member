import React, { useContext } from 'react'
import Navbar from '../Members/topNavbar'
import { range } from 'lodash'
import { useState, useEffect } from 'react'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AuthContext } from '../../context/AuthContext'
import Skeleton from 'react-loading-skeleton'
import { getAllMembers, getAllDonations } from '../../lib/fetch'
import SideNav from './Sidenav'

export default function AdminDonations() {
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const authCtx = useContext(AuthContext)

  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const response = await getAllMembers(authCtx.token)

        if (response.success === true) {
          console.log(response.data)
          setMembers(response.data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllMembers()
  }, [authCtx.token])

  const pageSize = 5
  const totalItems = members.length // Update totalItems with the actual data length
  const totalPages = Math.ceil(totalItems / pageSize)
  const [TotalDonation, setTotalDonation] = useState('')
  const [DonationAmount, setDonationAmount] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const generateHistoryEntries = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    return members.slice(startIndex, endIndex).map((member) => {
      return {
        id: member._id,
        memberName: member?._user?.name,
        event: member.title,
        date: new Date().toLocaleDateString(),
        raised: member.amountGotten,
        goal: member.raise,
      }
    })
  }

  const historyEntries = generateHistoryEntries()

  console.log(historyEntries)

  // useEffect(() => {
  //   const fetchTotalDonation = async () => {
  //     const userId = localStorage.getItem('userId')

  //     try {
  //       const response = await fetch(
  //         `https://fundezer-api.onrender.com/api/v1/donation/total/${userId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${authCtx.token}`,
  //           },
  //         }
  //       )
  //       if (response.ok) {
  //         const data = await response.json()
  //         // setTotalDonation(data)
  //       } else {
  //         console.error('Failed to fetch profile data')
  //       }
  //     } catch (error) {
  //       console.error('Error:', error)
  //     }
  //   }

  //   fetchTotalDonation()
  // }, [])


  useEffect(() => {
    const fetchAllDonation = async () => {
      try {
        const response = await getAllDonations(authCtx.token)

        console.log(response.committees)
        const userDonations = response.committees.filter(donation => {
          return donation.amount && donation.isVerified
        })
        const allAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0)
        console.log(allAmount)
        setTotalDonation(allAmount)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllDonation()
  }, [])

  useEffect(() => {
    const fetchDonationAmount = async () => {
      const userId = localStorage.getItem('userId')

      try {
        const response = await fetch(
          `https://fundezer-api.onrender.com/api/v1/donation/getdonation/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setDonationAmount(data)
        } else {
          console.error('Failed to fetch donation amount')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchDonationAmount()
  }, [])


  if (isLoading || !historyEntries.length) {
    return (
      <>
        <Navbar
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
        />
        <div className='flex flex-col whole-bg md:flex-row mt-5'>
          <SideNav className='md:w-1/4 md:mr-0' />
          <div className='whole-bg flex-grow'>
            <div className='pt-5 pr-5 pl-5 mb-5'>
              <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Donations</h1>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                <div className='bg-white rounded p-4'>
                  <h2 className='d-amount'>
                    <Skeleton />
                  </h2>
                  <p className='d-head text-purple-500'>
                    <Skeleton />
                  </p>
                </div>

                <div className='bg-white rounded p-4'>
                  <h2 className='d-amount'>
                    <Skeleton />
                  </h2>
                  <p className='d-head text-green-500'>
                    <Skeleton />
                  </p>
                </div>

                <div className='bg-white rounded p-4'>
                  <h2 className='d-amount'>
                    <Skeleton />
                  </h2>
                  <p className='d-head text-red-500'>
                    <Skeleton />
                  </p>
                </div>
              </div>

              <div className='mt-4'>
                <div className='relative'>
                  <select className='pl-8 text-gray-500 pr-4 py-2 border bg-white rounded-md focus:outline-none'>
                    <option>This month</option>
                    <option>January</option>
                    <option>February</option>
                  </select>
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
                  />
                </div>
              </div>

              <div className='bg-white p-4 mt-4'>
                <div className='text-xl font-bold mb-4'>Recent Activities</div>

                <div className='overflow-x-auto'>
                  <table className='min-w-full border'>
                    <thead>
                      <tr className='border-b'>
                        <th className='py-2 px-4'>Donor</th>
                        <th className='py-2 px-4'>Member Name</th>
                        <th className='py-2 px-4'>Amount</th>
                        <th className='py-2 px-4'>Date</th>
                        <th className='py-2 px-4'>Raised</th>
                        <th className='py-2 px-4'>Goal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(pageSize)].map((_, index) => (
                        <tr key={index} className='border-b'>
                          <td className='py-2 px-4'>
                            <Skeleton />
                          </td>
                          <td className='py-2 px-4'>
                            <Skeleton />
                          </td>
                          <td className='py-2 px-4'>
                            <Skeleton />
                          </td>
                          <td className='py-2 px-4'>
                            <Skeleton />
                          </td>
                          <td className='py-2 px-4'>
                            <Skeleton />
                          </td>
                          <td className='py-2 px-4'>
                            <Skeleton />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {historyEntries.length === 0 && (
                  <p className='text-center mt-4 text-gray-500'>
                    No data available
                  </p>
                )}

                <div className='flex bg-gray-200 justify-end mt-4'>
                  {range(1, totalPages + 1).map((page) => (
                    <button
                      key={page}
                      className={`${currentPage === page
                        ? 'main-bg text-white'
                        : 'bg-gray-200 text-gray-700'
                        } w-8 h-8 mx-1 focus:outline-none`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className='flex flex-col whole-bg md:flex-row mt-5'>
        <SideNav className='md:w-1/4 md:mr-0' />
        <div className='whole-bg flex-grow'>
          <div className='pt-5 pr-5 pl-5'>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-bold'>Donations</h1>
              <button className='main-bg text-white font-bold py-2 px-4 rounded'>
                Withdraw funds
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
              <div className='bg-white rounded p-4'>
                <h2 className='d-amount'>
                  N
                  {TotalDonation ? (
                    TotalDonation.toLocaleString()
                  ) : (
                    <h2 className='d-amount'>N0</h2>
                  )}
                </h2>
                <p className='d-head text-purple-500'>Current Balance</p>
              </div>

              <div className='bg-white rounded p-4'>
                <h2 className='d-amount'>
                  N
                  {TotalDonation ? (
                    TotalDonation.toLocaleString()
                  ) : (
                    <h2 className='d-amount'>N0</h2>
                  )}
                </h2>
                <p className='d-head text-green-500'>Total Donation Received</p>
              </div>

              <div className='bg-white rounded p-4'>
                <h2 className='d-amount'>
                  N{TotalDonation ? (
                    TotalDonation.toLocaleString()
                  ) : (
                    <h2 className='d-amount'>N0</h2>
                  )}
                </h2>
                <p className='d-head text-red-500'>Total Donation Given</p>
              </div>
            </div>

            <div className='mt-4'>
              <div className='relative'>
                <select className='pl-8 text-gray-500 pr-4 py-2 border bg-white rounded-md focus:outline-none'>
                  <option>This month</option>
                  <option>January</option>
                  <option>February</option>
                </select>
                <FontAwesomeIcon
                  icon={faChartLine}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
                />
              </div>
            </div>

            <div className='bg-white p-4 mt-4 mb-5'>
              <div className='text-xl font-bold mb-4'>Recent Activities</div>

              <div className='overflow-x-auto'>
                <table className='min-w-full border'>
                  <thead>
                    <tr className='border-b'>
                      <th className='py-2 px-4'>Sponsor</th>
                      <th className='py-2 px-4'>Member</th>
                      <th className='py-2 px-4'>Date</th>
                      <th className='py-2 px-4'>Raised</th>
                      <th className='py-2 px-4'>Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyEntries.map((entry) => (
                      <tr key={entry.id} className='border-b'>
                        <td className='py-2 px-4'>{entry.memberName}</td>
                        <td className='py-2 px-4'>{entry.event}</td>
                        <td className='py-2 px-4'>{entry.date}</td>
                        <td className='py-2 px-4'>{entry.raised}</td>
                        <td className='py-2 px-4'>{entry.goal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='flex bg-gray-200 justify-end mt-4'>
                {range(1, totalPages + 1).map((page) => (
                  <button
                    key={page}
                    className={`${currentPage === page
                      ? 'main-bg text-white'
                      : 'bg-gray-200 text-gray-700'
                      } w-8 h-8 mx-1 focus:outline-none`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

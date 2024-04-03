import React, { useContext } from 'react'
import Chart from 'react-apexcharts'
// import History from './History';
import Navbar from '../Members/topNavbar'
import SideNav from './Sidenav'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'
import { range } from 'lodash'
import { AuthContext } from '../../context/AuthContext'
import Skeleton from 'react-loading-skeleton'
import { useErrorBoundary } from 'react-error-boundary'
import constants from '../../lib/config'
const apiUrl = constants.apiUrl

const AdminDashboard = () => {
  const totalMembers = 253
  const ongoingMembers = 25
  const pendingMembers = 10
  const closedMembers = 15

  const [DonationsData, setDonationsData] = useState(null)
  const [DonationsLen, setDonationsLen] = useState('')
  const [totalAmount, setTotalAmount] = useState(0)
  const [members, setMembers] = useState([])

  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [isLoadingDonations, setIsLoadingDonations] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  // const { handleError } = useErrorBoundary()

  const authCtx = useContext(AuthContext)

  const graphData = {
    options: {
      chart: {
        id: 'fundraising-graph',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
    },
    series: [
      {
        name: 'Funds Raised',
        data: [2000, 3000, 5000, 4000, 6000, 5500],
      },
    ],
  }
  useEffect(() => {
    const fetchDonationsData = async () => {
      setIsLoadingMembers(true)
      setIsLoadingHistory(true)
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/member/getmembers`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          setMembers(data.data)
        } else {
          console.error('Failed to fetch member data')
        }
      } catch (error) {

        console.error('Error:', error)
      } finally {
        setIsLoadingMembers(false)
        setIsLoadingHistory(false)
      }
    }

    fetchDonationsData()
  }, [authCtx.token])
  const pageSize = 5
  const totalItems = members.length
  const totalPages = Math.ceil(totalItems / pageSize)

  // State for current page
  const [currentPage, setCurrentPage] = useState(1)

  // Generate mock data for history entries
  const generateHistoryEntries = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    return members.slice(startIndex, endIndex).map((member) => {
      const startDate = new Date(member.startDate).toLocaleDateString()
      const todayDate = new Date(member.setDuration).toLocaleDateString()

      return {
        id: member._id,
        memberName: member?._user?.name,
        event: member.title,
        date: startDate,
        status: member.status,
      }
    })
  }

  // Get history entries for the current page
  const historyEntries = generateHistoryEntries()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingDonations(true)
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/donation/getcommittees`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          }
        )
        const data = await response.json()
        const committees = data.committees

        // let sum = 0
        const allDonation = committees.filter((donation) => {
          return donation.amount
        })
        setDonationsData(allDonation)
        const total = allDonation.reduce((sum, donation) => {
          return sum + donation.amount
        }, 0)

        setTotalAmount(total)
        // if (data && data.committees) {
        //   data.committees.forEach((donation) => {
        //     sum += donation.amount
        //   })
        // }

        // setTotalAmount(sum)
      } catch (error) {
        console.error('Error fetching donation data:', error)
      } finally {
        setIsLoadingDonations(false)
      }
    }

    fetchData()
  }, [authCtx.token])

  const pendingLength = members.filter((cam) => {
    return cam.status.includes('Pending')
  })
  const closedLength = members.filter((cam) => {
    return cam.status.includes('Closed')
  })
  const onGoingLength = members.filter((cam) => {
    return cam.status.includes('Approved')
  })

  return (
    <div>
      <Navbar
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className='flex flex-col whole-bg md:flex-row mt-5'>
        <SideNav className='' />
        <div className='flex-grow ml-10 md:ml-0 mt-5 md:mt-1 pr-10'>
          <h3 className='font-bold'>Dashboard</h3>
          <br />

          <div className='relative'>
            <select className='pl-8 text-gray-500 pr-4 py-2 bg-white rounded-md focus:outline-none'>
              <option>This month</option>
              <option>January</option>
              <option>February</option>
            </select>
            <FontAwesomeIcon
              icon={faChartLine}
              className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400'
            />
          </div>
          <br />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {isLoadingMembers ? (
              <div className='bg-white card p-2 rounded-lg'>
                <Skeleton height={50} className='my-3' count={2} />
              </div>
            ) : (
              <div className='bg-white card rounded-lg'>
                <div className='camp-header pl-4 mt-2'>Members</div>
                <div className='camp font-bold camp pl-5'>
                  {members.length ? members.length : 0}
                </div>
                <div className='flex justify-between mt-15 p-4'>
                  <div className=''>
                    <div className='camp-header'>Closed</div>
                    <div className='font-bold camp text-center'>
                      {closedLength.length ? closedLength.length : 0}
                    </div>
                  </div>
                  <div>
                    <div className='camp-header'>Ongoing</div>
                    <div className='font-bold camp text-center'>
                      {onGoingLength.length ? onGoingLength.length : 0}
                    </div>
                  </div>
                  <div>
                    <div className='camp-header'>Pending</div>
                    <div className='font-bold camp text-center'>
                      {pendingLength.length ? pendingLength.length : 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* ... */}

            <div>
              <div className='bg-white card rounded-lg'>
                <div className='p-2'>
                  <p className='font-bold'>Donations Received</p>
                  <p className='text-red-500 font-bold'>
                    {isLoadingDonations ? (
                      <Skeleton width={150} height={20} />
                    ) : totalAmount ? (
                      <p className='text-red-500 font-bold'>
                        #{totalAmount.toLocaleString()}
                      </p>
                    ) : (
                      <p>No data</p>
                    )}
                  </p>
                </div>
                <div className='cards flex justify-center'>
                  <Chart
                    options={graphData.options}
                    series={graphData.series}
                    type='line'
                    height={130}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg mt-4 mb-5'>
            {/* <div className="text-xl font-bold">History</div> */}
            <div className='p-4'>
              {/* Render history table */}
              <div className='m-4'>
                <div className='bg-white md:p-4'>
                  <div className='text-xl font-bold mb-4'>
                    Recent Activities
                  </div>

                  {/* Render history table */}
                  {isLoadingHistory ? (
                    <div className='overflow-x-auto'>
                      <Skeleton height={40} count={5} />
                    </div>
                  ) : (
                    <div className='overflow-x-auto'>
                      <table className='min-w-full border'>
                        <thead>
                          <tr className='border-b'>
                            <th className='py-2 px-4'>Event</th>
                            <th className='py-2 px-4'>Client Name</th>
                            <th className='py-2 px-4'>Role</th>
                            <th className='py-2 px-4'>Date</th>
                            <th className='py-2 px-4'>Status</th>{' '}
                            {/* Add new table header for status */}
                          </tr>
                        </thead>
                        <tbody>
                          {historyEntries.map((entry) => (
                            <tr key={entry.id} className='border-b'>
                              <td className='py-2 px-4'>{entry.event}</td>
                              <td className='py-2 px-4'>
                                {entry.memberName}
                              </td>
                              <td className='py-2 px-4'>{entry.id}</td>
                              <td className='py-2 px-4'>{entry.date}</td>
                              <td className='py-2 px-4'>
                                {entry.status === 'Approved' && (
                                  <button className='border border-green-500 text-green-500 px-2 py-1 rounded hover:bg-green-500 hover:text-white focus:outline-none'>
                                    Approved
                                  </button>
                                )}
                                {entry.status === 'Pending' && (
                                  <button className='border border-orange-500 text-orange-500 px-2 py-1 rounded hover:bg-orange-500 hover:text-white focus:outline-none'>
                                    Pending
                                  </button>
                                )}
                                {entry.status === 'Failed' && (
                                  <button className='border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white focus:outline-none'>
                                    Failed
                                  </button>
                                )}
                                {entry.status === 'Closed' && (
                                  <button className='border border-grey-500 text-grey-500 px-2 py-1 rounded hover:bg-grey-500 hover:text-white focus:outline-none'>
                                    Closed
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* Render pagination */}
                  <div className='flex bg-gray-200 justify-end mt-4'>
                    {totalPages > 1 &&
                      range(1, totalPages + 1).map((page) => (
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
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

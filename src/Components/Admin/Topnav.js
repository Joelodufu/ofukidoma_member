import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLineChart,
  faList12,
  faEdit,
} from '@fortawesome/free-solid-svg-icons'

const TopNavbar = () => {
  return (
    <nav className='bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex'>
            <a
              href='#'
              className='camapigns-a px-3 py-2 text-sm font-medium border-r-2 border-gray-300'
            >
              <FontAwesomeIcon icon={faList12} /> &nbsp; All Camapaigns
              <span className='inline-block h-4 bg-gray-300' />
            </a>
            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 px-3 py-2 text-sm font-medium border-r-2 border-gray-300'
            >
              <FontAwesomeIcon icon={faLineChart} /> &nbsp; Submissions
              <span className='inline-block h-4 bg-gray-300' />
            </a>
            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 px-3 py-2 text-sm font-medium border-r-2 border-gray-300'
            >
              <FontAwesomeIcon icon={faLineChart} /> &nbsp; Closed
              <span className='inline-block h-4 bg-gray-300' />
            </a>
            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 px-3 py-2 text-sm font-medium border-r-2 border-gray-300'
            >
              <FontAwesomeIcon icon={faLineChart} /> &nbsp; Closed
              <span className='inline-block h-4 bg-gray-300' />
            </a>
            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 px-3 py-2 text-sm font-medium'
            >
              <FontAwesomeIcon icon={faEdit} /> &nbsp; Draft
              <span className='inline-block h-4 bg-gray-300' />
            </a>
          </div>
          <div className='flex'>
            <select className='text-gray-300 hover:bg-gray-700 px-3 py-2 text-sm font-medium border-r-2 border-gray-300'>
              <option>Condition</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavbar

import React, { useEffect, useState } from 'react'

const UserModal = ({ onClick, userInfo }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')


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

  const { first, last } = getFirstAndLast(userInfo.name)

  console.log(first)

  useEffect(() => {
    setFirstName(first || '')
    setLastName(last || '')
    setEmail(userInfo.email || '')
  }, [first, last, userInfo.email])


  return (
    <div className='pop-up-container' onClick={onClick}>
      <div className='user-container'>
        <div className='user-container-img'>
          <img
            src={userInfo.image[0] || process.env.REACT_APP_USER_DEFAULT_IMAGE}
            alt={userInfo.name}
          />
        </div>
        <div className='detail-holder'>
          <div>
            <div className='inputHolder'>
              <label>First Name</label>
              <input
                type='text'
                className='w-full px-4 py-2 bg-gray-200 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                placeholder='Email'
                value={firstName}
                disabled={true}
              />
            </div>
            <div className='inputHolder'>
              <label>Email Address</label>
              <input
                type='email'
                disabled={true}
                value={email}
                className='w-full px-4 py-2 bg-gray-200 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                placeholder='Email'
              />
            </div>
          </div>
          <div>
            <div className='inputHolder'>
              <label>Last Name</label>

              <input
                type='text'
                disabled={true}
                value={lastName}
                className='w-full px-4 py-2 bg-gray-200 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                placeholder='Last Name'
              />
            </div>
            <div className='inputHolder'>
              <label>Phone Number</label>
              <input
                disabled={true}
                value={phoneNumber}
                type='text'
                className='w-full px-4 py-2 bg-gray-200 border rounded-md focus:outline-none focus:ring focus:border-blue-300'
                placeholder='Phone Number'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserModal

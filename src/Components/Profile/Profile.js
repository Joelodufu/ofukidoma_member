import React, { useState } from 'react'
import Swal from 'sweetalert2'

function ProfilePage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // ...

  const editProfileHandler = () => {}

  const handleSubmit = async (e) => {
    e.preventDefault()

    const queryParams = new URLSearchParams({
      firstName,
      lastName,
      email,
      phoneNumber,
    }).toString()

    try {
      const response = await fetch(
        `api/v1/user/editprofile/647fd5286c052d0b26d974f7?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        Swal.fire('Success', 'Profile data submitted successfully', 'success')
        console.log('Profile data submitted successfully')
      } else {
        Swal.fire('Error', 'Failed to submit profile data', 'error')
        console.error('Failed to submit profile data')
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
      console.error('Error:', error)
    }
  }

  // ...

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='max-w-2xl w-full mt-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Profile</h1>
          <button
            onClick={editProfileHandler}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
          >
            Edit Profile
          </button>
        </div>
        <div className='bg-white shadow-lg rounded-lg p-6'>
          <div className='flex'>
            <div className='w-1/4'>
              <img
                src='profile-photo.jpg'
                alt='Profile Photo'
                className='w-150 h-150 rounded-full'
              />
            </div>
            <div className='w-3/4'>
              <div className='flex'>
                <div className='w-1/2'>
                  <form className='mb-4'>
                    <label
                      className='block mb-2 font-bold text-gray-700'
                      htmlFor='firstName'
                    >
                      First Name
                    </label>
                    <input
                      type='text'
                      id='firstName'
                      className='w-223 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </form>
                </div>
                <div className='w-1/2'>
                  <form className='mb-4'>
                    <label
                      className='block mb-2 font-bold text-gray-700'
                      htmlFor='lastName'
                    >
                      Last Name
                    </label>
                    <input
                      type='text'
                      id='lastName'
                      className='w-223 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </form>
                </div>
              </div>
              <div className='flex'>
                <div className='w-1/2'>
                  <form className='mb-4'>
                    <label
                      className='block mb-2 font-bold text-gray-700'
                      htmlFor='email'
                    >
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      className='w-223 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </form>
                </div>
                <div className='w-1/2'>
                  <form>
                    <label
                      className='block mb-2 font-bold text-gray-700'
                      htmlFor='phoneNumber'
                    >
                      Phone Number
                    </label>
                    <input
                      type='text'
                      id='phoneNumber'
                      className='w-223 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </form>
                </div>
              </div>
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          hh
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

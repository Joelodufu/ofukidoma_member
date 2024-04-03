import axios from 'axios'
import constants from './config'
const apiUrl = constants.apiUrl

// Auth Starts
// Ngo Signup API call
export const sponsorSignup = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/sponsorsignup`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Signing: ' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}

// Ngo Login API call
export const ngoLogin = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/noglogin`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Logging: ' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}

// Member Signup process and Donor Signup process API call
export const signup = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/signup`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Signing Member or Donor:' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}

// Member Login process and Donor Login process API call
export const login = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/login`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Logging Member or Donor ' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}

// verify OTP API call
export const verify = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/verify`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Verifying OTP: ' +
      error.message +
      'Error Message' +
      error.response.data.error
    )
    throw error
  }
}

// Forgot password API call
export const forgotPassword = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/forgotPassword`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Sending OTP: ' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}

// Reset Password API call
export const resetPassword = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/resetpassword`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Reseting user Password: ' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}

// Admin Login API call
export const adminLogin = async (data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/adminlogin`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Logging in an Admin: ' +
      error.message +
      'Error Message' +
      error.response.data.message
    )
    throw error
  }
}
// Auth End

// Member Start
// Get all Members API Call
export const getAllMembers = async (token) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/member/getmembers`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting All Member: ' +
      error.message +
      'Error Message' +
      error.response.data.error
    )
    throw error
  }
}

// Create a Member API Call
export const createMember = async (data, token) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/member/postmember`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Creating A Member: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Get A Single Member API Call
export const getSingleMember = async (token, memberId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/member/getmember/${memberId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting A Member: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Delete A Single Member API Call
export const deleteMember = async (token, memberId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/member/deletemember/${memberId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Deleting A Member: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Close A Single Member API Call
export const closeMember = async (token, memberId) => {
  try {
    const response = await axios.patch(
      `${apiUrl}/api/v1/member/close/${memberId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Closing A Member: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}
// End Of Member API Call

// Start Of Donations API Call
// Get All Donations API Call
export const getAllDonations = async (token) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/donation/getcommittees`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting All Donations: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Make A Donation API Call
export const makeADonation = async (token, memberId, data) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/v1/donation/postcommittees/${memberId}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Making A Donation: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Make A Donation Cause API Call
export const makeADonationCause = async (token, projectId, data) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/v1/donation/postdonationcase/${projectId}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Making A Donation Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Get A Single Donation Cause API Call
export const getASingleDonation = async (token, donationId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/donation/getdonation/${donationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting A Single Donation: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Delete A Single Donation API Call
export const deleteADonation = async (token, donationId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/donation/deletedonation/${donationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Deleting A Single Donation: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// get total Donation by user Cause API Call
export const totalDonationByUser = async (token, userId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/donation/total/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting Total Donation By User: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// get last Donation API Call
export const getLastDonation = async (token, donationId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/donation/last/${donationId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting Last Donation: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Recurring Donation API Call
export const recurringDonation = async (token, donationId, data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/donation/recurring/${donationId}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Recurring Donation: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}
// End of Donation API Call

// Start of User API Call
// Get All User API Call
export const getAllUser = async (adminToken) => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/user/getusers`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        Authorization: `Bearer ${adminToken}`,
      },
      mode: 'cors',
      credentials: 'include',
    })
    return response.data
  } catch (error) {
    console.log(
      'Error Getting All User: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Get A User API Call
export const getSingleUser = async (token, userId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/user/getprofile/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting A User: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Delete A User API Call
export const deleteUser = async (token, userId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/user/deleteprofile/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Deleting A User: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Edit A User API Call
export const editUser = async (token, userId, data) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/v1/user/editprofile/${userId}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Editing A User: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}
// End of User API Call

// Start of Admin API Call
// Approve Member API Call
export const approveMember = async (adminToken, memberId, data) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/v1/user/admin/approve/${memberId}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${adminToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Approving A Member: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Getting Submittions API Call
export const getSubmittions = async (adminToken, statusParams) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/user/members?status=${statusParams}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${adminToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting Submittions: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Getting users based on type API Call
export const getUserType = async (adminToken) => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/user/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        Authorization: `Bearer ${adminToken}`,
      },
      mode: 'cors',
      credentials: 'include',
    })
    return response.data
  } catch (error) {
    console.log(
      'Error Getting User Type: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}
// End of Admin API Call

// Start Of Cause API Call
// Getting All Projects on type API Call
export const getAllProjects = async (token) => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/case/getcases`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
      credentials: 'include',
    })
    return response.data
  } catch (error) {
    console.log(
      'Error Getting All Projects: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Getting A Single Cause on type API Call
export const getASingleCause = async (token, projectId) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/case/getcase/${projectId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Getting A Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Creating A Cause API Call
export const createACause = async (adminToken, data) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/case/postcase`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${adminToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Creating A Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Editing A Cause API Call
export const editACause = async (adminToken, data, projectId) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/v1/case/editcase/${projectId}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${adminToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Editing A Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

// Deleting A Cause API Call
export const deletingACause = async (adminToken, projectId) => {
  try {
    const response = await axios.delete(
      `${apiUrl}/api/v1/case/deletecase/${projectId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${adminToken}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error Deleting A Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

export const getMemberByStatus = async (condition, token) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/member/member?typeOfFundraising=${condition}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    )
    return response.data
  } catch (error) {
    console.log(
      'Error getting A Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}

export const userLogOut = async () => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/auth/logout`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
      },
      mode: 'cors',
      credentials: 'include',
    })
    return response.data
  } catch (error) {
    console.log(
      'Error Logging Out User Cause: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}


// MEMBERS REQUESt


//Get All Members
export const getMembers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/member/getmembers`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
      },
      mode: 'cors',
      credentials: 'include',
    })
    console.log(response.data)
    return response.data

  } catch (error) {
    console.log(
      'Error Retrieving Members: ' +
      error.message +
      'Error Message' +
      error.response.data
    )
    throw error
  }
}




import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import CreationNotification from '../Modal/CreationNotification'
import Loading from '../Modal/Loading'
import PopupModal from '../Modal/PopupModal'
import { checkInternetConnection } from '../../lib/network'
import { AuthContext } from '../../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { getSingleMember } from '../../lib/fetch'
import constants from '../../lib/config'

const EditMember = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const memberId = urlParams.get('id')
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [typeOfFundraising, setTypeOfFundraising] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [raise, setRaise] = useState('')
  const [medicalReport, setMedicalReport] = useState('')
  const [imageOrVideo, setImageOrVideo] = useState('')
  const [saveAsDraft, setSaveAsDraft] = useState(false)
  const [sponsor, setSponsor] = useState('')
  const [fileType, setFileType] = useState('')
  const [fileName, setFileName] = useState('')

  const [fileMType, setFileMType] = useState('')
  const [fileMName, setFileMName] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [status, setStatus] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const userId = localStorage.getItem('userId')

  const [memberData, setMemberData] = useState([])
  // const token = localStorage.getItem('token')
  const authCtx = useContext(AuthContext)
  const apiUrl = constants.apiUrl

  const handleDaft = () => {
    setSaveAsDraft((prevState) => !prevState)
  }

  const pingNetworkConnection = async () => {
    setIsLoading(true)
    try {
      const isConnected = await checkInternetConnection()
      if (isConnected) {
        setIsLoading(false)
        return
      } else if (!isConnected) {
        setShowPopup(true)
        setErrorMessage('INTERNET DISCONNECTED')
        setStatus('error')
        setIsLoading(false)
        setTimeout(() => setShowPopup(true), 3000)
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    pingNetworkConnection()
  }, [])

  const getFileDetailsFromCloudinary = async (publicUrl) => {
    try {
      const response = await axios.head(publicUrl)
      // Access the response headers to get file details
      const fileSize = response.headers['content-length']
      const fileType = response.headers['content-type']
      const fileName = publicUrl.substring(publicUrl.lastIndexOf('/') + 1)

      console.log(response)
      return {
        fileName,
        fileType,
        fileSize,
      }
    } catch (error) {
      console.error('Error fetching file details:', error)
      return null
    }
  }

  const token = authCtx.token
  useEffect(() => {
    const getCurrentMember = async () => {
      try {
        const response = await getSingleMember(token, memberId)
        setMemberData(response.data)
        console.log(response.data.MedicalReport)
        setName(response.data._user.name || '')
        setState(response.data.state || '')
        setTypeOfFundraising(response.data.typeOfFundraising || '')
        setTitle(response.data.title || '')
        setDescription(response.data.description || '')
        setRaise(response.data.raise || '')
        setSponsor(response.data.sponsor || '')


        if (response.data.startDate) {
          const startDate = new Date(response.data.startDate)
          setStartDate(startDate.toISOString().split('T')[0])
        }

        if (response.data.endDate) {
          const endDate = new Date(response.data.endDate)
          setEndDate(endDate.toISOString().split('T')[0])
        }

        if (response.data.imageOrVideo[0]) {
          const fileDetails = await getFileDetailsFromCloudinary(
            `${response.data.imageOrVideo}`
          )
          if (fileDetails) {
            setImageOrVideo(response.data.imageOrVideo[0])
            setFileName(fileDetails.fileName)
            setFileType(fileDetails.fileType)
          }
        }
        if (response.data.MedicalReport) {
          const fileDetails = await getFileDetailsFromCloudinary(
            response.data.MedicalReport
          )
          if (fileDetails) {
            setMedicalReport(response.data.MedicalReport)
            setFileMName(fileDetails.fileName)
            setFileMType(fileDetails.fileType)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getCurrentMember()
  }, [memberId, token])

  const handleImageOrVideoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileName(file.name)
      setImageOrVideo(file)
      setFileType(file.type.slice(0, 5))
      // Process the selected file here
    } else {
      setFileName(null)
      setImageOrVideo(null)
    }
  }

  const handleMedicalChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFileMName(file.name)
      setMedicalReport(file)
      setFileMType(file.type.slice(0, 5))
    } else {
      setFileMName(null)
      setMedicalReport(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (imageOrVideo.length === 0 || medicalReport.length === 0) {
      alert('no image or video was selected')
      setIsLoading(false)
      return
    }

    const handleCloudinaryUpload = async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      )

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/deqfgp7hg/upload',
        formData
      )

      return response.data.secure_url
    }

    try {
      const isConnected = await checkInternetConnection()
      if (!isConnected) {
        setErrorMessage('INTERNET DISCONNECTED')
        setStatus('error')
        setIsLoading(false)
        return
      }

      const imageURL = await handleCloudinaryUpload(imageOrVideo)
      const medicalReportURL = await handleCloudinaryUpload(medicalReport)

      // const { _user, state, typeOfFundraising, title, description, setDuration, endDate, raise, MedicalReport } =
      //   formData;

      if (
        !userId ||
        !state ||
        !typeOfFundraising ||
        !title ||
        !description ||
        !startDate ||
        !endDate ||
        !raise ||
        !sponsor
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please fill in all the required fields',
        })
        setIsLoading(false)
        return
      }

      // const result = await cloudinary.uploader.upload(file, uploadOptions);
      // const imageURL = result.secure_url;

      const requestBody = {
        state,
        typeOfFundraising,
        title,
        startDate,
        _user: userId,
        description,
        endDate,
        MedicalReport: medicalReportURL,
        raise,
        imageOrVideo: imageURL,
        sponsor,
        saveAsDraft: false,
      }
      console.log(requestBody)

      const response = await axios.post(
        `${apiUrl}/api/v1/member/postdraft/${memberId}`,
        // JSON.stringify(requestBody),
        requestBody,
        {
          headers: {
            'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',

          },
        }
      )
      console.log(response)
      setStatus(response.data.success)
    } catch (error) {
      console.log(error.response)
      setStatus(error.response?.data?.success || 'error')
      setErrorMessage(error.response?.data?.error || "Form submission failed'")
      setShowPopup(true)
    }
    setIsLoading(false)
  }

  console.log(imageOrVideo)
  const handleSaveAsDraft = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (imageOrVideo.length === 0 || medicalReport.length === 0) {
      alert('no image or video was selected')
      setIsLoading(false)
      return
    }

    const handleCloudinaryUpload = async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      )

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/deqfgp7hg/upload',
        formData
      )

      return response.data.secure_url
    }

    try {
      const isConnected = await checkInternetConnection()
      if (!isConnected) {
        setErrorMessage('INTERNET DISCONNECTED')
        setStatus('error')
        setIsLoading(false)
        return
      }

      const imageURL = await handleCloudinaryUpload(imageOrVideo)
      const medicalReportURL = await handleCloudinaryUpload(medicalReport)

      // const { _user, state, typeOfFundraising, title, description, setDuration, endDate, raise, MedicalReport } =
      //   formData;

      if (
        !userId ||
        !state ||
        !typeOfFundraising ||
        !title ||
        !description ||
        !startDate ||
        !endDate ||
        !raise
        // !sponsor
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please fill in all the required fields',
        })
        setIsLoading(false)
        return
      }

      // const result = await cloudinary.uploader.upload(file, uploadOptions);
      // const imageURL = result.secure_url;

      const requestBody = {
        state,
        typeOfFundraising,
        title,
        startDate,
        _user: userId,
        description,
        endDate,
        MedicalReport: medicalReportURL,
        raise,
        imageOrVideo: imageURL,
        // sponsor,
        saveAsDraft: true,
      }
      console.log(requestBody)

      const response = await axios.post(
        `${apiUrl}/api/v1/member/postdraft/${memberId}`,
        // JSON.stringify(requestBody),
        requestBody,
        {
          headers: {
            'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',

          },
        }
      )
      console.log(response)
      setStatus(response.data.success)
      // setSuccessMessage(response.data.message)
      // setShowPopup(true)
      // // setTimeout(() => setShowPopup(false), 4000)
      // setIsLoading(false)

      // if (response.ok) {
      //   console.log(response.data)
      //   // const data = await response.json();
      //   // Swal.fire({
      //   //   icon: 'success',
      //   //   title: 'Success',
      //   //   text: JSON.stringify(data),
      //   // });
      // } else {
      //   throw new Error('Form submission failed');
      // }
    } catch (error) {
      console.log(error.response)
      setStatus(error.response?.data?.success || 'error')
      setErrorMessage(error.response?.data?.error || "Form submission failed'")
      setShowPopup(true)
      // setTimeout(() => setShowPopup(false), 4000)
      // setIsLoading(false)

      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: error.message,
      // })
    }
    setIsLoading(false)
  }

  return (
    <div>
      {isLoading && <Loading isLoggin={isLoading} color={'white'} />}
      {showPopup && (
        <PopupModal
          status={status}
          title={!status === true ? 'Failed' : 'Error'}
          message={!status === true ? errorMessage : errorMessage}
          onClick={() => setShowPopup(false)}
        />
      )}
      {status === true && <CreationNotification />}
      <div className='container mx-auto mt-16 px-4'>
        <Link
          to='/members'
          className='flex items-center position-absolute top-0 start-20 mt-2 mb-5 ml-3'
        >
          <FontAwesomeIcon icon={faChevronLeft} className='mr-2 ml-3 top-bk' />
          <span className='ml-4 top-bk'>Back</span>
        </Link>
        <div className='bg-red-500 cc-header flex flex-col justify-center border rounded p-10'>
          <div>
            <h1 className='text-white text-4xl cc-headtext'>
              Setup Your Member
            </h1>
          </div>
          <div>
            <p className='text-white'>
              Fill in all the required fields and submit. Your member will
              only go live after it has been verified by FundEzers' team.
            </p>
          </div>
        </div>

        <div className='flex flex-wrap -mx-4'>
          <div className='w-full sm:w-1/2 lg:w-1/3 px-4'>
            <h2 className='text-2xl font-bold mb-4 cc-head uppercase'>
              Let's start with the basis
            </h2>
            <div className='mb-4'>
              <label className='block cc-head'>Write Your Full Name</label>
              <input
                className='border rounded-lg px-3 py-2 w-full'
                type='text'
                name='_user'
                value={name}
                onChange={(e) => setName(e.target.value)}
              // value={formData._user}
              // onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block cc-head'>Which State do You Live?</label>
              <input
                className='border rounded-lg px-3 py-2 w-full'
                type='text'
                name='state'
                value={state}
                onChange={(e) => setState(e.target.value)}
              // value={formData.state}
              // onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block cc-head'>
                What kind of medical fundraising would you want to create?
              </label>
              <select
                className='border rounded-lg px-3 py-2 w-full'
                name='typeOfFundraising'
                value={typeOfFundraising}
                onChange={(e) => setTypeOfFundraising(e.target.value)}
              // value={formData.typeOfFundraising}
              // onChange={handleInputChange}
              >
                <option value=''>Select Category</option>
                <option value='Cancer'>Cancer</option>
                <option value='Diabetes'>Diabetes</option>
                <option value='Surgery'>Surgery</option>
                <option value='Organ Transplant'>Organ Transplant</option>
                <option value='Injury'>Injury</option>
                <option value='Other'>Other</option>
              </select>
            </div>
          </div>

          <div className='w-full sm:w-1/2 lg:w-1/3 px-4'>
            <h2 className='text-2xl font-bold mb-4 cc-head uppercase'>
              Tell Your Story
            </h2>
            <div className='mb-4'>
              <label className='block cc-head'>Member title</label>
              <input
                className='border rounded-lg px-3 py-2 w-full'
                type='text'
                name='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              // value={formData.title}
              // onChange={handleInputChange}
              />
            </div>
            <div className='mb-4'>
              <label className='block cc-head'>Description</label>
              <textarea
                className='border rounded-lg px-3 py-2 w-full'
                rows='2'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              // value={formData.description}
              // onChange={handleInputChange}
              ></textarea>
            </div>
            <div className='mb-4'>
              <label className='block cc-head'>Sponsor</label>
              <input
                className='border rounded-lg px-3 py-2 w-full'
                type='text'
                name='sponsor'
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
              // value={formData.title}
              // onChange={handleInputChange}
              />
            </div>
            <div className='flex'>
              <div className='w-1/2 p-4'>
                <div className='mb-4'>
                  <label className='block mb-2 cc-head'>START DATE</label>
                  <input
                    className='border rounded-lg px-3 py-2 w-full'
                    type='date'
                    name='setDuration'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  // value={formData.setDuration}
                  // onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <svg
                  className='text-gray-500 w-6 h-6 mx-2'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M9 18l6-6-6-6' />
                </svg>
              </div>
              <div className='w-1/2 p-4'>
                <div className='mb-4'>
                  <label className='block mb-2 cc-head'>END DATE</label>
                  <input
                    className='border rounded-lg px-3 py-2 w-full'
                    type='date'
                    name='endDate'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='w-full sm:w-1/2 lg:w-1/3 px-4'>
            <h2 className='text-2xl font-bold mb-4 cc-head uppercase'>
              Set Your Member Goals
            </h2>
            <div className='mb-4'>
              <label className='block mb-2 cc-head'>
                How much would you like to raise?
              </label>
              <input
                className='border rounded-lg px-3 py-2 w-full'
                type='text'
                name='raise'
                value={raise}
                onChange={(e) => setRaise(e.target.value)}
              // value={formData.raise}
              // onChange={handleInputChange}
              />
            </div>
            <h1 className='font-bold'>UPLOAD IMAGE OR VIDEO?</h1>
            <div className='mb-4'>
              <label className='block mb-2 cc-head text-muted'>
                Add a cover photo or video
              </label>
              <div className='py-2 w-full flex justify-between items-center'>
                <div className='border-dotted border rounded-lg px-3 py-2 w-full flex justify-between items-center m-input'>
                  <span className='mr-2'>
                    {fileName
                      ? fileName.length > 16
                        ? fileName.slice(0, 16) + '...'
                        : fileName
                      : 'Add a picture'}
                  </span>

                  <input
                    id='imageOrVideo'
                    className='border rounded-lg px-3 py-2 w-full d-none'
                    type='file'
                    name='imageOrVideo'
                    onChange={handleImageOrVideoChange}
                    accept='image/*,video/*'
                  />
                </div>
                <label htmlFor='imageOrVideo' className='btn btn-custom mx-2'>
                  Upload
                </label>
              </div>
            </div>

            <h1 className='font-bold'>UPLOAD MEDICAL REPORT</h1>
            <div className='mb-4'>
              <label className='block mb-2 cc-head text-muted'>
                Upload a pdf or image file of your medical report
              </label>
              <div className='py-2 w-full flex justify-between items-center'>
                <div className='border-dotted border rounded-lg px-3 py-2 w-full flex justify-between items-center m-input'>
                  <span className='mr-2'>
                    {fileMName
                      ? fileMName.length > 16
                        ? fileMName.slice(0, 16) + '...'
                        : fileMName
                      : 'Add a picture'}
                  </span>

                  <input
                    accept='.pdf,image/*'
                    id='MedicalReport'
                    className='border rounded-lg px-3 py-2 w-full d-none'
                    type='file'
                    mame='MedicalReport'
                    onChange={handleMedicalChange}
                  />
                </div>
                <label htmlFor='MedicalReport' className='btn btn-custom mx-2'>
                  Upload
                </label>
              </div>
            </div>

            {/* <div className='mb-4'>
            <label className='block mb-2 cc-head'>
              Upload a pdf or image file of your medical report
            </label>
            <input
              className='border rounded-lg px-3 py-2 w-full'
              type='file'
              mame='MedicalReport'
            />
          </div> */}
            <br />
            <div className='flex justify-between mt-8'>
              <button
                onClick={handleSaveAsDraft}
                className='text-purple-400 border font-bold py-2 px-4 rounded'
              >
                DRAFT
              </button>
              <button
                className='bg-red-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded'
                onClick={handleSubmit}
              >
                SUBMIT CAMPAIGN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMember

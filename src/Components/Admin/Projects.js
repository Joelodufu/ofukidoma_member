import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Members/topNavbar'
import SideNav from './Sidenav'
import { AuthContext } from '../../context/AuthContext'
import Skeleton from 'react-loading-skeleton'
import { faLinesLeaning } from '@fortawesome/free-solid-svg-icons'
import { createACause, deletingACause, editACause } from '../../lib/fetch'
import Loading from '../Modal/Loading'
import PopupModal from '../Modal/PopupModal'
import constants from '../../lib/config'
const AdminProjects = () => {
  const [projects, setProjects] = useState([])
  const [activeTab, setActiveTab] = useState('projects')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectIdToDelete, setCauseIdToDelete] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [projectIdToEdit, setCauseIdToEdit] = useState(false)
  const [editingCause, setEditingCause] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    _user: '',
  })
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const authCtx = useContext(AuthContext)

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const token = authCtx.token

  const handleShowPopup = (message, type) => {
    setMessage(message)
    setType(type)
    setShowPopup(true)
  }
  const apiUrl = constants.apiUrl


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/case/getcases`,
          {
            headers: {
              'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        setProjects(data.data)
        setIsLoading(false)
        console.log(data) // Log the response data to the console
      } catch (error) {
        console.error('Error fetching projects:', error)
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const toggleCreateModal = () => {
    setShowCreateModal((prevState) => !prevState)
  }
  const handleEditModal = async (editId) => {
    setCauseIdToEdit(editId)

    try {
      const response = await fetch(
        `${apiUrl}/api/v1/case/getcase/${editId}`,
        {
          headers: {
            'Access-Control-Allow-Origin': apiUrl, // replace with your own domain
            Authorization: `Bearer ${token}`,

          },
        }
      )
      const data = await response.json()
      setEditingCause(data.data) // Set the project data for editing
      setShowEditModal((prevState) => !prevState)
    } catch (error) {
      console.error('Error fetching project:', error.response)
    }
  }

  const toggleDeleteModal = (projectId = '') => {
    setCauseIdToDelete(projectId)
    setShowDeleteModal((prevState) => !prevState)
  }

  const handleDelete = async (projectId) => {
    setIsProcessing(true)
    try {
      // const token = localStorage.getItem('adminToken')
      const response = await deletingACause(token, projectId)

      // Handle the response as needed (e.g., display a success message)
      handleShowPopup('Cause deleted successfully', 'success')
      setTimeout(() => setShowPopup(false), 3000)
      setTimeout(() => window.location.reload(), 2000)

      // Close the delete modal
      toggleDeleteModal()
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setIsProcessing(true)

    const data = {
      Name: name,
      Description: description,
      _user: authCtx.id,
    }

    if (!name || !description) {
      setIsProcessing(false)
      handleShowPopup('Please provide the required fields', 'error')
      setTimeout(() => setShowPopup(false), 3000)
      return
    }

    try {
      console.log('yessssssss')
      const response = await createACause(authCtx.token, data)
      if (response.success === true) {
        handleShowPopup('Cause Created successfully', 'success')
      }
      console.log(response)
      setTimeout(() => setShowPopup(false), 3000)
      setTimeout(() => window.location.reload(), 5000)
      // Handle the response as needed (e.g., display a success message)
      // Log the response data to the console
    } catch (error) {
      console.error('Error creating project:', error)
      handleShowPopup('Case Could not be created successfully', 'error')
    } finally {
      setIsProcessing(false)
    }
  }
  const handleEditFormSubmit = async (event, editId) => {
    event.preventDefault()
    setIsProcessing(true)

    const data = {
      Name: name,
      Description: description,
    }
    if (!name || !description) {
      setIsProcessing(false)
      handleShowPopup('Please provide the required fields', 'error')
      setTimeout(() => setShowPopup(false), 3000)
      return
    }

    try {
      const response = await editACause(authCtx.token, data, editId)
      console.log(response)
      handleShowPopup('Cause Edited successfully', 'success')
      setTimeout(() => setShowPopup(false), 3000)
      setTimeout(() => window.location.reload(), 5000)
      // Handle the response as needed (e.g., display a success message)
      // Log the response data to the console
      window.location.reload()
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // useEffect(() => {
  //   if()
  //   setName(name)
  // },[])

  if (isLoading) {
    return <Loading isLoggin={isLoading} color={'white'} />
  }

  if (showPopup) {
    return (
      <PopupModal
        status={type}
        message={message}
        title={type === 'success' ? 'Successful' : 'Failed'}
      />
    )
  }
  const renderProjects = () => {
    if (isLoading) {
      return (
        <div>
          <div className='bg-white rounded-lg mt-10 p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  style={{ width: 330, height: 320 }}
                  className='border rounded-lg p-4 flex flex-column justify-between'
                >
                  <h3 className='text-l text-center font-bold mb-2 p-2 bg-gray-100'>
                    <Skeleton />
                  </h3>
                  <p className='text-gray-600 text-justify'>
                    <Skeleton count={5} />
                  </p>
                  <div className='flex justify-between space-x-4'>
                    <Skeleton
                      width={100}
                      className='in-out rounded-full font-bold py-2 px-4 mt-4'
                    />
                    <Skeleton
                      width={100}
                      className=' rounded-full text-white font-bold py-2 px-4 mt-4'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (!projects || projects.length === 0) {
      return <p>No projects found.</p>
    }

    return (
      <div>
        <div className='bg-white rounded-lg mt-10 p-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {projects.map((project) => (
              <div
                key={project._id}
                style={{ height: 320 }}
                className='border w-[100] rounded-lg p-4 flex flex-column justify-between'
              >
                <div>
                  <h3 className='text-l text-center font-bold mb-2 p-2 bg-gray-100'>
                    {project.Name}
                  </h3>
                  <p className='text-gray-600 text-justify'>
                    {project.Description}
                  </p>
                </div>
                <div className='flex justify-between space-x-4'>
                  <button
                    className='in-out w-50 rounded-full font-bold py-2 px-4 mt-4'
                    onClick={() => toggleDeleteModal(project._id)}
                  >
                    Delete
                  </button>
                  <button
                    className='main-bg rounded-full w-50 text-white font-bold py-2 px-4 mt-4'
                    onClick={() => handleEditModal(project._id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99 }}
      />
      <div className='flex flex-col bg-gray-200 md:flex-row mt-5'>
        <SideNav className='md:w-1/4 md:mr-0' />

        <div className='p-4 md:mt-3 w-full'>
          <div
            style={{ width: '100%' }}
            className='flex justify-between items-center mt-3 w-100'
          >
            <h1 className='text-2xl font-bold'>Projects</h1>
            <button
              className='main-bg text-white font-bold py-2 px-4 rounded-pill'
              onClick={toggleCreateModal}
            >
              Add New Cause +
            </button>
          </div>
          <div className='flex'>
            <button
              className={`bg-purple-200 text-black font-bold py-2 px-4 mt-4 mr-2 rounded ${activeTab === 'projects' ? 'bg-purple-200 text-black' : 'bg-white'
                }`}
              onClick={() => handleTabChange('projects')}
            >
              Projects
            </button>
          </div>

          {isProcessing && <Loading />}
          {activeTab === 'projects' && renderProjects()}
          {showCreateModal && (
            <div className='fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg w-10/12 md:w-1/2 lg:w-1/3 h-3/4 md:h-auto'>
                {/* Adjust the width and height based on the screen size */}
                <h2 className='bg-gray-200 text-center p-3 rounded-t-xl mb-4 font-bold'>
                  Add New Cause
                </h2>
                <form className='p-4' onSubmit={handleFormSubmit}>
                  <div className='mb-4'>
                    <label
                      htmlFor='name'
                      className='block text-gray-700 font-bold mb-2'
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      placeholder='Enter name of the project'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='border rounded-lg py-2 px-3 w-full'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='description'
                      className='block text-gray-700 font-bold mb-2'
                    >
                      Description
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      placeholder='Add Description to the project'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='border rounded-lg px-3 w-full'
                      rows={4}
                      required
                    ></textarea>
                  </div>
                  <div className='flex flex-column-reverse md:flex-row md:justify-between mt-4 md:mt-0'>
                    {/* Adjust the alignment for mobile and larger screens */}
                    <button
                      type='button'
                      className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4'
                      onClick={toggleCreateModal}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='main-bg text-white font-bold py-2 px-4 rounded'
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className='fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg w-10/12 md:w-2/3 lg:w-1/2 h-auto md:h-70'>
                {/* Adjust the width and height based on the screen size */}
                <h2 className='bg-gray-200 text-center p-3 rounded-t-xl mb-4 font-bold'>
                  Edit Cause
                </h2>
                <form
                  className='p-4'
                  onSubmit={(event) =>
                    handleEditFormSubmit(event, projectIdToEdit)
                  }
                >
                  <div className='mb-4'>
                    <label
                      htmlFor='name'
                      className='block text-gray-700 font-bold mb-2'
                    >
                      Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      placeholder='Enter name of the project'
                      value={name || editingCause?.Name}
                      onChange={(e) => setName(e.target.value)}
                      className='border rounded-lg py-2 px-3 w-full'
                      required
                    />
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='description'
                      className='block text-gray-700 font-bold mb-2'
                    >
                      Description
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      placeholder='Add Description to the project'
                      value={description || editingCause?.Description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='border rounded-lg px-3 w-full'
                      rows={8}
                      required
                    ></textarea>
                  </div>
                  <div className='flex flex-col md:flex-row md:justify-end flex-column'>
                    {/* Adjust the alignment for mobile and larger screens */}
                    <button
                      type='submit'
                      className='main-bg text-white font-bold py-2 px-4 rounded'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      className='bg-red-500 hover:bg-red-600 text-white w-full font-bold py-2 px-4 rounded mt-4 md:mt-0 mr-4'
                      onClick={handleEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showDeleteModal && (
            <div className='fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white rounded-lg p-4 text-center m-6'>
                <h2 className='text-3xl font-bold mb-4'>Delete Cause</h2>
                <p>
                  Are you sure you want to delete this project? all reoccurring
                  donation on this project will automatically be removed. This
                  action is irreversible{' '}
                </p>
                <div className='flex justify-center mt-4'>
                  <button
                    type='button'
                    className='main-bg hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-5'
                    onClick={toggleDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='bg-red-500 text-white font-bold py-2 px-4 rounded'
                    onClick={() => handleDelete(projectIdToDelete)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProjects

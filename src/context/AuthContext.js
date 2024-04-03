import { createContext, useState } from 'react'

export const AuthContext = createContext({
  userInfo: {},
  token: '',
  id: '',
  setUser: (data) => {},
  authenticate: (token) => {},
  logout: () => {},
  setId: (id) => {}
})

function AuthContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || {}
  )
  const [userToken, setUserToken] = useState(
    localStorage.getItem('userToken') || ''
  )
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '')


  // user context
  const setUser = (user) => {
    setUserInfo(user)
    localStorage.setItem('userInfo', JSON.stringify(user))
    console.log(user)
  }

  const authenticate = (token) => {
    setUserToken(token)
    localStorage.setItem('userToken', token)
    console.log(token)
  }
  const setId = (Id) => {
    setUserId(Id)
    localStorage.setItem('userId', Id)
    console.log(Id)
  }

  const logout = () => {
    setUserToken(null)
    setUserInfo(null)
    setUserId(null)
    localStorage.clear('userToken')
    localStorage.clear('userInfo')
    localStorage.clear('userId')
  }


  const value = {
    userInfo,
    token: userToken,
    id: userId,
    setUser,
    authenticate,
    logout,
    setId
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider

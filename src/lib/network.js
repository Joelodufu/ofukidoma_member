import axios from 'axios'
import constants from './config'

const apiUrl = constants.apiUrl

export const checkInternetConnection = async () => {
  try {
    await axios.get(apiUrl, {
      headers: {
        'Acc`ess-Control-Allow-Origin': apiUrl, // replace with your own domain
      }
    })
    return true // Internet connection is successful
  } catch (error) {
    return false // Internet connection failed
  }
}

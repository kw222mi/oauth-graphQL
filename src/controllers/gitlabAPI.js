import axios from 'axios'

/**
 * Fetch data from API.
 *
 * @param {string} url - The url to fetch from.
 * @param {string} userToken - The access token of the user.
 * @param {object} req - Express request object.
 * @returns {object} - The result from the fetch.
 */
async function fetchUserDataWithRetries (url, userToken, req) {
  const maxRetries = 3
  let retries = 0

  while (retries < maxRetries) {
    try {
      const userArray = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })

      if (userArray.status === 401) {
        // Token expired, attempt to renew it
        console.log('Token expired, attempt to renew it')
        await renewAccessToken(req)
        retries++
        continue
      }

      const result = await userArray.json()
      return result
    } catch (error) {
      console.error('API request failed:', error.message)
      retries++
    }
  }

  throw new Error('Failed to fetch data after multiple retries')
}

/**
 * Get a new accesstoken if it has expired.
 *
 * @param {object} req - Express request object.
 * @returns {string} - the new token.
 */
async function renewAccessToken (req) {
  console.log('in renewAccessToken')
  // Get a new userToken from refreshToken
  console.log('refreshtoken' + req.session.refreshToken)
  const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
  const opts = { headers: { accept: 'application/json' } }
  try {
    const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
    const newAccessToken = response.data.access_token
    req.session.userToken = newAccessToken // Update the userToken in the session
    console.log('New access token:', newAccessToken)
    req.session.refreshToken = response.data.refresh_token // Update the refreshToken in the session
    return newAccessToken
  } catch (error) {
    throw new Error('Failed to renew access token')
  }
}

export { fetchUserDataWithRetries, renewAccessToken }

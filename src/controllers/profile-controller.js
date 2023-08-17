/**
 * Module for the ProfileController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */
import { fetchUserDataWithRetries } from './gitlabAPI.js'

/**
 * Encapsulates a controller.
 */
export class ProfileController {
  /**
   * Get all activities from GitLab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getInfo (req, res, next) {
    try {
      const url = 'https://gitlab.lnu.se/api/v4/user'
      const userData = await fetchUserDataWithRetries(url, req.session.userToken, req)

      const profile = {
        name: userData.name,
        userName: userData.username,
        avatar: userData.avatar_url,
        gitlabId: userData.id,
        email: userData.email,
        lastActivity: userData.last_activity_on
      }
      res.render('profile/index', {
        viewData: profile
      })
    } catch (error) {
      next(error)
    }
  }
}

/*

  async getInfo (req, res, next) {
    let viewData

    try {
      const url = `https://gitlab.lnu.se/api/v4/user`;
      const userData = await fetchUserDataWithRetries(url, req.session.userToken)

      const profile = {
        name: userData.name,
        userName: userData.username,
        avatar: userData.avatar_url,
        gitlabId: userData.id,
        email: userData.email,
        lastActivity: userData.last_activity_on
      }

      res.render('profile/index', {
        viewData: profile
      });
    } catch (error) {
      next(error)
    }

    async function fetchUserDataWithRetries (url, userToken) {
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
  }
}
*/

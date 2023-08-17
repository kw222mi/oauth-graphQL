/**
 * Module for the ProfileController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */
import axios from 'axios'
// import fetch from 'node-fetch'

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
    let viewData

    try {
      const url = `https://gitlab.lnu.se/api/v4/user?access_token=${req.session.userToken}`

      const userArray = await fetch(url, {
        method: 'GET'
      })
      const result = await userArray.json()
      console.log(result)
     

      const profile = {
        name: result.name,
        userName: result.username,
        avatar: result.avatar_url,
        gitlabId: result.id,
        email: result.email,
        lastActivity: result.last_activity_on
      }
      viewData = profile

      res.render('profile/index', {
        viewData

      })
     } catch (error) {
      if (error.message === '401 Unauthorized') {
        try {
          const newAccessToken = await renewAccessToken(req)
          // Retry the API call with the new access token
          // ...
        } catch (retryError) {
          res.status(500).json({ error: 'Failed to fetch data after token renewal' })
          return;
        }
      } else {
        next(error)
      }
  }

  async function renewAccessToken (req) {
     // Get a new userToken from refreshToken
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
      throw new Error('Failed to renew access token');
    }
  }
}
}

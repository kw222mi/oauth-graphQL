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
      console.log('refreshtoken behövs inte alls ' + req.session.refreshToken)

      const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
      const opts = { headers: { accept: 'application/json' } }

      const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
      const newAccessToken = response.data.access_token
      req.session.userToken = newAccessToken // Update the userToken in the session
      console.log('New access token:', newAccessToken)
      req.session.refreshToken = response.data.refresh_token

      const url = `https://gitlab.lnu.se/api/v4/user?access_token=${req.session.userToken}`

      const userArray = await fetch(url, {
        method: 'GET'
      })
      const result = await userArray.json()
      console.log(result)
      /*
      if (result.message === '401 Unauthorized') {
        console.log('refreshtoken behövs' + req.session.refreshToken)
        console.log(req.session.userToken)

        const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
        const opts = { headers: { accept: 'application/json' } }
        try {
          const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
          const newAccessToken = response.data.access_token
          req.session.userToken = newAccessToken // Update the userToken in the session
          console.log('New access token:', newAccessToken)
          req.session.refreshToken = response.data.refresh_token
        } catch (err) {
          res.status(500).json({ err: err.message })
          return
        }
      }
      */

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
      next(error)
    }
  }
}

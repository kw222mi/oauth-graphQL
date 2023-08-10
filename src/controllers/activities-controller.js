/**
 * Module for the ActivitiesController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import fetch from 'node-fetch'
import axios from 'axios'

/**
 * Encapsulates a controller.
 */
export class ActivitiesController {
  /**
   * Get all activities from GitLab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAll (req, res, next) {
    let viewData
    try {
      const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
      const opts = { headers: { accept: 'application/json' } }

      const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
      const newAccessToken = response.data.access_token
      req.session.userToken = newAccessToken // Update the userToken in the session
      console.log('New access token:', newAccessToken)
      req.session.refreshToken = response.data.refresh_token // Update the refreshToken in the session

      const url = `https://gitlab.lnu.se/api/v4/events?access_token=${req.session.userToken}`

      const activitiesArray = await fetch(url, {
        method: 'GET'
      })
      const result = await activitiesArray.json()
      // console.log(result)

      const activities = result.map((activity) => ({
        actionName: activity.action_name,
        createdAt: activity.created_at,
        targetTitle: activity.target_title,
        targetType: activity.target_type
      }))

      viewData = activities
      console.log(viewData)

      res.render('activities/index', {
        viewData
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}

// GET /events

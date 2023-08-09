/**
 * Module for the ActivitiesController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import fetch from 'node-fetch'

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

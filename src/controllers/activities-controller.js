/**
 * Module for the ActivitiesController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import fetch from 'node-fetch'
import { fetchActivitiesWithRetries } from './gitlabAPI.js'
import { getformattedTimeAndDate } from './time.js'

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
      const url = 'https://gitlab.lnu.se/api/v4/events'
      const result = await fetchActivitiesWithRetries(url, req.session.userToken, req)

      const activities = result.map((activity) => ({
        actionName: activity.action_name,
        createdAt: getformattedTimeAndDate(activity.created_at),
        targetTitle: activity.target_title,
        targetType: activity.target_type
      }))

      viewData = activities

      res.render('activities/index', {
        viewData
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}

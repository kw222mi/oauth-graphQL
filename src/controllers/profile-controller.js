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

/**
 * Module for the ProfileController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

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
      console.log(profile.name)
      viewData = profile

      res.render('profile/index', {
        viewData

      })
    } catch (error) {
      next(error)
    }
  }
}

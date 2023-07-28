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
      console.log('not implemented')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }

    try {
      res.render('activities/index', { viewData })
    } catch (error) {
      next(error)
    }
  }
}

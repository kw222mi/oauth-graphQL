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
        console.log('not implemented')
      } catch (error) {
        req.session.flash = { type: 'danger', text: error.message }
        res.redirect('..')
      }
  
      try {
        res.render('profile/index', { viewData })
      } catch (error) {
        next(error)
      }
    }
  }
  
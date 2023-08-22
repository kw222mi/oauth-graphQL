/**
 * Home controller.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import 'dotenv/config'
import axios from 'axios'

/**
 * Encapsulates a controller.
 */
export class HomeController {
  #token

  /**
   * Render index page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    const isLoggedIn = req.query.isLoggedIn === 'true' // Konvertera till boolean om det behövs
    res.render('home/index', { isLoggedIn })
  }

  /**
   * Redirect the user for GitLab authorization.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  auth (req, res, next) {
    res.redirect(
    `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`

    )
  }

  /**
   * Get the inlog token and send the user back to the page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async oauth (req, res, next) {
    const { code } = req.query

    const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`
    const opts = { headers: { accept: 'application/json' } }

    try {
      const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
      this.#token = response.data.access_token
      req.session.userToken = this.#token
      req.session.refreshToken = response.data.refresh_token
      res.locals.isLoggedIn = true

      // Create a query parameter with the updated status.
      const queryParam = `isLoggedIn=${res.locals.isLoggedIn}`
      // Do a redirect with the updated information.
      res.redirect(`${process.env.BASE_URL}/?${queryParam}`)
    } catch (err) {
      res.status(500).json({ err: err.message })
    }
  }

  /**
   * Log out the user and destroy the session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  logout (req, res, next) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err)
      } else {
        console.log(req.session)
        console.log('destroyed')
        res.redirect(`${process.env.BASE_URL}`)
      }
    })
  }
}

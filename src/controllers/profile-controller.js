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
      const activity = this.#getformattedTimeAndDate(userData.current_sign_in_at)

      const profile = {
        name: userData.name,
        userName: userData.username,
        avatar: userData.avatar_url,
        gitlabId: userData.id,
        email: userData.email,
        lastActivity: activity
      }
      res.render('profile/index', {
        viewData: profile
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Format the time and date.
   *
   * @param {string} dateString - The datestring from gitlab.
   * @returns {string} - formated date and time.
   */
  #getformattedTimeAndDate (dateString) {
    // Skapa ett Date-objekt från strängen
    const date = new Date(dateString)

    // Skapa en Intl.DateTimeFormat-instans för att hämta tidszonen från användarens enhet
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Anropa formateringsfunktionen med aktuell tidszon
    const formattedDateTime = this.#formatDateTimeWithTimeZone(date, timeZone)

    console.log(formattedDateTime)
    return formattedDateTime
  }

  /**
   * Adding 0 for one digit values.
   *
   * @param {string} value - a time value.
   * @returns {string} two digit value.
   */
  #addLeadingZero (value) {
    return value < 10 ? '0' + value : value
  }

  /**
   * Create a formatingfunction with the timezone.
   *
   * @param {string} date - the date and time string.
   * @param {string} timeZone - timezone.
   * @returns {string} - date and time.
   */
  #formatDateTimeWithTimeZone (date, timeZone) {
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // use 24h format
    })

    return formatter.format(date)
  }
}

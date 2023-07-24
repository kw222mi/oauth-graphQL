/**
 * Module for the ActivitiesController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class ActivitiesController {
  #tasks = []
  #done

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getAll (req, res, next) {
    let viewData

    if (!this.#done) {
      try {
        const header = {
          'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN
        }
        const url = 'https://gitlab.lnu.se/api/v4/projects/30108/issues?per_page=10'

        const issueArray = await fetch(url, {
          method: 'GET',
          headers: header
        })
        const result = await issueArray.json()
        // const h = await issueArray.headers
        // console.log(issueArray.headers)
        const numberOfPages = issueArray.headers.get('x-total-pages')
        const totalIssues = issueArray.headers.get('x-total')
        console.log(totalIssues)
        console.log(numberOfPages)

        for (let i = 0; i < result.length; i++) {
          let task = null
          task = {
            description: result[i].description,
            title: result[i].title,
            done: result[i].state,
            issueId: result[i].iid,
            avatar: result[i].author.avatar_url
          }
          // console.log(task)
          this.#tasks.push(task)
        }
        viewData = this.#tasks
        // console.log(viewData)
        this.#done = true
      } catch (error) {
        req.session.flash = { type: 'danger', text: error.message }
        res.redirect('..')
      }
    } else {
      viewData = this.#tasks
    }
    try {
      res.render('tasks/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  async closePutTest (req, res) {
    try {
      console.log('req.params.id')
      console.log(req.params.id)
      console.log('CLOSE')

      const header = {
        'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN
      }
      const urlClose = `https://gitlab.lnu.se/api/v4/projects/30108/issues/${req.params.id}/?state_event=close`

      const closeIssue = await fetch(urlClose, {
        method: 'PUT',
        headers: header
      })
      const result = await closeIssue.json()
      console.log('state')
      console.log(result.state)

      req.session.flash = { type: 'success', text: 'The closing was sent to GitLab.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

   
}

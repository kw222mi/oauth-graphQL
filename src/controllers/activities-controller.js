/**
 * Module for the TasksController.
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
   * If DB is empty get all the issues from GitLab. Render the DB.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express next middleware function.
   */
  async index (req, res, next) {
    const count = await Task.estimatedDocumentCount() // count the number of documents in DB

    // If DB is empty get issues from GitLab
    if (count === 0) {
      try {
        const header = {
          'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN
        }
        const url = 'https://gitlab.lnu.se/api/v4/projects/30108/issues'

        const issueArray = await fetch(url, {
          method: 'GET',
          headers: header
        })
        const result = await issueArray.json()
        console.log(result)

        for (let i = 0; i < result.length; i++) {
          let task = null
          task = new Task({
            description: result[i].description,
            title: result[i].title,
            done: result[i].state,
            issueId: result[i].iid,
            avatar: result[i].author.avatar_url
          })
          console.log(task)
          await task.save()
        }
      } catch (error) {
        req.session.flash = { type: 'danger', text: error.message }
        res.redirect('..')
      }
    }
    try {
      const viewData = {
        tasks: (await Task.find())
          .map(task => task.toObject())
      }
      console.log(viewData)
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

  /**
   *
   * @param req
   * @param res
   */
  async openPutTest (req, res) {
    try {
      console.log('req.params.id')
      console.log(req.params.id)
      console.log('REOPEN')

      const header = {
        'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN
      }
      const urlOpen = `https://gitlab.lnu.se/api/v4/projects/30108/issues/${req.params.id}/?state_event=reopen`

      const closeIssue = await fetch(urlOpen, {
        method: 'PUT',
        headers: header
      })
      const result = await closeIssue.json()
      console.log(result)

      req.session.flash = { type: 'success', text: 'The reopening was sent to GitLab.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Closes an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async closePut (req, res) {
    try {
      const task = await Task.findById(req.params.id)
      console.log(task.issueId)
      const header = {
        'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN
      }
      const urlClose = `https://gitlab.lnu.se/api/v4/projects/30108/issues/${task.issueId}/?state_event=close`
      const urlOpen = `https://gitlab.lnu.se/api/v4/projects/30108/issues/${task.issueId}/?state_event=reopen`

      const closeIssue = await fetch(task.done === 'opened' ? urlClose : urlOpen, {
        method: 'PUT',
        headers: header
      })
      const result = await closeIssue.json()
      console.log(result)

      req.session.flash = { type: 'success', text: 'The closing was sent to GitLab.' }
      // res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }
}

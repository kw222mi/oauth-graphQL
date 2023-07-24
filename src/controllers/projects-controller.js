/**
 * Module for the ProjectsController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */
import { ActivitiesController } from './activities-controller.js'
/**
 * Encapsulates a controller.
 */
export class ProjectsController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    console.log('authenticate')
    // Use the GitLab secret token to validate the received payload.
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async indexPostTest (req, res, next) {
    try {
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)
      console.log('webbhookcontroller')
      let task
      if (req.body.event_type === 'issue') {
        task = {
          description: req.body.object_attributes.description,
          title: req.body.object_attributes.title,
          done: req.body.object_attributes.state,
          issueId: req.body.object_attributes.iid,
          avatar: req.body.user.avatar_url
        }
        const viewData = []
        viewData.push(task)
        try {
          res.render('tasks/index', { viewData })
        } catch (error) {
          next(error)
        }
      }

      // It is important to respond quickly!
      res.status(200).end()

      console.log(task)
      // Put this last because socket communication can take long time.
      if (task) {
        res.io.emit('tasks/create', task)
      }
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }

  /**
   * Receives a webhook, and creates a new task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)
      let task
      if (req.body.event_type === 'issue') {
        task = await Task.findOneAndUpdate({ issueId: req.body.object_attributes.iid }, {
          $set: {
            description: req.body.object_attributes.description,
            title: req.body.object_attributes.title,
            done: req.body.object_attributes.state,
            avatar: req.body.user.avatar_url
          }
        },
        {
          upsert: true, // Creates a new document if no documents match the filter
          new: true
        })
      }

      // It is important to respond quickly!
      res.status(200).end()

      console.log(task)
      // Put this last because socket communication can take long time.
      if (task) {
        res.io.emit('tasks/create', task.toObject())
      }
    } catch (error) {
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}

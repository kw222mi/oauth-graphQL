/**
 * Webhooks routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { ProjectsController } from '../controllers/projects-controller.js'

export const router = express.Router()

const projectsController = new ProjectsController()

// Map HTTP verbs and route paths to controller actions.
router.post('/',
  (req, res, next) => projectsController.authenticate(req, res, next),
  (req, res, next) => projectsController.indexPostTest(req, res, next)
)

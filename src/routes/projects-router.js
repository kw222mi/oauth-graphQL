/**
 * Webhooks routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { ProjectsController } from '../controllers/projects-controller.js'

export const router = express.Router()

const controller = new ProjectsController()

// Map HTTP verbs and route paths to controller actions.

router.get('/', (req, res, next) => controller.getProjects(req, res, next))

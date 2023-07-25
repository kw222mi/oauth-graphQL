/**
 * Activities routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { ActivitiesController } from '../controllers/activities-controller.js'

export const router = express.Router()

const controller = new ActivitiesController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.getAll(req, res, next))




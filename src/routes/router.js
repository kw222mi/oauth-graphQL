/**
 * The routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { router as activitiesRouter } from './activities-router.js'
import { router as projectsRouter } from './projects-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/activities', activitiesRouter)
// --------------------------------------------------------------------------
//
// Webhook: Config routes for webhooks.
//
router.use('/projects', projectsRouter)
// --------------------------------------------------------------------------

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

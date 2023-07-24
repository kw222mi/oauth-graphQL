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
// router.post('/:id', (req, res, next) => controller.closePut(req, res, next))

// router.get('/:id/close', (req, res, next) => controller.close(req, res, next))
router.post('/:id/opened', (req, res, next) => controller.closePutTest(req, res, next))
router.post('/:id/closed', (req, res, next) => controller.openPutTest(req, res, next))

router.get('/create', (req, res, next) => controller.create(req, res, next))
router.post('/create', (req, res, next) => controller.createPost(req, res, next))

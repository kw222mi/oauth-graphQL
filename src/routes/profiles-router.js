/**
 * Profile routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { ProfileController } from '../controllers/profile-controller.js'

export const router = express.Router()

const controller = new ProfileController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.getInfo(req, res, next))

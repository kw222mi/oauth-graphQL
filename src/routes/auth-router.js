/**
 * Auth routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { AuthController } from '../controllers/auth-controller.js'

export const router = express.Router()

const controller = new AuthController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.auth(req, res, next))
// router.get('/auth', (req, res, next) => controller.auth(req, res, next))
router.get('/oauth-callback', (req, res, next) => controller.oauth(req, res, next))
router.get('/user', (req, res, next) => controller.user(req, res, next))

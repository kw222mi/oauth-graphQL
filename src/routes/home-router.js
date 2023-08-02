/**
 * Home routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { HomeController } from '../controllers/home-controller.js'

export const router = express.Router()

const controller = new HomeController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/auth', (req, res, next) => controller.auth(req, res, next))
router.get('/oauth-callback', (req, res, next) => controller.oauth(req, res, next))
router.get('/user', (req, res, next) => controller.user(req, res, next))

import express from 'express'
import type{Router} from 'express'
import AuthenticationController from './controller'
import {restrictionToAuthenticated} from './middleware/auth-middleware'

const authenticationController = new AuthenticationController()
export const authRouter: Router = express.Router()

authRouter.post('/sign-up', authenticationController.handelSignup.bind(authenticationController))
authRouter.post('/sign-in', authenticationController.handleSignin.bind(authenticationController))
authRouter.get('/me', restrictionToAuthenticated(), authenticationController.handleme.bind(authenticationController))

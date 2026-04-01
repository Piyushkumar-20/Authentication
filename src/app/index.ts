import express from 'express'
import type{Express} from 'express'
import {authRouter} from './auth/routes'

export function createExpressApp(): Express{
    const app = express()

    //Middlewares 
    app.use(express.json())


    //Routes
    app.get('/', (req , res)=> {
        return res.json({message: "Welcome to Authentication Services"} )
    })

    app.use('/auth' , authRouter)

    return app
}
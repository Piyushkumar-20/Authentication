import express from 'express'
import type{Express} from 'express'

export function createExpressApp(): Express{
    const app = express()

    //Middlewares 


    //Routes
    app.get('/', (req , res)=> {
        return res.json({message: "Welcome to Authentication Services"} )
    })

    return app
}
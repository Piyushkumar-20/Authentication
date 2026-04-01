import type {Request, Response} from 'express'
import {signupPayloadModel} from './models'
import {eq} from 'drizzle-orm'
import { db } from '../../db'
import { userTable } from '../../db/schema'
import {createHmac, randomBytes} from 'node:crypto'

class AuthenticationController {
    public async handelSignup (req: Request,  res: Response) {
        const validation = await signupPayloadModel.safeParseAsync(req.body)
        if (validation.error) return res.status(400).json({message: 'Body validation Failed' , error: validation.error.issues})

            const {firstname, lastname, email, password} = validation.data

            const userEmailResult = await db.select().from(userTable).where(eq(userTable.email, email))

            if(userEmailResult.length > 0) return res.status(400).json({error: 'duplicate entry', message: `user with mail ${email} already exist`})

            const salt = randomBytes(32).toString('hex')
            const hash = createHmac('sha256', salt).update(password).digest('hex')

            const [result] = await db.insert(userTable).values({
                firstName: firstname,
                lastName: lastname,
                email,
                password: hash,
                salt
            }).returning({id: userTable.id})

            return res.status(201).json({message: 'user has been created', data: {id: result?.id}})
    }
}


export default AuthenticationController
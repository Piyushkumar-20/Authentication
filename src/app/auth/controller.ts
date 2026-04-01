import type {Request, Response} from 'express'
import {signupPayloadModel} from './models'
import {singninPayloadModel} from './models'
import {eq} from 'drizzle-orm'
import { db } from '../../db'
import { userTable } from '../../db/schema'
import {createHmac, randomBytes} from 'node:crypto'
import {sign} from 'jsonwebtoken'
import {createUserToken} from './utils/token'

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

    public async handleSignin(req: Request , res: Response){
        const validation = await singninPayloadModel.safeParseAsync(req.body)
        if (validation.error) return res.status(400).json({message: 'Body validation Failed' , error: validation.error.issues})

        const {email, password} = validation.data
        const [userSelect] = await db.select().from(userTable).where(eq(userTable.email, email))

        if(!userSelect) return res.status(404).json({message: `User with this email ${email} not found`})

        const salt = userSelect.salt
        if(!salt) return res.status(500).json({message: 'User record is missing a salt value'})

        const hash = createHmac('sha256', salt).update(password).digest('hex')

        if(userSelect.password !== hash) return res.status(400).json({message: "Invalid Credentials"}) 

    //     const jwtSecret = process.env.JWT_SECRET
    //     if(!jwtSecret) return res.status(500).json({message: 'JWT secret is not configured on the server'})

    //     const token = sign({
    //         sub: userSelect.id,
    //         email: userSelect.email,
    //         firstName: userSelect.firstName,
    //         lastName: userSelect.lastName
    //     }, jwtSecret, {expiresIn: '15m'})

    const token = createUserToken({id: userSelect.id})
    return res.status(200).json({message: 'user has been signed in', data: {token}})
    }
}


export default AuthenticationController
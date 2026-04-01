import JWT from 'jsonwebtoken'

interface UsertokenPayload {
    id: string
}

const JWT_SECRET = 'mytoken'

export function createUserToken(payload: UsertokenPayload ){
    const token = JWT.sign(payload, JWT_SECRET)
    return token
}

export function verifyUserToken(token: string ){
    try{
    const payload = JWT.verify(token, JWT_SECRET) as UsertokenPayload
    return payload
    } catch(error) {
        return null
    }
}
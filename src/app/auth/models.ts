import z from 'zod'

export const signupPayloadModel = z.object({
    firstname: z.string().min(2).max(50),
    lastname: z.string().nullable().optional(),
    email: z.email(),
    password: z.string().min(8).max(50)
})
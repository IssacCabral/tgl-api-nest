
export interface UserPayload{
    sub: string
    name: string
    email: string
    iat?: number
    exp?: number
}
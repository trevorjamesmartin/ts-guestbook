import jwt from 'jsonwebtoken';
import secrets from '../secrets';
import { UserType } from '../users/users-model';

/**
 * sign the user (payload) into a JSON Web Token
 * @param user logged in user
 * @returns 
 */
export function generateToken(user:UserType) {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        "expiresIn": "1d"
    };
    return jwt.sign(payload, secrets.jwtSecret, options);
}

/**
 * verify authorization for a given route, 
 * using a secret or a public key to decode a provided token.
 */
export default (req:any, res:any, next:any) => {
    const {authorization} = req.headers;
    if (authorization) {
        jwt.verify(authorization, secrets.jwtSecret, (err:any, decodedToken:any) => {
            if (err) {
                res.status(401).json({message:"invalid credentials"});
            } else {
                req.decodedToken = decodedToken;
                next();
            }
        });
    } else {
        res.status(400).json({message: "no credentials provided"})
    }
};

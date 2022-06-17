import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserType, DecodedToken } from '../common/types';
const JWT_SECRET = process.env.JWT_SECRET || "dont tread on me";
/**
 * sign the user (payload) into a JSON Web Token
 * @param user logged in user
 * @returns 
 */
export function generateToken(user: UserType) {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        "expiresIn": "1d"
    };
    return jwt.sign(payload, JWT_SECRET, options);
}

// io handler 
export const verifyToken = (authorization: string) => {
    if (!authorization) return false
    return jwt.verify(authorization, JWT_SECRET, (err: any, decodedToken: any) => {
        if (err) {
            return false
        } else {
            return decodedToken;
        }
    });
}

// password encryption
export const encryptString = (plaintext: string | undefined): string|undefined => {
    if (plaintext) {
        return String(bcrypt.hashSync(plaintext, 13));
    }
    return undefined;
}

// password validation
export const validateString = (password: string, hash: string): boolean => {
    if (password && hash) {
        return bcrypt.compareSync(password, hash);
    }
    return false
}

/**
 * verify authorization for a given route, 
 * using a secret or a public key to decode a provided token.
 */
export default (req: any, res: any, next: any) => {
    const { authorization } = req.headers;
    if (authorization) {
        jwt.verify(authorization, JWT_SECRET, (err: any, decodedToken: DecodedToken | any) => {
            if (err) {
                res.status(401).json({ message: "invalid credentials" });
            } else {
                const decoded: DecodedToken = decodedToken;
                req.decodedToken = decoded;
                next();
            }
        });
    } else {
        res.status(403).json({ message: "You do not have necessary permissions for the resource" });
    }
};

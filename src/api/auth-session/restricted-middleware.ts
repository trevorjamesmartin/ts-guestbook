// import Profiles from '../users/profile-model';
import jwt from 'jsonwebtoken';
import secrets from '../secrets';
import { UserType } from '../users/users-model';

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


// export default async (req:any, res:any, next:any) => {
//     const sessionExists = (req.session && req.session.loggedIn && req.session.username);
//     if (!sessionExists) {
//         console.log('no existing session, development mode only')
//         return res.redirect('/logout');        
//     }
//     // console.log(req.session)
//     let profile = await Profiles.findByUsername(req.session.username);
//     if (!profile) {
//         console.log('no profile for', req.session.username);
//         return res.redirect('/logout');
//     }
//     next();
// }

import Profiles from '../users/profile-model';

export default async (req:any, res:any, next:any) => {
    const sessionExists = (req.session && req.session.loggedIn && req.session.username);
    if (!sessionExists) {
        console.log('no existing session, development mode only')
        return res.redirect('/logout');        
    }
    console.log(req.session)
    let profile = await Profiles.findByUsername(req.session.username);
    if (!profile) {
        console.log('no profile for', req.session.username);
        return res.redirect('/logout');
    }
    next();
}

export default (req:any, res:any, next:any) => {
    if (req.session && req.session.loggedIn) {
        next();
    } else {
        res.redirect('http://localhost:3000/logout');
    }
}

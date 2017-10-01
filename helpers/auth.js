module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('errorMsg', 'Not authorized');
    res.redirect('/users/login');
  }
};

module.exports = (req, res, next) =>
{
  if (!req.session.auth.authenticated) return res.redirect('/login')
  return next()
}

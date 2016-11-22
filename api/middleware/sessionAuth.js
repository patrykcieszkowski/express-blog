var moment = require('moment')

module.exports = function(req, res, next)
{
  if (req.session.user
    && req.session.auth.authenticated
    && req.session.auth.expire >= moment().unix())
  {
    req.session.auth.expire = moment().add(10, 'minutes').unix()
  }
  else
  {
    if (req.session.user) delete req.session.user
    req.session.auth = {
      authenticated: false
    }
  }
  
  req.app.locals.session = req.session
  return next()
}

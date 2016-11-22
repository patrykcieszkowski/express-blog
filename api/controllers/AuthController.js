const bcrypt = require('bcrypt')
const moment = require('moment')

module.exports = {

  login: (req, res) =>
  {
    return res.render('auth/login')
  },

  logout: (req, res) =>
  {
    req.session.destroy((err) =>
    {
      if (err) console.error("Error ", err)
      return res.redirect('/')
    })
  },

  post_login: (req, res) =>
  {
    let data = req.body
    if (!data.login || !data.password) return res.sendStatus(403)

    models.user.findOne({login: data.login}).lean()
      .exec((err, userFound) =>
    {
      if (err) console.error("Error ", err)
      if (err || !userFound) return res.sendStatus(403)

      let passCheck = bcrypt.compareSync(data.password, userFound.password)
      if (!passCheck) return res.sendStatus(403)

      logic.user.parseUser(userFound, false, (parsedUser) =>
      {
        req.session.user = parsedUser
        req.session.auth = {
          authenticated: true,
          expire: moment().add(10, 'minutes').unix()
        }

        req.session.save()
        return res.sendStatus(200)
      })
    })
  }
}

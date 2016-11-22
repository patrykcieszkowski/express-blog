const moment = require('moment')
const async = require('async')

let userLogic = module.exports = {

  findUser: (id, parseBool, callback) =>
  {
    models.user.findOne({_id: id}).lean()
      .exec((err, userFound) =>
    {
      if (err || !userFound || !parseBool)
      {
        return callback(userFound)
      }

      userLogic.parseUser(userFound, (parsedUser) =>
      {
        return callback(userFound)
      })
    })
  },

  parseUser: (userFound, listPosts, callback) =>
  {
    delete userFound.password
    async.series([
      function(cb)
      {
        if (!userFound.group) return cb()
        models.user_group.findOne({_id: userFound.group.toString()}).lean()
          .exec((err, groupFound) =>
        {
          if (!err && groupFound)
          {
            userFound.group = groupFound
          }

          return cb()
        })
      },
      function(cb)
      {
        userFound.date = {
          stringFull: moment(userFound.createdAt).format("Do MMMM YYYY")
        }
        return cb()
      },
      function(cb)
      {
        if (!userFound.about) return cb()
        models.logic.assets.parseBBC(userFound.about, (parsedDetails) =>
        {
          userFound.about = parsedDetails
          return cb()
        })
      },
      function(cb)
      {
        if (!listPosts) return cb()
        models.logic.post.findPostsByUserId(userFound.id, (postList) =>
        {
          userFound.posts = postList
          return cb()
        })
      }
    ], () =>
    {
      return callback(userFound)
    })
  }
}

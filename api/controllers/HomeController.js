const async = require('async')
module.exports =
{
  index: (req, res) =>
  {
    let data = req.params

    models.post.find({}).sort({date: -1}).lean()
      .exec((err, postsFound) =>
    {
      if (err || !postsFound) return res.json(postsFound)
      async.forEachOf(postsFound, (post, postKey, cb) =>
      {
        logic.post.parsePost(post, true, true, (parsedPost) =>
        {
          postsFound[postKey] = parsedPost
          return cb()
        })
      }, () =>
      {
        req.app.locals.config.fullscreen = false
        return res.render('index', {page: {posts: postsFound}})
      })
    })
  },

}

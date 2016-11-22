'use strict'

module.exports = {
  tag: (req, res) =>
  {
    let data = req.params

    models.tag.findOne({name: data.tag}).lean()
      .exec((err, tagFound) =>
    {
      if (err || !tagFound) return res.redirect('/tags')
      logic.post.findPostsByTag(tagFound._id.toString(), true, (err, postsList) =>
      {
        let header = {title: "posts for '"+data.tag+"' tag"}
        req.app.locals.config.fullscreen = false
        return res.render('index', {page: {header: header, title: 'tag: '+data.tag, posts: postsList}})
      })
    })
  },
}

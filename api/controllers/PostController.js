const async = require('async')
const mongoose = require('mongoose')

module.exports = {
  article: (req, res) =>
  {
    let data = req.params
    let findQuery = {seo_name: data.seo_name}
    if (mongoose.Types.ObjectId.isValid(data.seo_name))
    {
      findQuery = { _id: data.seo_name }
    }

    models.post.findOne(findQuery).lean()
      .exec((err, postFound) =>
    {
      if (err || !postFound) return res.redirect('/')
      if (data.seo_name !== postFound.seo_name) return res.redirect('/'+postFound.seo_name)
      logic.post.parsePost(postFound, true, true, (parsedPost) =>
      {
        parsedPost.post_page = true
        req.app.locals.config.fullscreen = true
        return res.render('post', {page: {title: parsedPost.title, post: parsedPost} })
      })
    })
  },

  new_article: (req, res) =>
  {
    return res.render('post_new', {page: {title: 'new', scripts: ['/js/new_article.js']}})
  },

  post_new_article: (req, res) =>
  {
    let data = {
      title: req.body.title,
      tag: (req.body.tags) ? req.body.tags.split(',').map((k) => {return k.trim()}) : [],
      body_short: req.body.body_short,
      body: req.body.body,
      author: req.session.user._id
    }

    // if any of the values is missing
    if (Object.values(data).indexOf(undefined) > -1)
    {
      return res.sendStatus(403)
    }

    async.series([
      function(cb)
      {
        async.forEachOf(data.tag, (tag, tagKey, tagCb) =>
        {
          logic.tag.findTagByName(tag, true, (err, tagFound) =>
          {
            data.tag[tagKey] = (err || !tagFound) ? null : tagFound._id
            return tagCb()
          })
        }, () =>
        {
          data.tag.filter((k) => { return (k && k.lenght) })
          return cb()
        })
      },
      function(cb)
      {
        delete data.id
        data.seo_name = logic.assets.toSeoUrl(data.title)
        return cb()
      }
    ], () =>
    {
      let newPost = new models.post(data)
      newPost.save((err) =>
      {
        if (err) return res.sendStatus(500)
        return res.status(200).json(data).end()
      })
    })
  },

  edit_article: (req, res) =>
  {
    let data = req.params

    if (!data.seo_name) return res.redirect('/')
    models.post.findOne({seo_name: data.seo_name}).lean()
      .exec((err, postFound) =>
    {
      if (err || !postFound) return res.redirect('/')
      logic.post.parsePost(postFound, true, false, (parsedPost) =>
      {
        parsedPost.post_page = true
        parsedPost.edit = true
        req.app.locals.config.fullscreen = true
        return res.render('post_edit', {page: {title: parsedPost.title, post: parsedPost, scripts: ['/js/edit_article.js']} })
      })
    })
  },

  post_edit: (req, res) =>
  {
    let data = {
      id: req.body.id,
      title: req.body.title,
      tag: (req.body.tags) ? req.body.tags.split(',').filter((k) => { return (k.length && k !== ' ' && k !== ',') }).map((k) => {return k.trim()}) : [],
      body_short: req.body.body_short,
      body: req.body.body
    }
    // if any of the values is missing
    if (Object.values(data).indexOf(undefined) > -1)
    {
      return res.sendStatus(403)
    }

    models.post.findOne({_id: data.id})
      .exec((err, postFound) =>
    {
      if (err || !postFound) return res.sendStatus(500)
      if (!postFound.author.equals(req.session.user._id)) return res.sendStatus(401)

      async.series([
        function(cb)
        {
          async.forEachOf(data.tag, (tag, tagKey, tagCb) =>
          {
            logic.tag.findTagByName(tag, true, (err, tagFound) =>
            {
              data.tag[tagKey] = (err || !tagFound) ? null : tagFound._id
              return tagCb()
            })
          }, () =>
          {
            data.tag.filter((k) => { return (k && k.lenght) })
            return cb()
          })
        },
        function(cb)
        {
          delete data.id
          data.seo_name = logic.assets.toSeoUrl(data.title)
          return cb()
        }
      ], () =>
      {
        postFound = Object.assign(postFound, data)
        postFound.save((err) =>
        {
          if (err) return res.sendStatus(500)
          return res.sendStatus(200)
        })
      })
    })
  }
}

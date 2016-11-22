const async = require('async')

module.exports = {
  findTagById: (id, callback) =>
  {
    models.tag.findOne({_id: id}).lean()
      .exec((err, tagFound) =>
    {
      return callback(err, tagFound)
    })
  },

  findTagByName: (name, create, callback) =>
  {
    models.tag.findOne({name: name}).lean()
      .exec((err, tagFound) =>
    {
      if (!create || tagFound) return callback(err, tagFound)

      let newTag = new models.tag({name: name})
      newTag.save((err) => { return callback(err, newTag) })
    })
  },

  findTagList: (limit, page, postsBool, callback) =>
  {
    models.tag.find({}).lean()
      .exec((err, tagsFound) =>
    {
      if (err || tagsFound.lenght < 1 || !postsBool) return callback(err, tagsFound)
      async.forEachOf(tagsFound, (tag, key, cb) =>
      {
        logic.post.findPostsByTags(tag.id, true, (err, postList) =>
        {
          if (err) console.error("Error: ", err)
          tag.posts = postList
          return cb()
        })
      }, () =>
      {
        return callback(err, tagsFound)
      })
    })
  },
}

'use strict'
const async = require('async')
const moment = require('moment')

let postLogic = module.exports = {

  parsePost: (postRecord, findUserBool, parseBBC, callback) =>
  {
    async.series([
      function(cb)
      {
        postRecord.date = {
          stringFull: moment(postRecord.createdAt).format("Do MMMM, YYYY")
        }
        return cb()
      },
      function(cb)
      {
        if (!findUserBool) return cb()
        logic.user.findUser(postRecord.author, false, (parsedUser) =>
        {
          postRecord.author = parsedUser

          return cb()
        })
      },
      function(cb)
      {
        if (!parseBBC) return cb()
        logic.assets.parseBBC(postRecord.body, (parsedBody) =>
        {
          postRecord.body = parsedBody
          return cb()
        })
      },
      function(cb)
      {
        let tags = []
        async.forEachOf(postRecord.tag, (tagId, tagKey, tagCb) =>
        {
          logic.tag.findTagById(tagId, (err, tagFound) =>
          {
            tags.push(tagFound.name)
            return tagCb()
          })
        }, () => { postRecord.tag = tags; return cb() })
      }
    ], () =>
    {
      return callback(postRecord)
    })
  },

  findPostsByUserId: (user_id, callback) =>
  {
    models.post.find({author: user_id}).lean()
      .exec((err, postsFound) =>
    {
      if (err || !postsFound) return callback(err, postsFound)
      async.forEachOf(postsFound, (post, postKey, cb) =>
      {
        postLogic.parsePost(post, false, true, (parsedPost) =>
        {
          postsFound[postKey] = parsedPost
          return cb()
        })
      }, () =>
      {
        return callback(err, postsFound)
      })
    })
  },

  findPostsByTag: (tag_id, parseBool, callback) =>
  {
    models.post.find({tag: tag_id}).lean()
      .exec((err, postsFound) =>
    {
      if (err || postsFound.lenght < 1 || !parseBool) return callback(err, postsFound)
      async.forEachOf(postsFound, (post, key, cb) =>
      {
        postLogic.parsePost(post, true, true, (parsedPost) =>
        {
          postsFound[key] = parsedPost
          return cb()
        })
      }, () =>
      {
        return callback(err, postsFound)
      })
    })
  },

  findPostsByCategory: (cat_id, parseBool, callback) =>
  {
    model.post.find({category: cat_id}).lean()
      .exec((err, postsFound) =>
    {
      if (err || postsFound.lenght < 1 || !parseBool) return callback(err, postsFound)
      async.forEachOf(postsFound, (post, key, cb) =>
      {
        postLogic.parsePost(post, true, true, (parsedPost) =>
        {
          postsFound[key] = parsedPost
          return cb()
        })
      }, () =>
      {
        return callback(err, postsFound)
      })
    })
  }
}

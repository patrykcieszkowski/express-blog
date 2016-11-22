'use strict'
const async = require('async')
const express = require('express')
const session = require('express-session')
const app = module.exports = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/blog')
mongoose.Promise = global.Promise

app.locals.config = {title: 'Blog'}


let port = process.env.PORT || 3000
let routes = require(__dirname + '/config/routes')
let middlewares = {
  config: require(__dirname + '/config/middleware'),
  api: require(__dirname + '/api/middleware'),
  global: {
    path: [],
    controller: [],
  }
}

global.models = require(__dirname + '/api/models')
global.logic = require(__dirname + '/api/logic')
global.controllers = require(__dirname + '/api/controllers')

//views
app.engine('ejs', require('ejs-mate'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

//assets
app.use(express.static(__dirname + '/assets'))
//session
app.use(session({
  secret: 'JmytReTYkPeG',
  resave: false,
  saveUninitialized: false,
}))
//body
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


async.series([
  function(cb)
  {
    /* ----------------------------
            MIDDLEWARE SYSTEM
      ---------------------------- */

    if (!middlewares.config.path) middlewares.config.path = {}
    if (!middlewares.config.controller) middlewares.config.controller = {}
    async.series([
      function paths(pathsCb)
      {
        async.forEachOf(middlewares.config.path, (singleMwFunc, singleMwKey, singleMwCb) =>
        {
          let mwFunc = null
          if (singleMwKey === '*')
          {
            if (typeof singleMwFunc === 'string')
            {
              mwFunc = middlewares.config.path[singleMwKey] = middlewares.api[singleMwFunc]
            }
            else if (typeof singleMwFunc === 'function')
            {
              mwFunc = middlewares.config.path[singleMwKey] = singleMwFunc
            }

            if (mwFunc)
            {
              middlewares.global.path.push(mwFunc)
            }
          }
          return singleMwCb()
        }, pathsCb)
      },
      function controllers(contrCb)
      {
        async.forEachOf(middlewares.config.controller, (contrMwFunc, contrMwKey, contrMwCb) =>
        {
          let mwFunc = null
          if (contrMwKey === '*')
          {
            if (typeof contrMwFunc === 'string')
            {
              mwFunc = middlewares.config.controller[contrMwKey] = middlewares.api[contrMwFunc]
            }
            else if (typeof contrMwFunc === 'function')
            {
              mwFunc = middlewares.config.controller[contrMwKey] = contrMwFunc
            }

            if (mwFunc)
            {
              middlewares.global.controller.push(mwFunc)
            }
          }
          return contrMwCb()
        }, contrCb)
      }
    ], cb)
  },
  function(cb)
  {
    /* ----------------------------
            ROUTING SYSTEM
      ---------------------------- */
    let allowedReqTypes = ['get', 'post', 'put', 'all']
    async.forEachOf(routes, (route, key, routeCb) =>
    {
      let mwList = middlewares.global.path
      /* find request type. Default = get */
      let _path = key, _method = 'get'
      if (key.indexOf(' ') > -1)
      {
        key = key.split(' ')
        if (allowedReqTypes.indexOf(key[0]) > -1)
        {
          _method = key[0]
          _path = key[1]
        }
      }

      if (typeof route === 'string')
      {
        /* make sure route is in valid format. Stop if it doesn't specify either controler file or route function */
        if (route.indexOf('.') < 0) return routeCb()
        let _routeContr = route.split('.')
        if (!global.controllers[_routeContr[0]]
          || !global.controllers[_routeContr[0]][_routeContr[1]])
        {
          return routeCb()
        }

        mwList = mwList.concat(middlewares.global.controller)
        let _controllerMWConf = middlewares.config.controller[_routeContr[0]]
        if (_controllerMWConf)
        {
          Object.keys(_controllerMWConf).forEach((mwKey) =>
          {
            if (mwKey === '*' || mwKey === _routeContr[1])
            {
              let mwFunc = null
              if (typeof _controllerMWConf[mwKey] === 'string')
              {
                mwFunc = middlewares.api[_controllerMWConf[mwKey]]
              }
              else if (typeof _controllerMWConf[mwKey] === 'function')
              {
                mwFunc = _controllerMWConf[mwKey]
              }

              if (mwFunc)
              {
                mwList.push(mwFunc)
              }
            }
          })
        }

        let _pathMWConf = middlewares.config.path[_path]
        if (_pathMWConf)
        {
          let mwFunc = null
          if (typeof _pathMWConf === 'string')
          {
            mwFunc = middlewares.api[_pathMWConf]
          }
          else if (typeof _pathMWConf === 'function')
          {
            mwFunc = _pathMWConf
          }

          if (mwFunc)
          {
            mwList.push(mwFunc)
          }
        }

        return assignFuncToRoute(global.controllers[_routeContr[0]][_routeContr[1]])
      }
      else if (typeof route === 'function')
      {
        return assignFuncToRoute(route)
      }
      else
      {
        console.error("Error: route '"+key+"' is invalid.")
        return routeCb()
      }

      function assignFuncToRoute(func)
      {
        app[_method](_path, mwList, func)
        return routeCb()
      }
    }, cb)
    //
    // Object.keys(routes).forEach((key) =>
    // {
    //   /* find request type. Default = get */
    //   let _path, _method
    //   if (key.indexOf(' ') < 0)
    //   {
    //     _path = key
    //     _method = 'get'
    //   }
    //   else
    //   {
    //     key = key.split(' ')
    //     _method = key[0]
    //     _path = key[1]
    //   }
    //
    //   /* make sure route is set properly. Stop if it doesn't specify either controler file or route function */
    //   if (routes[_path].indexOf('.') < 0) return
    //   let _routeContr = routes[_path].split('.')
    //
    //   Object.keys(controllers).forEach((contrKey) =>
    //   {
    //     if (!controllers[_routeContr[0]]) return
    //     Object.keys(controllers[contrKey]).forEach((funcKey) =>
    //     {
    //       if (!controllers[contrKey][_routeContr[1]]) return
    //       let routeControllerFunc = controllers[contrKey][_routeContr[1]]
    //
    //       /* assign correct request type */
    //       switch(_method)
    //       {
    //         case 'get':
    //         {
    //           app.get(_path, routeControllerFunc)
    //           break;
    //         }
    //         case 'post':
    //         {
    //           app.post(_path, routeControllerFunc)
    //           break;
    //         }
    //         case 'put':
    //         {
    //           app.put(_path, routeControllerFunc)
    //           break;
    //         }
    //       }
    //     })
    //   })
    // })
  }
], () =>
{
  app.listen(port, () =>
  {
    console.log("Blog listening on port ", port);
  })
})

# Express-Blog
### blog script
[![license](https://img.shields.io/dub/l/vibe-d.svg)](https://github.com/patrykcieszkowski/node-bbcode)
[![paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Z75DMS8AVZY5Y)

Express-Blog is express and mongoose based blog script, made in MVC model. Based on easy-js(https://github.com/patrykcieszkowski/easy-js) starter-pack and node-bbcode(https://github.com/patrykcieszkowski/node-bbcode).

# Contents
  - [Installation](#installation)
  - [Config](#options)
  - [Structure](#structure)

# Installation [^](#installation)
  ```js
    $ git clone https://github.com/patrykcieszkowski/express-blog.git
  ```

# Config [^](#config)
express-blog uses easy-js's(https://github.com/patrykcieszkowski/easy-js) routes and middleware config script.

  ### Routes
  List of routes provided by default on current version.
  ```
    // auth
    '/login': 'AuthController.login',
    '/logout': 'AuthController.logout',
    'post /login': 'AuthController.post_login',

    // tags
    '/tags/:tag': 'TagsController.tag',

    '/': 'HomeController.index',
    '/:seo_name': 'PostController.article',
    '/:seo_name/edit': 'PostController.edit_article',
    'post /post/edit': 'PostController.post_edit',

    // new post
    '/post/new': 'PostController.new_article',
    'post /post/new': 'PostController.post_new_article',
  ```

  ### Middlewares
  ```
    /*
      gets assigned for specific group of URL path. (all types of requests)
      For example:
        '/admin': 'adminAuth'
      will run middleware 'adminAuth' for all types of requests on URL '/admin'
     */
    path: {

    },

    /*
      gets fired only when pointed route is refering to specific controller OR it's function
      For example:
        'AdminController': 'adminAuth'
        AND
        'AdminController': {
          '*': 'adminAuth'
        }
      will run middleware 'adminAuth' for all requests pointed to 'AdminController'
      ------------

      However you can specify the exact function in the controller.
      For example:
        'AdminController': {
          'post_update': 'adminAuth'
        }

      will run middleware only if requested route points to 'AdminController' and 'post_update' function
      ------------

      You can also point middleware to all the controllers by using '*' selector.
      However, then you're not able to point to specific function by it's name.

      You can point to multiple middlewares with use of an array.
    */

    controller: {
      '*': 'sessionAuth',
      'AuthController': {
        'login': (req, res, next) =>
        {
          if (req.session.auth.authenticated) return res.redirect('/')
          return next()
        },
      },
      'PostController': {
        'edit_article': 'authVerify',
        'post_edit': 'authVerify',
        'new_article': 'authVerify',
        'post_new_article': 'authVerify',
      }
    }
  ```

# Structure [^](#structure)
express-blog uses easy-js's(https://github.com/patrykcieszkowski/easy-js) default file structure.
  ```
    - api/
    -- controllers/
    --- AuthController.js (controller)
    --- HomeController.js (controller)
    --- PostController.js (controller)
    --- TagsController.js (controller)
    --- index.js
    -- logic/
    --- assets.js
    --- post.js
    --- tag.js
    --- user.js
    -- middleware/
    --- authVerify.js
    --- sessionAuth.js
    --- index.js
    -- models/
    --- category.js
    --- post.js
    --- tag.js
    --- user.js
    --- user_group.js
    --- index.js
    - assets/
    -- css/
    -- js/
    - config/
    - views/
    - app.js
    - package.json

  ```

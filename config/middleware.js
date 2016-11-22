module.exports = {

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
}

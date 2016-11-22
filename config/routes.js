module.exports = {
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
}

/* Inject the site's extra stylesheets.
   Kept as a site script so the vendored cactus theme stays untouched.
   - highlight-compat.css: highlight.js v11 token names the theme lacks rules for
   - post-terms.css: category colour coding for prose terms */
['css/highlight-compat.css', 'css/post-terms.css'].forEach(function (href) {
  hexo.extend.injector.register(
    'head_end',
    '<link rel="stylesheet" href="' + hexo.config.root + href + '">',
    'default'
  );
});

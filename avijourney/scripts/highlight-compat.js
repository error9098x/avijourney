/* Inject the highlight.js v11 token compatibility stylesheet.
   Kept as a site script so the vendored cactus theme stays untouched. */
hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="' + hexo.config.root + 'css/highlight-compat.css">',
  'default'
);

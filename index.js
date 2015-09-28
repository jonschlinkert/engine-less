'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var utils = require('./utils');

/**
 * Less support.
 */

var engine = utils.engineUtils.fromStringRenderer('less');

/**
 * Expose `less`, to give users access to the same instance
 */

engine.less = require.less || (require.less = require('less'));

/**
 * engine defaults
 */

engine.options = {
  src: {ext: '.less'},
  dest: {ext: '.css'},
  layout: null,

  lessRenderMode: 'string',
  silent: false,
  compress: false,
  sourceMap: false,
  paths: [],
};

var optsKeys = [
  'chunkInput',
  'compress',
  'dumpLineNumbers',
  'globalVars',
  'modifyVars',
  'ieCompat',
  'importantScope',
  'importMultiple',
  'insecure',
  'javascriptEnabled',
  'mime',
  'paths',
  'pluginManager',
  'processImports',
  'reference',
  'relativeUrls',
  'rootpath',
  'sourceMap',
  'strictImports',
  'strictMath',
  'strictUnits',
  'syncImport',
  'urlArgs',
  'useFileCache'
];

/**
 * Less string support. Process the given `str` of less and invoke
 * the callback `callback(err, css)`.
 *
 * ```js
 * var str = '@red: #900;\n.foo {color: @red;}';
 * engine.render(str, function (err, css) {
 *   console.log(css);
 *   //=> '.foo {\n  color: #990000;\n}\n'
 * });
 * ```
 *
 * @param {String} `str`
 * @param {Object|Function} `options` or callback.
 * @param {Function} `callback`
 * @api public
 */

engine.render = function render(str, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  options = utils.merge({}, options, options.settings);
  // only pass valid options to less
  var keys = optsKeys.concat(Object.keys(engine.options));
  var opts = utils.pick(options, keys);
  utils.merge(opts, engine.options, options);

  try {
    engine.less.render(str, opts, function (err, res) {
      if (err) return cb(formatError(err));

      if (opts.lessRenderMode === 'object') {
        cb(null, res);
      } else {
        engine.res = res;
        cb(null, res.css);
      }
    });
  } catch (err) {
    cb(err);
  }
};

/**
 * Less file support. Process a `.less` file at the given `fp` and
 * callback `callback(err, css)`.
 *
 * ```js
 * var less = require('engine-less');
 * less.renderFile('my-styles.less', {}, function (err, css) {
 *   console.log(css);
 *   //=> '.aaa {\n  color: blue;\n}\n'
 * });
 * ```
 *
 * @param {String} `filepath`
 * @param {Object|Function} `options` or callback function.
 * @param {Function} `callback`
 * @api public
 */

engine.renderFile = function renderFile(fp, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  try {
    // arguments[0] = fs.readFileSync(arguments[0], 'utf8');
    // engine.render.apply(engine, arguments);
    var str = fs.readFileSync(fp, 'utf8');
    utils.merge(engine.options. options);
    engine.render(str, options, cb);
  } catch (err) {
    cb(err);
  }
};

/**
 * Expose `engine`
 */

module.exports = engine;

/**
 * Helper function
 */

function formatError(err) {
  err.message = err.message
    + ' in file: ' + err.filename
    + ' line no: ' + err.line;
  return err;
}

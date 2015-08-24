'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var utils = require('engine-utils');
var extend = require('extend-shallow');
var pick = require('object.pick');
var red = require('ansi-red');

/**
 * Less support.
 */

var engine = utils.fromStringRenderer('less');

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

  options = options || {};
  extend(options, options.settings);

  // only pass valid options to less
  var opts = pick(options, optsKeys.concat(Object.keys(engine.options)));
  opts = extend({}, engine.options, opts);

  try {
    engine.less.render(str, opts, function (err, res) {
      if (err) {
        cb(logError(err, opts));
        return;
      }
      if (opts.lessRenderMode === 'object') {
        cb(null, res);
      } else {
        cb(null, res.css);
      }
    });
  } catch (err) {
    cb(logError(err, opts));
    return;
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

  options = extend({}, engine.options, options);
  extend(options, options.settings);

  try {
    fs.readFile(fp, 'utf8', function (err, str) {
      engine.render(str, options, cb);
    });
  } catch (err) {
    cb(logError(err, options));
    return;
  }
};

/**
 * Expose `engine`
 */

module.exports = engine;

/**
 * Helper function
 */

function logError(err, options) {
  err.message = err.message
    + ' in file: ' + err.filename
    + ' line no: ' + err.line;

  console.log(red('%j'), err);
  return err;
}

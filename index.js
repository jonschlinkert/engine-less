'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var utils = require('engine-utils');
var extend = require('extend-shallow');
var chalk = require('chalk');
var less = require('less');

/**
 * Less support.
 */

var engine = utils.fromStringRenderer('less');

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

  options = extend({}, engine.options, options);
  try {
    less.render(str, options, function (err, res) {
      if (err) {
        cb(logError(err, options));
        return;
      }
      if (options.lessRenderMode === 'object') {
        cb(null, res);
      } else {
        cb(null, res.css);
      }
    });
  } catch (err) {
    cb(logError(err, options));
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

  if (options.silent !== true) {
    console.log(chalk.red('%j'), err);
  }
  return err;
}

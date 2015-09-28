/*!
 * engine-less <https://github.com/jonschlinkert/engine-less>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
require('should');
var fs = require('fs');
var assert = require('assert');
var templates = require('templates');
var engine = require('..');
var app;

describe('engine-less', function() {
  describe('.render()', function() {
    it('should expose engine options:', function() {
      engine.options.should.have.properties('dest', 'src', 'layout');
    });

    it('should pass engine errors along', function(done) {
      var str = '%$red: #900;\n.foo {color: @red;}';
      engine.render(str, function (err, css) {
        assert(typeof err === 'object');
        err.message.should.equal('Unrecognised input in file: input line no: 1')
        done();
      });
    });

    it('should process a LESS string.', function(done) {
      var str = '@red: #900;\n.foo {color: @red;}';
      engine.render(str, function (err, css) {
        css.should.equal('.foo {\n  color: #900;\n}\n');
        done();
      });
    });

    it('should return an object if `lessRenderMode` is `object`', function(done) {
      var str = '@red: #900;\n.foo {color: @red;}';
      engine.render(str, {lessRenderMode: 'object'}, function (err, css) {
        css.should.have.property('css', '.foo {\n  color: #900;\n}\n');
        done();
      });
    });
  });

  describe('.renderFile()', function() {
    it('should return a CSS string from a LESS file.', function(done) {
      engine.renderFile('test/fixtures/styles.less', function (err, css) {
        css.should.equal('.aaa {\n  color: blue;\n}\n');
        done();
      });
    });

    it('should use modifyVars defined on the options', function(done) {
      var opts = {modifyVars: {'color': 'foo'}};
      engine.renderFile('test/fixtures/custom.less', opts, function (err, css) {
        css.should.equal('.aaa {\n  color: foo;\n}\n');
        done();
      });
    });

    it('should use globalVars defined on the options', function(done) {
      var opts = {globalVars: {'color': 'bar'}}
      engine.renderFile('test/fixtures/custom.less', opts, function (err, css) {
        css.should.equal('.aaa {\n  color: bar;\n}\n');
        done();
      });
    });

    it('should pass engine errors along', function(done) {
      engine.renderFile('foo', function (err, css) {
        assert(typeof err === 'object');
        err.message.should.equal('ENOENT, no such file or directory \'foo\'');
        done();
      });
    });
  });
});

describe('templates usage', function() {
  beforeEach(function () {
    app = templates();
  });

  it('should work with templates library (also works with assemble)', function(done) {
    app.engine('less', require('..'));
    app.create('styles');
    app.style('foo.less', {
      content: fs.readFileSync('test/fixtures/styles.less')
    });

    app.render('foo.less', function (err, css) {
      if (err) return done(err);
      css.content.should.equal('.aaa {\n  color: blue;\n}\n');
      done();
    });
  });
});

/*!
 * engine-less <https://github.com/jonschlinkert/engine-less>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var assemble = require('assemble');
var verb = require('verb');
var engine = require('..');

describe('.render()', function() {
  it('should process a LESS string.', function(done) {
    var str = '@red: #900;\n.foo {color: @red;}';
    engine.render(str, function (err, css) {
      css.should.equal('.foo {\n  color: #990000;\n}\n');
      done();
    });
  });

  it('should return an object if `lessRenderMode` is `object`', function(done) {
    var str = '@red: #900;\n.foo {color: @red;}';
    engine.render(str, {lessRenderMode: 'object'}, function (err, css) {
      css.should.have.property('css', '.foo {\n  color: #990000;\n}\n');
      done();
    });
  });
});

describe('.renderFile()', function() {
  it('should process a LESS file.', function(done) {
    engine.renderFile('test/fixtures/styles.less', function (err, css) {
      css.should.equal('.aaa {\n  color: blue;\n}\n');
      done();
    });
  });
});

describe('assemble usage', function() {
  it('should work with assemble', function(done) {
    assemble.engine('less', require('..'));
    // this isn't necessary, but it's more semantic than using `assemble.page()`
    assemble.create('style', {isRenderable: true});
    assemble.styles('test/fixtures/styles.less');

    assemble.render('styles', function (err, css) {
      css.should.equal('.aaa {\n  color: blue;\n}\n');
      done();
    });
  });
});

describe('verb usage', function() {
  it('should work with verb', function(done) {
    verb.engine('less', require('..'));
    // this isn't necessary, but it's more semantic than using `verb.page()`
    verb.create('style', {isRenderable: true});
    verb.styles('test/fixtures/styles.less');

    verb.render('styles.less', function (err, css) {
      css.should.equal('.aaa {\n  color: blue;\n}\n');
      done();
    });
  });
});

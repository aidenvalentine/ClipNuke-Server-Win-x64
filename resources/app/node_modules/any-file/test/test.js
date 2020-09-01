var fs = require('fs'),
    debug = require('debug')('app'),
    assert = require('assert'),
    AnyFile = require('../'),
    anyfile;

describe('anyfile', function () {

  var deleteFile = function(filePath, callback) {
    fs.unlink(filePath, callback);
  };

  this.timeout(10000);//10 seconds

  beforeEach(function(done){
    anyfile = new AnyFile();
    done();
  });

  afterEach(function(done){
    done();
  });

  it('should have main methods', function () {
    assert.ok(anyfile.from);
  });

  it('ftp copy to local', function (done) {
    anyfile.from("ftp://anonymous:miemail%40gmail.com@speedtest.tele2.net/100KB.zip").to("100KB.zip", function(err, res) {
      assert.ok(res);
      deleteFile("100KB.zip", done);
    });
  });

  it('http copy to local', function (done) {
    anyfile.from("http://d28rz98at9flks.cloudfront.net/61395/61395_user_guide.pdf").to("61395_user_guide.pdf", function(err, res) {
      assert.ok(res);
      deleteFile("61395_user_guide.pdf", done);
    });
  });

  it('https copy to local', function (done) {
    anyfile.from("https://docs.uproc.io/pdf/resumen_del_servicio_ES.pdf").to("resumen_del_servicio_ES.pdf", function(err, res) {
      assert.ok(res);
      deleteFile("resumen_del_servicio_ES.pdf", done);
    });
  });

  it('http auth copy to local', function (done) {
    anyfile.from("http://anonymous:miemail%40gmail.com@docs.uproc.io/pdf/resumen_del_servicio_ES.pdf").to("resumen_del_servicio_ES.pdf", function(err, res) {
      assert.ok(res);
      deleteFile("resumen_del_servicio_ES.pdf", done);
    });
  });

  it('sftp copy to local', function (done) {
    anyfile.from("scp://demo:password@test.rebex.net/readme.txt").to("readme.txt", function(err, res) {
      assert.ok(res);
      deleteFile("readme.txt", done);
    });
  });

  it('sftp copy to s3', function (done) {
    anyfile.from("scp://demo:password@test.rebex.net/readme.txt").to("s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/readme.txt", function(err, res) {
      assert.ok(res);
      done();
    });
  });

  it('s3 copy to s3', function (done) {
    anyfile.from("s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/readme.txt").to("s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.eu-central-1.amazon.com/any-file-us/readme-final.txt", function(err, res) {
      assert.ok(res);
      done();
    });
  });

  it('compress - s3 copy to local gz', function (done) {
    anyfile.from("s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/readme.txt").to("readme-final.txt.gz", function(err, res) {
      assert.ok(res);
      deleteFile("readme-final.txt.gz", done);
    });
  });

  it('compress - s3 copy to local zip', function (done) {
    anyfile.from("s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/readme.txt").to("readme-final.txt.zip", function(err, res) {
      assert.ok(res);
      deleteFile("readme-final.txt.zip", done);
    });
  });
});

var anyfile = require(__dirname + '/..')();
var fromFile = "s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/100KB.zip";
var toFile = "s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3-eu-west-1.amazon.com/any-file-us/100KBABC.zip";

try {
  anyfile.from(fromFile).to(toFile, function(err, res) {
    console.log(res);
    process.exit();
  });
} catch (err) {
  console.log(err);
}
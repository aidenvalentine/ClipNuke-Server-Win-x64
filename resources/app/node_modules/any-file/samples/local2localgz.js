var anyfile = require(__dirname + '/..')();
var fromFile = "/etc/hosts";
var toFile = "hosts.new.gz";

try {
  anyfile.from(fromFile).to(toFile, function(err, res) {
    console.log(res);
    process.exit();
  });
} catch (err) {
  console.log(err);
}

var anyfile = require(__dirname + '/..')();
var fromFile = "/home/mcolomer/Descargas/57c42dc738d6a51334cf562c-original.csv.gz";
var toFile = "57c42dc738d6a51334cf562c-original.csv";

try {
  anyfile.from(fromFile).to(toFile, function(err, res) {
    console.log(res);
    process.exit();
  });
} catch (err) {
  console.log(err);
}

var anyfile = require(__dirname + '/..')();
var fromFile = "https://docs.uproc.io/pdf/resumen_del_servicio_ES.pdf";
var toFile = "resumen_del_servicio_ES.pdf";

try {
  anyfile.from(fromFile).to(toFile, function(err, res) {
    console.log(res);
    process.exit();
  });
} catch (e) {
  console.log(e);
}
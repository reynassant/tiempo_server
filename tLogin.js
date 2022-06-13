var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "krono",
  database: "ltiempo",
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM registro;", function (err, result, fields) {
    if (err) throw err;
    // console.log(result);
    imprimeUsuarios(result) 
  });
});


function imprimeUsuarios(result)
{
  function imprimeUsuario(u)
  {

    
    console.log(`textInvewntau : <${u.email}>>>>>>>[${u.Nombre}] -- (${u.Apellido})`);
  }

  for (i in result)
  {
    imprimeUsuario(result[i]);
  }
}

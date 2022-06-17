const crypto = require("crypto");
const { executeQuery } = require("./ddbb-core");

function registrarUsuario(usuario, pass, res) {
  function getDatetime() {
    var currentdate = new Date();
    var datetime =
      currentdate.getFullYear() +
      "-" +
      currentdate.getMonth() +
      "-" +
      currentdate.getDay() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    return datetime;
  }

  var newUser = {
    usuario: usuario || `U_${getDatetime()}`,
    pass: pass || "abcde",
    salt: crypto.randomBytes(22).toString("hex"),
  };
  newUser.hash = crypto
    .createHash("sha256")
    .update(newUser.pass + newUser.salt)
    .digest("hex");

  var queryNewUser = `
        INSERT INTO registro
        (usuario, hash, salt)
        VALUES
        (
            '${newUser.usuario}',
            '${newUser.hash}',
            '${newUser.salt}'
        );`;

  const callbackNewUser = function (result, res) {
    console.log(`Inserted User: ${result.insertId}`);
    res.send(`Inserted User: ${result.insertId}`);
  };

  executeQuery(queryNewUser, callbackNewUser, res);
}

function loginUsuario(usuario, pass, res) {
  // newUser.hash = crypto.createHash('sha256').update(newUser.pass + newUser.salt).digest('hex');
  var queryLogin = `
    SELECT idRegistro, usuario, \`hash\`, salt 
    FROM ltiempo.registro 
    WHERE usuario="${usuario}";`;

  const callbackLogin = function (result, res) {
    var resultado = undefined;

    if (result.length <= 0) {
      resultado = {
        status: 1, // 0 Usuario logueado, 1 Usuario incorrecto, 2 Contraseña incorrecta
        idUser: undefined,
        nameUser: undefined,
        msg: "Usuario incorrecto",
      };
    } else {
      // Si existe entonces verificamos contraseña
      //Calculamos hash de input
      var hash_in = crypto
        .createHash("sha256")
        .update(pass + result[0].salt)
        .digest("hex");
      // console.log(pass_in)
      // console.log(result[0].hash)
      // Comparamos el hash de input con el hash de la base de datos
      if (hash_in == result[0].hash) {
        // console.log('Usuario Autenticado!!!! Puede Acceder a la Pagina');
        resultado = resultado = {
          status: 0, // 0 Usuario logueado, 1 Usuario incorrecto, 2 Contraseña incorrecta
          idUser: result[0].idRegistro,
          nameUser: result[0].usuario,
          msg: "Usuario logueado",
        };
      } else {
        resultado = {
          status: 2, // 0 Usuario logueado, 1 Usuario incorrecto, 2 Contraseña incorrecta
          idUser: undefined,
          nameUser: undefined,
          msg: "Constraseña incorrecta",
        };
      }
    }

    res.send(resultado);
  };

  executeQuery(queryLogin, callbackLogin, res);
}

// loginUsuario("Pedro", "123");
// registrarUsuario("usuario987987", "pass");
// return id_usuario  OR ¿?¿?
// function loginUsuario(usuario, pass) { return 62;}
// function addUbicacion(id_usuario, nombre, lat, lon) {}
// function listaUbicacion(id_usuario) {}

module.exports = {
  registrarUsuario: registrarUsuario,
  loginUsuario: loginUsuario,
  // addUbicacion: addUbicacion,
  // listaUbicacion: listaUbicacion,
};

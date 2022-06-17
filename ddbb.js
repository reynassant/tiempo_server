const dotenv = require('dotenv').config();
const crypto = require('crypto');
const mysql = require('mysql');
//const axios = require('axios');

const apiKey = {
    positionStack: "4135e834e062ecba56ae7aaa12e8c353",
    openWeatherMap: "574e6bfed3631e8850f21f8c2cf9c59d"
}

const ddbbConf = {
    host: "localhost",
    user: "root",
    password: process.env.SQLPASS || "krono",
    database: "ltiempo",
}

function registrarUsuario(usuario, pass)
{
    function getDatetime() {
        var currentdate = new Date();
        var datetime =
            currentdate.getFullYear() + '-' +
            currentdate.getMonth() + '-' +
            currentdate.getDay() + " " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
    
        return datetime;
    }

    var newUser = 
    {
        usuario: usuario || `U_${getDatetime()}`,
        pass: pass || 'abcde',
        salt: crypto.randomBytes(22).toString("hex"),
    }
    newUser.hash = crypto.createHash('sha256').update(newUser.pass + newUser.salt).digest('hex');

    var queryIns = `
        INSERT INTO registro
        (usuario, hash, salt)
        VALUES
        (
            '${newUser.usuario}',
            '${newUser.hash}',
            '${newUser.salt}'
        );`;


    var con = mysql.createConnection(ddbbConf);

    try
    {
        con.connect(function(err) {
            if (err) throw err;

            con.query(queryIns, function(err, result, fields) {
                if (err) throw err;
                console.log(`Inserted User: ${result.insertId}`);
                con.end();
            });
        });
    } catch (err) {
        con.end();

        const errMsg = `FALLO AL INSERTAR USUARIO`;
        console.log(errMsg);
    }
}

function loginUsuario(usuario, pass)
{
    // newUser.hash = crypto.createHash('sha256').update(newUser.pass + newUser.salt).digest('hex');

    var querySel = `
    SELECT idRegistro, usuario, \`hash\`, salt 
    FROM ltiempo.registro 
    WHERE usuario="${usuario}";`;

    var con = mysql.createConnection(ddbbConf);

    try
    {
        con.connect(function(err) {
            if (err) throw err;

            con.query(querySel, function(err, result, fields) {
                if (err) throw err;
                console.log(result);
                console.log("************");
                con.end();
            });
        });
    } catch (err) {
        con.end();

        const errMsg = `FALLO AL LOGUEAR USUARIO`;
        console.log(errMsg);
    }
}

/*
{
    status: 1, // 0 usuario logueado, 1 Usuario incorrecto, 2 Contraseña incorrecta
    idUser: undefined, 
    nameUser: undefined,
    msg: "Usuario incorrecto" 

}
*/

// loginUsuario("Pedro","pass");
// registrarUsuario("usuario987987", "pass");
// return id_usuario  OR ¿?¿?
// function loginUsuario(usuario, pass) { return 62;}
// function addUbicacion(id_usuario, nombre, lat, lon) {}
// function listaUbicacion(id_usuario) {}

/*
function imprimeUsuarios(result) {
    function imprimeUsuario(u) {
        console.log(`U_Invent: <${u.idRegistro}--${u.usuario}>>>>>>>[${u.hash}] -- (${u.salt})`);

    }

    for (i in result) {
        imprimeUsuario(result[i]);

    }
}

con.query("SELECT * FROM registro;", function(err, result, fields) {
    if (err) throw err;
    //console.log(result);
    //imprimeUsuarios(result)

});

var queryInsCiudad = `INSERT INTO ciudades (ciudad,lat,lon) VALUES (?,?,?);`;

var querySel = "SELECT * FROM registro;";

con.query(querySel, function(err, result, fields) {
    if (err) throw err;
    console.log(result);
    imprimeUsuarios(result)
});

var UsrtInpt = {
    usr_input: '06_usuario',
    pass_input: 'abcde'
};

var queryFindUsr = "SELECT * FROM registro WHERE usuario = ?;";

con.query(queryFindUsr, [UsrtInpt.usr_input], function(err, result, fields) {
    if (err) throw err;
    // Si no conseguimos el usuario
    if (result.length <= 0) {
        console.log('Usuario no existe')
    } else { // Si existe entonces verificamos contraseña

        console.log('Usuario Existe, verificando contrasena:')
        var hash_in = crypto.createHash('sha256').update(UsrtInpt.pass_input + result[0].salt).digest('hex')
        // console.log(pass_in)
        // console.log(result[0].hash)
        if (hash_in == result[0].hash) {
            console.log('Usuario Autenticado!!!! Puede Acceder a la Pagina')
        } else {
            console.log('Password invalida, intentelo de nuevo')
        }
        //crypto.createHash('sha256').update(newUser.pass + newUser.salt).digest('hex')
    }
    // console.log('Resultado es:');
    // console.log(result);

    var InputCiudad = "Guadalajara Espana"
    console.log("Buscando " + InputCiudad + " en la base de datos")
    var queryBuscaCiudad = "SELECT * FROM ciudades WHERE ciudad = ?;";
    con.query(queryBuscaCiudad, [InputCiudad], function(err, result, fields) {
        if (err) throw err;

        // Si no conseguimos la ciudad

        if (result.length <= 0) {
            console.log(InputCiudad + ' no existe en la base datos')

            console.log("Buscando " + InputCiudad + " en pointstack API")
            var configPS = {
                method: 'get',
                url: `http://api.positionstack.com/v1/forward?access_key=${apiKey.positionStack}&query=${InputCiudad}`,
                headers: {}
            };

            axios(configPS)
                .then(function(response) {
                    //console.log(JSON.stringify(response.data));
                    //console.log(response.data.data)
                    if (response.data.data.length > 0) {
                        var ciudadAPI = response.data.data[0]
                        var ciudadOutput = ciudadAPI
                        console.log(ciudadAPI)
                        console.log("Ciudad Encontrada:" + ciudadAPI.label)

                        // Tengo que verificar que la ciudad no esta guardada en el database con el label que  obtuve de la API

                        con.query(queryBuscaCiudad, [ciudadAPI.label], function(err, result, fields) {
                            if (err) throw err;
                            // Si no conseguimos la ciudad
                            if (result.length <= 0) {
                                console.log(ciudadAPI.label + ' no existe en la base datos')
                                console.log("Agregar " + ciudadAPI.label + " a la base de datos")
                                con.query(queryInsCiudad, [ciudadAPI.label, ciudadAPI.latitude, ciudadAPI.longitude], function(err, result, fields) {
                                    if (err) throw err;
                                    console.log("Ciudad " + ciudadAPI.label + " agregada a la base de datos")
                                });
                            };
                        });

                        // Teniendo Latitud y Longitud buscamos el tiempo con openweather

                        var configOWM = {
                            method: 'get',
                            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${ciudadAPI.latitude}&lon=${ciudadAPI.longitude}&exclude=hourly,daily&appid=${apiKey.openWeatherMap}&units=metric&lang=ES`,
                            headers: {}
                        };

                        axios(configOWM)
                            .then(function(response) {
                                //console.log(JSON.stringify(response.data));
                                console.log('Temperatura:' + response.data.current.temp + "C")
                                console.log('Sensacion terminca:' + response.data.current.feels_like + "C")
                                console.log('Humedad:' + response.data.current.humidity + `%`)
                                console.log(response.data.current.weather[0].description)
                            })
                            .catch(function(error) {
                                console.log(error);
                            });



                    } else {
                        console.log("Ciudad no encontrada")
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    });
});
*/

module.exports = {
    registrarUsuario: registrarUsuario,
    // loginUsuario: loginUsuario,
    // addUbicacion: addUbicacion,
    // listaUbicacion: listaUbicacion,
}
